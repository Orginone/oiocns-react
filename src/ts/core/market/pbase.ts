import userCtrl from '@/ts/controller/setting/userCtrl';
import { kernel, model, schema } from '../../base';
import Resource from './resource';

export default class BaseProduct {
  // 应用实体
  public _prod: schema.XProduct;
  private _resource: Resource[];

  public get id(): string {
    return this._prod.id;
  }

  /** 获取应用资源 */
  public get getResources() {
    return this._resource;
  }

  constructor(prod: schema.XProduct) {
    this._prod = prod;
    this._resource = [];
    prod.resource?.forEach((a) => {
      this._resource?.push(new Resource(a));
    });
  }

  /**
   * 拓展操作 (应用分享/资源分发)
   * @param sourceId 操作的Id 应用Id/资源Id
   * @param sourceType 操作对象类型
   * @param spaceId 工作空间Id
   * @param teamId 组织Id
   * @param destIds 目标Id
   * @param destType 目标类型
   * @returns
   */
  public async Extend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.createSourceExtend({
      destIds,
      destType,
      teamId,
      sourceType: '产品',
      spaceId: userCtrl.Space?.target.id!,
      sourceId: this._prod.id,
    });
  }

  /**
   * 取消拓展操作 (应用分享/资源分发)
   * @param sourceId 操作的Id 应用Id/资源Id
   * @param sourceType 操作对象类型
   * @param spaceId 工作空间Id
   * @param teamId 组织Id
   * @param destIds 目标Id
   * @param destType 目标类型
   * @returns
   */
  public async deleteExtend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.deleteSourceExtend({
      destIds,
      destType,
      teamId,
      sourceType: '产品',
      spaceId: userCtrl.Space?.target.id!,
      sourceId: this._prod.id,
    });
  }

  /**
   * 查询拓展 (应用分享/资源分发)
   * @param sourceId 操作的Id 应用Id/资源Id
   * @param sourceType 操作对象类型
   * @param spaceId 工作空间Id
   * @param destType 目标类型
   * @param teamId 组织Id
   * @returns
   */
  public async queryExtend(
    destType: string,
    teamId?: string,
  ): Promise<model.ResultType<model.IdNameArray>> {
    return await kernel.queryExtendBySource({
      destType,
      teamId,
      sourceType: '产品',
      spaceId: userCtrl.Space?.target.id!,
      sourceId: this._prod.id,
    });
  }

  /**
   * 查询应用上架的商品
   * @param page 分页参数
   * @returns
   */
  public async queryMerchandises(
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMerchandiseArray>> {
    return await kernel.queryMerchandiseListByProduct({
      id: this._prod.id,
      page: page,
    });
  }

  /**
   * 查询商品交易情况
   * @param id 商品Id
   * @param page 分页参数
   * @returns 交易情况
   */
  public async getOrder(
    id: string,
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XOrderDetailArray>> {
    return await kernel.querySellOrderListByMerchandise({
      id,
      page: page,
    });
  }

  /**
   * 上架商品
   * @param Caption 标题
   * @param MarketId 市场ID
   * @param SellAuth 售卖权限
   * @param Information 详情信息
   * @param Price 价格
   * @param Days 期限
   * @returns 是否上架成功
   */
  public async publish(
    caption: string,
    marketId: string,
    sellAuth: '所属权' | '使用权',
    information: string,
    price: number = 0,
    days: string = '0',
  ): Promise<model.ResultType<any>> {
    return await kernel.createMerchandise({
      id: '',
      caption,
      marketId,
      sellAuth,
      information,
      price,
      days,
      productId: this._prod.id,
    });
  }

  /**
   * 下架商品
   * @param merchandiseId 下架商品ID
   * @returns 下架是否成功
   */
  public async unPublish(
    merchandiseId: string,
    belongId: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.deleteMerchandise({
      belongId: belongId,
      id: merchandiseId,
    });
  }

  /**
   * 更新应用信息
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @param resources 资源
   * @returns
   */
  public async update(
    name: string,
    code: string,
    remark: string,
    resources: model.ResourceModel[],
  ): Promise<model.ResultType<any>> {
    const res = await kernel.updateProduct({
      id: this._prod.id,
      name,
      code,
      remark,
      typeName: this._prod.typeName,
      thingId: this._prod.thingId,
      belongId: this._prod.belongId,
      resources,
    });
    if (res.success) {
      this._prod.name = name;
      this._prod.code = code;
      this._prod.remark = remark;
      res.data.resource?.forEach((a) => {
        this._resource.push(new Resource(a));
      });
    }
    return res;
  }
}
