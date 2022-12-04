import consts from '../consts';
import { faildResult } from '../../base';
import { common } from '../../base';
import { CommonStatus, TodoType } from '../enum';
import { ITodoGroup, IApprovalItem, IApplyItem, IOrderApplyItem } from './itodo';
import { model, kernel, schema } from '../../base';

export class OrderTodo implements ITodoGroup {
  name: string = '订单审批';
  private _todoList: ApprovalItem[] = [];
  private _doList: ApprovalItem[] = [];
  type: TodoType = TodoType.OrderTodo;
  async getCount(): Promise<number> {
    if (this._todoList.length <= 0) {
      await this.getTodoList();
    }
    return this._todoList.length - this._doList.length;
  }
  async getTodoList(refresh: boolean = false): Promise<IApprovalItem[]> {
    if (!refresh && this._todoList.length > 0) {
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
    let applyList: IOrderApplyItem[] = [];
    const res = await kernel.queryBuyOrderList({
      id: '0',
      status: 0,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success && res.data.result) {
      applyList = res.data.result.map((a) => {
        return new OrderApplyItem(a);
      });
    }
    return applyList;
  }
  private async getApprovalList() {
    const res = await kernel.querySellOrderList({
      id: '0',
      status: 0,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success && res.data.result) {
      // 同意回调
      let approvalCall = (data: schema.XOrderDetail) => {
        this._todoList = this._todoList.filter((q) => {
          return q.Data.id != data.id;
        });
        this._doList.unshift(new ApprovalItem(data, () => {}));
      };
      this._doList = res.data.result
        .filter((a) => {
          return a.status >= CommonStatus.ApproveStartStatus;
        })
        .map((a) => {
          return new ApprovalItem(a, () => {});
        });
      this._todoList = res.data.result
        .sort((a, b) => a.status - b.status)
        .map((a) => {
          return new ApprovalItem(a, approvalCall);
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
export class OrderApplyItem implements IOrderApplyItem {
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
  async cancelItem(
    id: string,
    status: number,
    remark: string = '',
  ): Promise<model.ResultType<any>> {
    let detail = this._data.details?.find((a) => {
      return a.id == id;
    });
    if (detail) {
      let res: model.ResultType<boolean>;
      if (detail?.status > CommonStatus.ApproveStartStatus) {
        res = await kernel.rejectMerchandise({
          id: this._data.id,
          status,
        });
        if (res.success) {
          detail.status = status;
        }
        return res;
      } else {
        res = await kernel.cancelOrderDetail({
          id: this._data.id,
          status,
        });
        if (res.success) {
          detail.status = status;
        }
        return res;
      }
    }
    return faildResult(consts.NotFoundError);
  }
  async reject(
    id: string,
    status: number,
    remark: string = '',
  ): Promise<model.ResultType<any>> {
    return await kernel.rejectMerchandise({
      id,
      status,
    });
  }
}

/** 加载订单任务 */
export const loadOrderTodo = async () => {
  const orderTodo = new OrderTodo();
  await orderTodo.getTodoList();
  return orderTodo;
};
