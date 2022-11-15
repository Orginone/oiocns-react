import Merchandise from './merchandise';
import { TProduct } from '../entity';
import { kernel } from '../../base';

export default class Product {
  // 应用实体
  private _prod: TProduct;
  // 应用对应的商品列表
  private _merchandise: Merchandise[];

  constructor(prod: TProduct) {
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
    Caption: string,
    MarketId: string,
    SellAuth: '所属权' | '使用权',
    Information: string,
    Price?: number,
    Days?: number,
  ): Promise<boolean> {
    const res = await kernel.createMerchandise({
      Caption,
      MarketId,
      SellAuth,
      Information,
      Price,
      Days,
      ProductId: this._prod.id,
    });
    if (res.success) {
      const merchandise = new Merchandise(res.data);
      this._merchandise.push(merchandise);
      return true;
    }
    return false;
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

