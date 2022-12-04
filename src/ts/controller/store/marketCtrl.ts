import { Market } from '@/ts/core/market';
import IMarket from '@/ts/core/market/imarket';
import { IMTarget } from '@/ts/core/target/itarget';
import BaseController from '../baseCtrl';
import userCtrl, { UserPartTypes } from '../setting/userCtrl';

export enum MarketCallBackTypes {
  'marketList' = 'marketList',
}
class MarketController extends BaseController {
  /** 市场操作对象 */
  private _target: IMTarget | undefined;
  /** 当前操作的市场 */
  private _curMarket: IMarket | undefined;
  private _marketList: any[] = [];
  /**
   * @description: 搜索到的商店
   * @return {*}
   */
  public searchMarket: any;

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
    this._curMarket = market;
    this.changCallback();
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
}
export default new MarketController();
