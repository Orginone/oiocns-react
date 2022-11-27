import { model, schema } from '@/ts/base';
export default interface IMerchandise {
  /** 商品实例 */
  merchandise: schema.XMerchandise;

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
  getSellOrder(
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XOrderDetailArray>>;
}
