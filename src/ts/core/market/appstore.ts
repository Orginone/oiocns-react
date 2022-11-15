import Merchandise from "./merchandise";
import { common, kernel } from "../../base";
import { TStore, TTarget, TMerchandise } from "../entity";

export default class AppStore {
  // 商店实体
  private _store: TStore;
  // 商店用户
  private _users: TTarget[];
  // 申请用户
  private _applyer: TTarget[];
  // 商品列表
  private _merchandise: Merchandise[];

  constructor(store: TStore) {
    this._store = store;
  }

  /**
   * 获取商店用户列表
   * @returns 用户列表
   */
  public async getUser(): Promise<TTarget[]> {
    if (!this._users || this._users.length == 0) {
      const res = await kernel.queryMarketMember("");
      if (res.success) {
        this._users = <TTarget[]>res.data;
      }
    }
    return this._users;
  }

  /**
   * 获取商品列表
   * @returns
   */
  public async getMerchandise(): Promise<Merchandise[]> {
    if (!this._merchandise || this._merchandise.length == 0) {
      var res = await kernel.searchMerchandise({
        id: this._store.id,
        page: {
          offset: 0,
          filter: '',
          limit: common.Constants.MAX_UINT_16,
        }
      });
      if (res.success) {
        <TMerchandise[]>res.data.forEach((merchandise) => {
          this._merchandise.push(new Merchandise(merchandise));
        });
      }
    }
    return this._merchandise;
  }

  /**
   * 下架商品
   * @param merchandiseId 下架商品ID
   * @returns 下架是否成功
   */
  public async unPublish(merchandise: Merchandise): Promise<boolean> {
    if (await merchandise.delete()) {
      delete this._merchandise[this._merchandise.indexOf(merchandise)];
      return true;
    }
    return false;
  }
}
