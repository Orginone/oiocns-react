import { kernel, model } from '../../base';
import { XMerchandise, XProduct, XResource } from '../../base/schema';

export default class Product {
  // 应用实体
  public readonly prod: XProduct;
  private _resource: XResource[] | undefined;
  // 应用对应的商品列表
  private _merchandise: XMerchandise[];

  constructor(prod: XProduct) {
    this.prod = prod;
    this._merchandise = [];
    if (prod.resource != undefined) {
      this._resource = prod.resource;
    } else {
      this._resource = [];
    }
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
    sourceId: string,
    sourceType: '产品' | '资源',
    spaceId: string,
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.createSourceExtend({
      sourceId,
      sourceType,
      destIds,
      destType,
      spaceId,
      teamId,
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
    sourceId: string,
    sourceType: '产品' | '资源',
    spaceId: string,
    destType: string,
    teamId?: string,
  ): Promise<model.ResultType<model.IdNameArray>> {
    return await kernel.queryExtendBySource({
      sourceId,
      sourceType,
      spaceId,
      destType,
      teamId,
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
    const res = await kernel.createMerchandise({
      id: '',
      caption,
      marketId,
      sellAuth,
      information,
      price,
      days,
      productId: this.prod.id,
    });
    if (res.success) {
      this._merchandise.unshift(res.data);
    }
    return res;
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
    const res = await kernel.deleteMerchandise({
      belongId: belongId,
      id: merchandiseId,
    });
    if (res.success) {
      delete this._merchandise[
        this._merchandise.findIndex((merchandise) => {
          return merchandise.id == merchandiseId;
        })
      ];
    }
    return res;
  }

  public async update(
    name: string,
    code: string,
    typeName: string,
    remark: string,
    resources: model.ResourceModel[],
  ): Promise<model.ResultType<any>> {
    const res = await kernel.updateProduct({
      id: this.prod.id,
      name,
      code,
      typeName,
      remark,
      thingId: this.prod.thingId,
      belongId: this.prod.belongId,
      resources,
    });
    if (res.success) {
      this.prod.name = name;
      this.prod.code = code;
      this.prod.typeName = typeName;
      this.prod.remark = remark;
      this._resource = res.data!.resource ?? [];
    }
    return res;
  }
}
