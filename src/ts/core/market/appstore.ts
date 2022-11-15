import Merchandise from './merchandise';
import { common, kernel } from '../../base';
import { TStore, TTarget, TMerchandise } from '../entity';
import { XMarket, XMarketRelation, XMerchandise, XStaging } from '../../base/schema';
import { TargetType } from '../enum';
import Staging from './staging';

export default class AppStore {
  // 商店实体
  private _store: XMarket;
  // 购物车
  private _stagings: XStaging[];
  // 商店用户
  private _users: XMarketRelation[];
  // 商品列表
  private _merchandise: XMerchandise[];

  constructor(store: XMarket) {
    this._store = store;
  }

  public async staging() {}

  public async unStaging(stag: Staging) {}

  /**
   * 获取商店用户列表
   * @returns 用户列表
   */
  public async getUser(): Promise<XMarketRelation[]> {
    if (!this._users || this._users.length == 0) {
      const res = await kernel.queryMarketMember({
        id: this._store.id,
        page: {
          offset: 0,
          limit: common.Constants.MAX_UINT_16,
          filter: '',
        },
      });
      if (res.success) {
        this._users = res.data.result;
      }
    }
    return this._users;
  }

  /**
   * 拉对象加入商店
   * @param targetIds 对象ID集合
   * @param typenames 对象类型
   * @returns
   */
  public async pull(targetIds: string[], typenames: string[]): Promise<boolean> {
    const res = await kernel.pullAnyToMarket({
      marketId: this._store.id,
      targetIds: targetIds,
      typeNames: typenames,
    });
    if (res.success) {
      // TODO 向this._user添加数据
      return true;
    }
    return false;
  }

  /**
   * 移除商店成员
   * @param id 成员ID
   * @param typename 成员类型
   */
  public async removeMember(
    id: string,
    typename: TargetType.Person | TargetType.Company,
  ): Promise<void> {}

  /**
   * 获取商品列表
   * @returns
   */
  public async getMerchandise(): Promise<XMerchandise[]> {
    if (!this._merchandise || this._merchandise.length == 0) {
      var res = await kernel.searchMerchandise({
        id: this._store.id,
        page: {
          offset: 0,
          filter: '',
          limit: common.Constants.MAX_UINT_16,
        },
      });
      if (res.success) {
        this._merchandise = res.data.result;
      }
    }
    return this._merchandise;
  }

  public async publish(): Promise<boolean> {
    return false;
  }

  /**
   * 下架商品
   * @param merchandiseId 下架商品ID
   * @returns 下架是否成功
   */
  public async unPublish(merchandiseId: string, belongId: number): Promise<boolean> {
    const res = await kernel.deleteMerchandiseByManager({
      id: merchandiseId,
      belongId: belongId,
    });
    if (res.success) {
      this._merchandise = this._merchandise.filter((merchandise) => {
        return merchandise.id != merchandiseId;
      });
      return true;
    }
    return false;
  }
}
