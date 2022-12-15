import { IMTarget, emitter, DomainTypes } from '@/ts/core';
import { kernel } from '@/ts/base';
import { JOIN_SHOPING_CAR } from '@/constants/const';
import { message } from 'antd';
import { Emitter } from '@/ts/base/common';
import userCtrl from '../setting/userCtrl';
import { XMerchandise } from '@/ts/base/schema';

export enum MarketCallBackTypes {
  'ApplyData' = 'ApplyData',
  'MarketShop' = 'MarketShop',
  'UserManagement' = 'UserManagement',
}

class MarketController extends Emitter {
  /** 市场操作对象 */
  private _target: IMTarget;
  /** 购物车商品列表 */
  private _shopinglist: XMerchandise[] = [];

  constructor() {
    super();
    this._target = userCtrl.space;
    emitter.subscribePart([DomainTypes.Company, DomainTypes.User], async () => {
      this._target = userCtrl.space;
      await this._target.getJoinMarkets();
      /* 获取 历史缓存的 购物车商品列表 */
      kernel.anystore.subscribed(JOIN_SHOPING_CAR, 'user', (data: any) => {
        this._shopinglist = data.data || [];
        this.changCallbackPart(MarketCallBackTypes.ApplyData);
      });
      this.changCallback();
    });
  }

  /**
   * @description: 获取购物车商品列表的方法
   * @return {*}
   */
  public get shopinglist(): XMerchandise[] {
    return this._shopinglist;
  }

  /** 市场操作对象 */
  public get target(): IMTarget {
    return this._target;
  }

  /**
   * @description: 添加购物车
   * @param {XMerchandise} data
   * @return {*}
   */
  public appendStaging = async (data: XMerchandise) => {
    if (this._shopinglist.find((item) => item.id === data.id)) {
      message.warning('该商品已暂存.');
    } else {
      this._shopinglist.push(data);
      this.updateShppingCard();
      message.success('暂存成功.');
    }
  };

  /**
   * @description: 移除购物车
   * @param {any} data
   * @return {*}
   */
  public removeStaging(merchandises: XMerchandise[]) {
    this._shopinglist = this._shopinglist.filter((a) => !merchandises.includes(a));
    this.updateShppingCard();
    message.success('移出成功');
  }

  /**
   * @description: 购买商品
   * @param {any} data
   * @return {*}
   */
  public async createOrder(merchandises: XMerchandise[]) {
    let count = merchandises.length;
    if (
      await this._target?.createOrder(
        '',
        merchandises[0].caption + (count > 1 ? `...等${count}件商品` : ''),
        new Date().getTime().toString().substring(0, 13),
        userCtrl.space.id,
        merchandises.map((a) => a.id),
      )
    ) {
      this._shopinglist = this._shopinglist.filter(
        (item) => !merchandises.find((a) => a.id != item.id),
      );
      this.updateShppingCard();
      message.success('下单成功');
    }
  }

  /**
   * 更新购物车
   * @param message
   */
  public updateShppingCard() {
    this.changCallbackPart(MarketCallBackTypes.ApplyData);
    kernel.anystore.set(
      JOIN_SHOPING_CAR,
      {
        operation: 'replaceAll',
        data: {
          data: this._shopinglist,
        },
      },
      'user',
    );
  }
}
export default new MarketController();
