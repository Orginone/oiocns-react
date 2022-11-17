import { kernel } from '../../base';
import { CommonStatus, TargetType } from '../enum';
import { PageRequest, ResultType } from '../../base/model';
import { XMarket, XMarketRelationArray, XMerchandiseArray } from '../../base/schema';

export default class AppStore {
  // 商店实体
  private _store: XMarket;

  constructor(store: XMarket) {
    this._store = store;
  }

  public get selfData() {
    return this._store;
  }
  // constructor(info) {
  //判断拥有那些功能
  // }
  //打开
  openApp() {
    console.log('打开');
  }
  // 获取详情
  getInfo() {
    console.log('获取详情');
  }
  // 管理
  manageApp() {
    console.log('管理');
  }
  // 上架
  putawayApp() {
    console.log('putawayApp');
  }
  // 下架
  soldOutApp() {
    console.log('soldOutApp');
  }
  //共享
  shareApp() {
    console.log('shareApp');
  }
  //分发
  giveOutApp() {
    console.log('giveOutApp');
  }
  // 购买
  buyApp() {
    console.log('buyApp');
  }
  //加购物车
  addCart() {
    console.log('addCart');
  }
  //获取订单
  getOrderList() {
    console.log('getOrderList');
  }
  //取消订单
  cancleOrder() {
    console.log('cancleOrder');
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
   * 分页获取加入商店申请
   * @param page
   */
  public async getUserApply(page: PageRequest) {}

  /**
   * 审批商店成员加入申请
   * @param id 申请ID
   * @param status 审批结果
   * @returns 是否成功
   */
  public async approvalJoinApply(
    id: string,
    status: number = CommonStatus.RejectStartStatus,
  ): Promise<ResultType<any>> {
    return await kernel.approvalJoinApply({ id, status });
  }

  /**
   * 拉对象加入商店
   * @param targetIds 对象ID集合
   * @param typenames 对象类型
   * @returns 是否成功
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
   * 获取商品上架申请列表
   * @param page 分页参数
   * @returns 返回商品上架申请列表
   */
  public async getMerchandiseApply(
    page: PageRequest,
  ): Promise<ResultType<XMerchandiseArray>> {
    return await kernel.queryMerchandiesApplyByManager({
      id: this._store.id,
      page: page,
    });
  }

  /**
   * 审批商品上架申请
   * @param id 申请ID
   * @param status 审批结果
   * @returns 是否成功
   */
  public async approvalPublishApply(
    id: string,
    status: number = CommonStatus.RejectStartStatus,
  ): Promise<ResultType<any>> {
    return await kernel.approvalMerchandise({ id, status });
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
