import { IMarket, IMTarget, createMarket, emitter, DomainTypes } from '@/ts/core';
import { kernel } from '@/ts/base';
import { myColumns, marketColumns } from './config';
import { JOIN_SHOPING_CAR, USER_MANAGEMENT } from '@/constants/const';
import { message } from 'antd';
import { Emitter } from '@/ts/base/common';
import userCtrl from '../setting/userCtrl';

export enum MarketCallBackTypes {
  'ApplyData' = 'ApplyData',
  'MarketShop' = 'MarketShop',
  'UserManagement' = 'UserManagement',
}

class MarketController extends Emitter {
  /** 市场操作对象 */
  private _target: IMTarget | undefined;
  /** 当前操作的市场 */
  private _curMarket: IMarket | undefined;
  /** 当前展示 菜单 */
  private _currentMenu = 'Public';
  /** 判断当前所处页面类型,调用不同请求 */
  public curPageType: 'app' | 'market' = 'market';
  /** 商店table数据 */
  private _marketTableList: any = {};
  /** 搜索到的商店 */
  public searchMarket: any;
  /** 所有的用户 */
  public marketMenber: any = {};
  /** 加入购物车商品 */
  public JoinShopingCar: any[] = [];
  /** 购物车商品列表 */
  private _shopinglist: any[] = [];
  /** 购买商品的id合集 */
  private _shopingIds: string[] = [];

  constructor() {
    super();
    this.searchMarket = [];
    emitter.subscribePart([DomainTypes.Company, DomainTypes.User], async () => {
      this._target = userCtrl.space;
      await this._target.getJoinMarkets();
      /* 获取 历史缓存的 购物车商品列表 */
      kernel.anystore.subscribed(JOIN_SHOPING_CAR, 'user', (shoplist: any) => {
        const { data = [] } = shoplist;
        this._shopinglist = data || [];
        this.changCallbackPart(MarketCallBackTypes.ApplyData);
      });
      /* 获取 历史缓存的 商店用户管理成员 */
      kernel.anystore.subscribed(USER_MANAGEMENT, 'uset', (managementlist: any) => {
        const { data = [] } = managementlist;
        this.marketMenber = data || [];
        this.changCallbackPart(MarketCallBackTypes.UserManagement);
      });
      this.changCallback();
    });
  }

  /**
   * @description: 获取购物车商品列表的方法
   * @return {*}
   */
  public get shopinglist(): any[] {
    return this._shopinglist;
  }

  /**
   * @description: 获取市场商品列表
   * @return {*}
   */
  public get marketTableList(): any {
    return this._marketTableList;
  }

  /** 市场操作对象 */
  public get Market(): IMTarget {
    if (this._target) {
      return this._target;
    } else {
      return {} as IMTarget;
    }
  }

  /** 获取当前操作的市场 */
  public getCurrentMarket() {
    return this._curMarket;
  }

  /** 切换市场 */
  public setCurrentMarket(market: IMarket) {
    this._curMarket = market;
    this.getMember();
    this.changCallback();
  }

  /**
   * @desc: 切换侧边栏 触发 展示数据变化
   * @param {any} menuItem
   * @return {*}
   */
  public async changeMenu(menuItem: any) {
    this._curMarket = menuItem.node ?? createMarket(menuItem); // 当前商店信息
    // 点击重复 则判定为无效
    if (this._currentMenu === menuItem.title) {
      return;
    }
    this._currentMenu = menuItem.title;
    this.getStoreProduct(this.curPageType);
  }

  /**
   * @desc: 获取表格头部展示数据
   * @return {*}
   */
  public getColumns(pageKey?: string) {
    switch (pageKey) {
      case 'appInfo':
      case 'myApp':
        return myColumns;
      case 'market':
        return marketColumns;
      default:
        return [];
    }
    //TODO:待完善
  }

  /** 获取我的应用列表/商店-商品列表
   * @desc: 获取主体展示数据 --根据currentMenu 判断请求 展示内容
   * @return {*}
   */
  public getStoreProduct = async (params?: any) => {
    params = {
      offset: (params?.page - 1) * params?.pageSize ?? 0,
      limit: params?.pageSize ?? 10,
      filter: '',
    };
    const res = await this._curMarket?.getMerchandise(params);
    if (res?.code === 200 && res?.success) {
      this._marketTableList = res?.data;
    }
    this.changCallbackPart(MarketCallBackTypes.MarketShop);
  };

  /**
   * @description: 获取市场里的所有用户
   * @return {*}
   */
  public getMember = async (params?: any) => {
    params = {
      offset: (params?.page - 1) * params?.pageSize ?? 0,
      limit: params?.pageSize ?? 10,
      filter: params?.filter ?? '',
    };
    const res = await this._curMarket?.getMember({ ...params });
    if (res?.code === 200 && res?.success) {
      this.marketMenber = res?.data;
    }
    this.cacheUserManagement(this.marketMenber);
  };

  /**
   * @description: 移出市场里的成员
   * @param {string} targetIds
   * @return {*}
   */
  public removeMember = async (targetIds: string[]) => {
    const res = await this._curMarket?.removeMember(targetIds);
    if (res?.code === 200 && res?.success) {
      if (this.marketMenber.length > 0) {
        let arrs = this.marketMenber.filter((item: any) =>
          targetIds.some((ele: any) => ele.id === item?.target?.id),
        );
        this.marketMenber = arrs;
        this.cacheUserManagement(this.marketMenber);
      }
      message.success('移出成功');
    }
  };

  /**
   * @description: 添加商品进购物车
   * @param {any} data
   * @return {*}
   */
  public joinApply = async (data: any) => {
    if (this._shopinglist.length === 0) {
      this._shopinglist.push(data);
      message.success('已加入购物车');
    } else if (this._shopinglist.some((item) => item.id === data?.id)) {
      message.warning('您已添加该商品，请勿重复添加');
      return;
    } else {
      this._shopinglist.push(data);
      message.success('已加入购物车');
    }
    this.cacheJoinOrDeleShopingCar(this._shopinglist);
  };

  /**
   * @description: 删除购物车内的商品
   * @param {any} data
   * @return {*}
   */
  public deleApply = async (data: any) => {
    if (this._shopinglist.length > 0) {
      let arrs = this._shopinglist.filter(
        (item) => !data.some((ele: any) => ele.id === item.id),
      );
      this._shopinglist = arrs;
      message.success('移出成功');
      this.cacheJoinOrDeleShopingCar(this._shopinglist);
    }
  };

  /**
   * @description: 购买商品
   * @param {any} data
   * @return {*}
   */
  public buyShoping = async (data: any) => {
    data.forEach((item: any) => {
      this._shopingIds.push(item?.id);
    });
    const res = await this._curMarket?.createOrder(
      '',
      'order',
      'code',
      userCtrl.space.id,
      this._shopingIds,
    );
    if (res?.code === 200 && res?.success) {
      let arrs = this._shopinglist.filter(
        (item) => !data.some((ele: any) => ele.id === item.id),
      );
      this._shopinglist = arrs;
      this.cacheJoinOrDeleShopingCar(this._shopinglist);
      message.success('下单成功');
    }
  };

  /**
   * 缓存 加入/删除购物车的商品
   * @param message 新消息，无则为空
   */
  public cacheJoinOrDeleShopingCar = (data: any): void => {
    this.changCallbackPart(MarketCallBackTypes.ApplyData);
    kernel.anystore.set(
      JOIN_SHOPING_CAR,
      {
        operation: 'replaceAll',
        data: {
          data: data || [],
        },
      },
      'user',
    );
  };

  /**
   * 缓存 商店用户管理成员
   * @param message 新消息，无则为空
   */
  public cacheUserManagement = (data: any): void => {
    this.changCallbackPart(MarketCallBackTypes.UserManagement);
    kernel.anystore.set(
      USER_MANAGEMENT,
      {
        operation: 'replaceAll',
        data: {
          data: data || [],
        },
      },
      'user',
    );
  };
}
export default new MarketController();
