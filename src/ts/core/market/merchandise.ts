import { common, kernel } from '../../base';
import { XMerchandise } from '../../base/schema';
import { TOrderDetail } from '../entity';
import Order from './order';
import Product from './product';

export default class Merchandise {
  // 商品售卖订单列表
  private _order: Order[];
  // 商品实例
  private _merchandise: XMerchandise;
  constructor(merchandise: XMerchandise) {
    this._order = [];
    this._merchandise = merchandise;
  }

  /**
   * 更新商品信息
   * @param merchandise 商品信息
   * @returns 是否成功
   */
  public async update(merchandise: XMerchandise): Promise<boolean> {
    const res = await kernel.updateMerchandise({
      id: merchandise.id,
      caption: merchandise.caption,
      price: merchandise.price,
      productId: merchandise.productId,
      sellAuth: merchandise.sellAuth,
      marketId: merchandise.marketId,
      information: merchandise.information,
      days: merchandise.days,
    });
    if (res.success) {
      this._merchandise = merchandise;
    }
    return res.success;
  }

  public async getOrder(): Promise<void> {
    if (this._order.length == 0) {
      const res = await kernel.querySellOrderListByMerchandise({
        id: this._merchandise.id,
        page: {
          offset: 0,
          limit: common.Constants.MAX_UINT_16,
          filter: '',
        },
      });
      if (res.success) {
        res.data.result.forEach((orderDetail) => {
          this._order.push(new Order(orderDetail));
        });
      }
    }
  }
}
