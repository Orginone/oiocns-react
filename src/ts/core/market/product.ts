import Merchandise from './merchandise';
import { TProduct } from '../entity';
import { kernel } from '../../base';
import { XMerchandise, XProduct } from '../../base/schema';

export default class Product {
  // 应用实体
  private _prod: XProduct;
  // 应用对应的商品列表
  private _merchandise: XMerchandise[];

  constructor(prod: XProduct) {
    this._prod = prod;
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
  ): Promise<boolean> {
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
      this._merchandise.push(res.data);
      return true;
    }
    return false;
  }

  /**
   * 下架商品
   * @param merchandiseId 下架商品ID
   * @returns 下架是否成功
   */
  public async unPublish(merchandise: XMerchandise, belongId: string): Promise<boolean> {
    const res = await kernel.deleteMerchandise({
      belongId: belongId,
      id: merchandise.id,
    });
    if (res.success) {
      delete this._merchandise[this._merchandise.indexOf(merchandise)];
      return true;
    }
    return false;
  }
}
