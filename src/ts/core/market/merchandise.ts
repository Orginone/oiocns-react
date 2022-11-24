import { common, kernel, model } from '../../base';
import { XMerchandise, XOrderDetailArray } from '../../base/schema';
import { CommonStatus } from '../enum';

export default class Merchandise {
  // 商品实例
  public readonly merchandise: XMerchandise;

  constructor(merchandise: XMerchandise) {
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
  public async getOrder(
    page: model.PageRequest,
  ): Promise<model.ResultType<XOrderDetailArray>> {
    return await kernel.querySellOrderListByMerchandise({
      id: this.merchandise.id,
      page: page,
    });
  }

  /**
   * 交付订单中的商品
   * @param detailId 订单ID
   * @param status 交付状态
   * @returns 交付结果
   */
  public async deliver(
    detailId: string,
    status: number = CommonStatus.ApproveStartStatus,
  ): Promise<model.ResultType<any>> {
    return await kernel.deliverMerchandise({ id: detailId, status: status });
  }

  /**
   * 买方取消订单
   * @param detailId 订单Id
   * @param status 取消状态
   * @returns
   */
  public async cancel(
    detailId: string,
    status: number = CommonStatus.RejectStartStatus,
  ): Promise<model.ResultType<any>> {
    return await kernel.cancelOrderDetail({ id: detailId, status: status });
  }

  
}
