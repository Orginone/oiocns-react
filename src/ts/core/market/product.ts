import { kernel, model } from '../../base';
import { XMerchandise, XProduct, XResource } from '../../base/schema';
import { ResultType, ResourceModel } from '../../base/model';

export default class Product {
  // 应用实体
  private _prod: XProduct;
  private _resource: XResource[];
  // 应用对应的商品列表
  private _merchandise: XMerchandise[];

  constructor(prod: XProduct, resources: XResource[]) {
    this._prod = prod;
    this._resource = resources;
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
    days: number = 0,
  ): Promise<ResultType<any>> {
    const res = await kernel.createMerchandise({
      id: '',
      caption,
      marketId,
      sellAuth,
      information,
      price,
      days,
      productId: this._prod.id,
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
  ): Promise<ResultType<any>> {
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

  public async update(prod: XProduct, resources: XResource[]): Promise<ResultType<any>> {
    if (prod.id != this._prod.id) {
      return {
        code: 401,
        success: false,
        msg: 'ID不可修改!',
        data: '',
      };
    }
    const res = await kernel.updateProduct({
      id: prod.id,
      name: prod.name,
      code: prod.code,
      thingId: this._prod.thingId,
      typeName: prod.typeName,
      remark: prod.remark,
      belongId: prod.belongId,
      resources: <ResourceModel[]>resources,
    });
    if (res.success) {
      var thingId = this._prod.thingId;
      this._prod = prod;
      this._prod.thingId = thingId;
      this._resource = resources;
    }
    return res;
  }
}
