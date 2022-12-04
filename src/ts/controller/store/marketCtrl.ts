import { Market } from '@/ts/core/market';
import IMarket from '@/ts/core/market/imarket';
import { IMTarget } from '@/ts/core/target/itarget';
import BaseController from '../baseCtrl';
import userCtrl, { UserPartTypes } from '../setting/userCtrl';
class MarketController extends BaseController {
  /** 市场操作对象 */
  private _target: IMTarget | undefined;
  /** 当前操作的市场 */
  private _curMarket: IMarket | undefined;
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
        this._target = userCtrl.Space;
      } else {
        this._target = userCtrl.User;
      }
      this.changCallback();
    });
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
}
export default new MarketController();
