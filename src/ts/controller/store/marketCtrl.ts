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
   * @desc: 获取市场列表
   * @param {number} params.offset 起始位置
   * @param {number} params.limit  数量限制
   * @param {string} params.filter 过滤关键字
   * @return {*}
   */
  public async getJoinMarkets(reload: boolean) {
    return await this._target?.getJoinMarkets(reload);

    // let arr: any = marketTree.map((itemModel: Market, index: any) => {
    //   const item = itemModel.market;
    //   let arrs = ['基础详情', '用户管理'];
    //   arrs.push(`${item.belongId === userCtrl.User.target.id ? '删除商店' : '退出商店'}`);
    //   return {
    //     title: item.name,
    //     key: `0-${index}`,
    //     id: item.id,
    //     node: itemModel,
    //     children: [],
    //     belongId: item.belongId,
    //     menus: arrs,
    //   };
    // });

    // this.marketFooterTree.appTreeData = arr;
    // if (!isCaback) {
    //   return marketTree;
    // }
    // isCaback && this.changCallbackPart(`${this.curPageType}TreeData`, arr);
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
