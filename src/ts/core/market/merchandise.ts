import { kernel, model, schema } from '../../base';
import IMerchandise from './imerchandise';

export default class Merchandise implements IMerchandise {
  merchandise: schema.XMerchandise;

  constructor(merchandise: schema.XMerchandise) {
    this.merchandise = merchandise;
  }

  /**
   * 更新商品信息
   * @param merchandise 商品信息
   * @returns 是否成功
   */
  public async update(
    caption: string,
    price: number,
    sellAuth: '使用权' | '所属权',
    information: string,
    days: string,
  ): Promise<boolean> {
    const res = await kernel.updateMerchandise({
      caption,
      price,
      sellAuth,
      information,
      days,
      id: this.merchandise.id,
      marketId: this.merchandise.marketId,
      productId: this.merchandise.productId,
    });
    if (res.success) {
      this.merchandise.caption = caption;
      this.merchandise.price = price;
      this.merchandise.sellAuth = sellAuth;
      this.merchandise.information = information;
      this.merchandise.days = days;
    }
    return res.success;
  }

  /**
   * 查询商品交易情况
   * @param page 分页参数
   * @returns 交易情况
   */
  public async getSellOrder(page: model.PageRequest): Promise<schema.XOrderDetailArray> {
    return (
      await kernel.querySellOrderListByMerchandise({
        id: this.merchandise.id,
        page: page,
      })
    ).data;
  }
  public async deliver(detailId: string, status: number): Promise<boolean> {
    return (await kernel.deliverMerchandise({ id: detailId, status: status })).success;
  }
  public async cancel(detailId: string, status: number): Promise<boolean> {
    return (await kernel.cancelOrderDetail({ id: detailId, status: status })).success;
  }
}
