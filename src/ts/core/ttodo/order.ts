import Provider from '../../core/provider';
import { common } from '../../base';
import { CommonStatus, TodoType } from '../../core/enum';
import { ITodoGroup, IApprovalItem, IApplyItem } from './itodo';
import { model, kernel, schema } from '../../base';

export class OrderTodo implements ITodoGroup {
  private _name: string;
  private _todoList: ApprovalItem[];
  private _doList: ApprovalItem[];
  type: TodoType = TodoType.OrderTodo;
  get name(): string {
    return this._name;
  }
  constructor(name: string) {
    this._name = name;
  }
  async getCount(): Promise<number> {
    if (this._todoList.length <= 0) {
      await this.getTodoList();
    }
    return this._todoList.length;
  }
  async getTodoList(): Promise<IApprovalItem[]> {
    if (this._todoList.length > 0) {
      return this._todoList;
    }
    await this.getApprovalList();
    return this._todoList;
  }
  async getNoticeList(): Promise<IApprovalItem[]> {
    throw new Error('Method not implemented.');
  }
  async getDoList(page: model.PageRequest): Promise<IApprovalItem[]> {
    if (this._doList.length > 0) {
      return this._doList;
    }
    await this.getApprovalList();
    return this._doList;
  }
  async getApplyList(page: model.PageRequest): Promise<IApplyItem[]> {
    let applyList: IApplyItem[] = [];
    const res = await kernel.queryBuyOrderList({
      id: '0',
      status: 0,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        applyList.push(new OrderApplyItem(a));
      });
    }
    return applyList;
  }
  private async getApprovalList() {
    const res = await kernel.querySellOrderList({
      id: Provider.spaceId,
      status: 0,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success) {
      // 同意回调
      let approvalCall = (data: schema.XOrderDetail) => {
        this._todoList = this._todoList.filter((q) => {
          return q.Data.id != data.id;
        });
        this._doList.unshift(new ApprovalItem(data, () => {}));
      };
      res.data.result?.forEach((a) => {
        if (a.status >= CommonStatus.RejectStartStatus) {
          this._doList.push(new ApprovalItem(a, () => {}));
        } else {
          this._todoList.push(new ApprovalItem(a, approvalCall));
        }
      });
    }
  }
}
class ApprovalItem implements IApprovalItem {
  private _data: schema.XOrderDetail;
  private _approvalCall: (data: schema.XOrderDetail) => void | undefined;
  get Data(): schema.XOrderDetail {
    return this._data;
  }
  constructor(
    data: schema.XOrderDetail,
    approvalCall: (data: schema.XOrderDetail) => void,
  ) {
    this._data = data;
    this._approvalCall = approvalCall;
  }
  async pass(status: number, remark: string): Promise<model.ResultType<any>> {
    const res = await kernel.deliverMerchandise({
      id: this._data.id,
      status,
    });
    if (res.success) {
      this._approvalCall.apply(this, [this._data]);
    }
    return res;
  }
  async reject(status: number, remark: string): Promise<model.ResultType<any>> {
    const res = await kernel.cancelOrderDetail({
      id: this._data.id,
      status,
    });
    if (res.success) {
      this._approvalCall.apply(this, [this._data]);
    }
    return res;
  }
}
export class OrderApplyItem implements IApplyItem {
  private _data: schema.XOrder;
  get Data(): schema.XOrder {
    return this._data;
  }
  constructor(data: schema.XOrder) {
    this._data = data;
  }
  async cancel(status: number, remark: string = ''): Promise<model.ResultType<any>> {
    return await kernel.cancelOrder({
      id: this._data.id,
      status,
    });
  }
  async cancelItem(status: number, remark: string = ''): Promise<model.ResultType<any>> {
    return await kernel.cancelOrderDetail({
      id: this._data.id,
      status,
    });
  }
}
