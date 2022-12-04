import { Market } from '@/ts/core/market';
import IMarket from '@/ts/core/market/imarket';
import { IMTarget } from '@/ts/core/target/itarget';
import BaseController from '../baseCtrl';
import { myColumns, marketColumns } from './config';
import userCtrl, { UserPartTypes } from '../setting/userCtrl';

export enum MarketCallBackTypes {
  'marketList' = 'marketList',
}
class MarketController extends BaseController {
  /** 市场操作对象 */
  private _target: IMTarget | undefined;
  /** 当前操作的市场 */
  private _curMarket: IMarket | undefined;
  /** 当前展示 菜单 */
  private _currentMenu = 'Public';
  /** 判断当前所处页面类型,调用不同请求 */
  public curPageType: 'app' | 'market' = 'market';
  /** 触发页面渲染 callback */
  public marketTableCallBack!: (data: any) => void;
  /** 市场列表 */
  private _marketList: any[] = [];
  /** 搜索到的商店 */
  public searchMarket: any;
  /** 所有的用户 */
  public marketMenber: any;

  constructor() {
    super();
    this.searchMarket = [];
    userCtrl.subscribePart([UserPartTypes.Space, UserPartTypes.User], () => {
      if (userCtrl.IsCompanySpace) {
        this._target = userCtrl.Company;
      } else {
        this._target = userCtrl.User;
      }
      this.changCallback();
    });
  }

  public get marketList(): any[] {
    return this._marketList;
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
  public setCurrentMarket(market: Market) {
    console.log('切换市场', market);
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
    // console.log('changeMenu', menuItem, this._currentMenu, menuItem.title);
    this._curMarket = menuItem.node ?? new Market(menuItem); // 当前商店信息
    // 点击重复 则判定为无效
    if (this._currentMenu === menuItem.title) {
      return;
    }
    this._currentMenu = menuItem.title;
    console.log('当前页面类型', this.curPageType);

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
  public async getStoreProduct(type = 'app', params?: any) {
    let Fun!: Function;
    if (type === 'app') {
      Fun = userCtrl.User!.getOwnProducts;
      params = {};
    } else {
      Fun = this._curMarket!.getMerchandise;
      params = { offset: 0, limit: 10, filter: '', ...params };
    }

    const res = await Fun(params);
    console.log('获取数据', type, res);
    if (Array.isArray(res)) {
      this.marketTableCallBack([...res]);
      return;
    }

    const { success, data } = res;

    if (success) {
      const { result = [] } = data;
      this.marketTableCallBack([...result]);
    }
  }

  /**
   * @desc: 获取树形组件 商店展示数据
   * @return {*}
   */
  public async queryMarketList() {
    const marketTree = await this._target!.getJoinMarkets();
    let arr: any = marketTree.map((itemModel: Market, index: any) => {
      const item = itemModel.market;
      let arrs = ['基础详情', '用户管理'];
      arrs.push(`${item.belongId === userCtrl.User.target.id ? '删除商店' : '退出商店'}`);
      return {
        title: item.name,
        key: `0-${index}`,
        id: item.id,
        node: itemModel,
        children: [],
        belongId: item.belongId,
        menus: arrs,
      };
    });
    this._marketList = arr;
    this.changCallbackPart(MarketCallBackTypes.marketList);
  }

  /**
   * @description: 创建市场
   * @param {any} marckt
   * @return {*}
   */
  public async createMarket(marckt: any) {
    await this._target?.createMarket({ ...marckt });
    this.changCallback();
  }

  /**
   * @description: 删除市场
   * @param {string} id
   * @return {*}
   */
  public async deleteMarket(id: string) {
    await this._target?.deleteMarket(id);
    this.changCallback();
  }

  /**
   * @description: 退出市场
   * @param {string} id
   * @return {*}
   */
  public async quitMarket(id: string) {
    await this._target?.quitMarket(id);
    this.changCallback();
  }

  /**
   * @description: 根据编号查询市场
   * @param {string} name
   * @return {*}
   */
  public async getMarketByCode(name: string) {
    await this._target?.getMarketByCode(name);
    this.changCallback();
  }

  /**
   * @description: 获取市场里的所有用户
   * @return {*}
   */
  public async getMember() {
    const res = await this._curMarket?.getMember({ offset: 0, limit: 10, filter: '' });
    if (res?.success) {
      this.marketMenber = res?.data?.result;
    }
    console.log('获取市场里的所有用户', res);
    return this.marketMenber;
  }

  /**
   * @description: 移出市场里的成员
   * @param {string} targetIds
   * @return {*}
   */
  public removeMember = async (targetIds: string[]) => {
    console.log('移出成员ID合集', targetIds);
    const res = await this._curMarket?.removeMember(targetIds);
    console.log('移出成员', res);
  };
}
export default new MarketController();
