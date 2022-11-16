import { kernel } from '../../base';
import { TargetType } from '../enum';
import { PageRequest, ResultType } from '../../base/model';
import { XMarket, XMarketRelationArray, XMerchandiseArray } from '../../base/schema';

export default class AppStore {
  // 商店实体
  private _store: XMarket;

  constructor(store: XMarket) {
    this._store = store;
  }

  /**
   * 分页获取商店成员
   * @param page 分页参数
   * @returns 加入的商店成员
   */
  public async getUser(page: PageRequest): Promise<ResultType<XMarketRelationArray>> {
    return await kernel.queryMarketMember({
      id: this._store.id,
      page: page,
    });
  }

  /**
   * 拉对象加入商店
   * @param targetIds 对象ID集合
   * @param typenames 对象类型
   * @returns
   */
  public async pull(targetIds: string[], typenames: string[]): Promise<ResultType<any>> {
    return await kernel.pullAnyToMarket({
      marketId: this._store.id,
      targetIds: targetIds,
      typeNames: typenames,
    });
  }

  /**
   * 移除商店成员
   * @param id 成员ID
   * @param typename 成员类型
   * @return 移除人员结果
   */
  public async removeMember(id: string, typename: TargetType): Promise<ResultType<any>> {
    return await kernel.removeMarketMember({ id: id, belongId: '', typeName: typename });
  }

  /**
   * 获取商品列表
   * @param page 分页参数
   * @returns 返回商店商品列表
   */
  public async getMerchandise(page: PageRequest): Promise<ResultType<XMerchandiseArray>> {
    return await kernel.searchMerchandise({
      id: this._store.id,
      page: page,
    });
  }

  /**
   * 下架商品
   * @param merchandiseId 下架商品ID
   * @returns 下架是否成功
   */
  public async unPublish(
    merchandiseId: string,
    belongId: number,
  ): Promise<ResultType<any>> {
    return await kernel.deleteMerchandiseByManager({
      id: merchandiseId,
      belongId: belongId,
    });
  }
}
