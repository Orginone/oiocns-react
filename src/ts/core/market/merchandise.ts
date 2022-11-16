import { kernel } from '../../base';
import { ResultType, PageRequest } from '../../base/model';
import { XMerchandise, XOrderDetailArray } from '../../base/schema';

export default class Merchandise {
  // 商品实例
  private _merchandise: XMerchandise;
  constructor(merchandise: XMerchandise) {
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

  /**
   * 查询商品交易情况
   * @param page 分页参数
   * @returns 交易情况
   */
  public async getOrder(page: PageRequest): Promise<ResultType<XOrderDetailArray>> {
    return await kernel.querySellOrderListByMerchandise({
      id: this._merchandise.id,
      page: page,
    });
  }

  /**
   * 交付订单中的商品
   * @param detailId 订单ID
   * @param status 交付状态
   * @returns 交付结果
   */
  public async deliver(detailId: string, status: number = 100): Promise<ResultType<any>> {
    return await kernel.deliverMerchandise({ id: detailId, status: status });
  }

  public async cancel(detailId: string, status: number = 200): Promise<ResultType<any>> {
    return await kernel.cancelOrderDetail({ id: detailId, status: status });
  }
}
