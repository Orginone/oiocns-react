import { model } from '@/ts/base';
import { XMerchandise, XOrderDetailArray } from '@/ts/base/schema';
export default interface IMerchandise {
  /** 商品实例 */
  merchandise: XMerchandise;
  /**
   * 更新商品信息
   * @param merchandise 商品信息
   * @returns 是否成功
   */
  update(
    caption: string,
    price: number,
    sellAuth: '使用权' | '所属权',
    information: string,
    days: string,
  ): Promise<boolean>;
  /**
   * 查询商品交易情况
   * @param page 分页参数
   * @returns 交易情况
   */
  getSellOrder(page: model.PageRequest): Promise<XOrderDetailArray>;
  /**
   * 交付订单中的商品
   * @param detailId 订单ID
   * @param status 交付状态
   * @returns 交付结果
   */
  deliver(detailId: string, status: number): Promise<boolean>;
  /**
   * 卖方取消订单
   * @param detailId 订单Id
   * @param status 取消状态
   * @returns
   */
  cancel(detailId: string, status: number): Promise<boolean>;
}
