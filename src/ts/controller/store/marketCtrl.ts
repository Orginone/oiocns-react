import { emitter, DomainTypes, ISpace, IMarket, IProduct } from '@/ts/core';
import { kernel } from '@/ts/base';
import {
  JOIN_SHOPING_CAR,
  STORE_RECENTLY_APPS,
  STORE_USER_MENU,
} from '@/constants/const';
import { message } from 'antd';
import { Emitter } from '@/ts/base/common';
import userCtrl from '../setting';
import { XMerchandise } from '@/ts/base/schema';

export interface TreeType {
  title: string;
  key: string;
  id: string;
  type?: string;
  items: string[];
  children: TreeType[];
  icon?: any;
}

class MarketController extends Emitter {
  /** 市场操作对象 */
  private _target: ISpace;
  /** 购物车商品列表 */
  private _shopinglist: any[] = [];
  /** 常用应用Id集合 */
  private _caches: string[] = [];
  /** 自定义菜单分类 */
  private _customMenus: TreeType[] = [];
  /** 当前操作应用 */
  private _currentProduct: IProduct | undefined;
  /** 当前操作的市场 */
  private _currentMarket: IMarket | undefined;

  /**
   * @description: 获取购物车商品列表的方法
   * @return {*}
   */
  get shopinglist(): any[] {
    return this._shopinglist;
  }

  /** 市场操作对象 */
  get target(): ISpace {
    return this._target;
  }

  /** 当前操作应用 */
  get curProduct(): IProduct | undefined {
    return this._currentProduct;
  }

  /** 当前操作的市场 */
  get curMarket(): IMarket | undefined {
    return this._currentMarket;
  }

  get products(): IProduct[] {
    return this._target?.ownProducts ?? [];
  }

  /** 常用应用 */
  get alwaysUseApps(): IProduct[] {
    const result: IProduct[] = [];
    this._caches.forEach((a) => {
      let prod = this._target.ownProducts.find((p) => p.id == a);
      if (prod) {
        result.push(prod);
      }
    });
    return result;
  }

  /** 获取自定义分类 */
  get spacies(): TreeType[] {
    return this._customMenus;
  }

  constructor() {
    super();
    this._target = userCtrl.space;
    emitter.subscribePart([DomainTypes.Company, DomainTypes.User], async () => {
      this._target = userCtrl.space;
      await this._target.getOwnProducts(true);
      await this._target.getJoinMarkets();

      /* 获取 历史缓存的 购物车商品列表 */
      kernel.anystore.subscribed(JOIN_SHOPING_CAR, 'user', (shoplist: any) => {
        const { data = [] } = shoplist;
        this._shopinglist = data || [];
        this.changCallbackPart(JOIN_SHOPING_CAR);
      });
      this.changCallback();
    });

    /** 订阅常用应用 */
    kernel.anystore.subscribed(STORE_RECENTLY_APPS, 'user', (data: string[]) => {
      if (data.length > 0) {
        this._caches = data;
      } else {
        this._caches = [];
      }
      this.changCallbackPart(STORE_RECENTLY_APPS);
    });

    /* 获取 历史缓存的 自定义目录 */
    kernel.anystore.subscribed(STORE_USER_MENU, 'user', (data: TreeType[]) => {
      if (data.length > 0) {
        this._customMenus = data;
      } else {
        this._customMenus = [];
      }
      this.changCallbackPart(STORE_USER_MENU);
    });
  }

  /**
   * 设置当前应用
   * @param prod 应用
   * @param cache 是否添加至常用应用
   */
  setCurProduct(prod: IProduct, cache?: boolean): void {
    this._currentProduct = prod;
    this.changCallbackPart('current-product');
    if (cache) {
      this._caches = this._caches.filter((i) => i != prod.id);
      this._caches.unshift(prod.id);
      this._caches = this._caches.slice(0, 7);
      kernel.anystore.set(
        STORE_RECENTLY_APPS,
        {
          operation: 'replaceAll',
          data: this._caches,
        },
        'user',
      );
    }
  }

  setCurMarket(market: IMarket) {
    this._currentMarket = market;
    this.changCallbackPart('current-market');
  }

  /**
   * 设置自定义目录
   * @param message 新消息，无则为空
   */
  setCustomMenu(data: TreeType[]): void {
    this._customMenus = data;
    this.changCallbackPart(STORE_USER_MENU);
    kernel.anystore.set(
      STORE_USER_MENU,
      {
        operation: 'replaceAll',
        data: {
          data: this._customMenus,
        },
      },
      'user',
    );
  }

  /**
   * @description: 添加商品进购物车
   * @param {XMerchandise} data
   * @return {*}
   */
  async appendStaging(data: XMerchandise) {
    if (this._shopinglist.some((item) => item.id === data?.id)) {
      message.warning('您已添加该商品，请勿重复添加');
      return;
    } else {
      this._shopinglist.unshift(data);
      message.success('添加成功');
    }
    this.updateShoppingCar(this._shopinglist);
  }

  /**
   * @description: 删除购物车内的商品
   * @param {any} data
   * @return {*}
   */
  async deleteStaging(ids: string[]) {
    this._shopinglist = this._shopinglist.filter((item) => !ids.includes(item.id));
    message.success('移出成功');
    await this.updateShoppingCar(this._shopinglist);
  }

  /**
   * 缓存 加入/删除购物车的商品
   * @param message 新消息，无则为空
   */
  private async updateShoppingCar(data: any) {
    this.changCallbackPart(JOIN_SHOPING_CAR);
    await kernel.anystore.set(
      JOIN_SHOPING_CAR,
      {
        operation: 'replaceAll',
        data: {
          data: data || [],
        },
      },
      'user',
    );
  }

  /**
   * @description: 购买商品
   * @param {any} data
   * @return {*}
   */
  async createOrder(ids: string[]) {
    if (ids.length > 0) {
      const firstProd = this._shopinglist.find((n) => n.id === ids[0]);
      const success = await this._target.createOrder(
        '',
        firstProd.caption + (ids.length > 1 ? `...等${ids.length}件商品` : ''),
        new Date().getTime().toString().substring(0, 13),
        userCtrl.space.id,
        ids,
      );
      if (success) {
        this._shopinglist = this._shopinglist.filter((item) => !ids.includes(item.id));
        this.updateShoppingCar(this._shopinglist);
        message.success('下单成功');
      }
    }
  }
}
export default new MarketController();
