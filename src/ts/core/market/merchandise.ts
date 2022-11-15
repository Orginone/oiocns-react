import { kernel } from '../../base';
import { TMerchandise, TOrderDetail } from '../entity';
import Order from './order';

export default class Merchandise {
  // 商品售卖订单列表
  private _order: Order[];
  // 商品实例
  private _merchandise: TMerchandise;
  constructor(merchandise: TMerchandise) {
    this._merchandise = merchandise;
  }
  public get gettmerchandise(): TMerchandise {
    return this._merchandise;
  }

  /**
   * 更新商品信息
   * @param merchandise 商品信息
   * @returns 是否成功
   */
  public async update(merchandise: TMerchandise): Promise<boolean> {
    const res = await kernel.updateMerchandise(merchandise);
    if (res.success) {
      this._merchandise = merchandise;
    }
    return res.success;
  }

  /**
   * 下架商品
   * @param merchandiseId 下架商品ID
   * @returns 下架是否成功
   */
  public async delete(): Promise<boolean> {
    const res = await kernel.deleteMerchandise({
      merchandiseId: this._merchandise.id,
    });
    return res.success;
  }

  public async getOrder(): Promise<void> {

  }


}
