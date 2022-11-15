import { XOrder, XOrderDetail } from '../../base/schema';

export default class Order {
  private _order: XOrder;
  private _detail: XOrderDetail[];
  constructor(order: XOrder | XOrderDetail) {
    if (order as XOrder) {
      this._detail = [];
      this._order = order as XOrder;
      /* empty */
    } else {
      this._detail = [order as XOrderDetail];
    }
  }

  public async deliver() {}
  public async cancel() {}
  public async queryDetail() {}
}
