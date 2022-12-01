import provider from '../../core/provider';
import { ITodoGroup, IApprovalItem, IApplyItem } from './itodo';
import { model, kernel, schema } from '../../base';

export class ApplicationTodo implements ITodoGroup {
  private _id: string;
  private _name: string;
  private _todoList: ApprovalItem[];
  private _noticeList: NoticeItem[];
  get type(): string {
    return '组织待办';
  }
  get name(): string {
    return this._name;
  }
  constructor(id: string, name: string) {
    this._id = id;
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
    const res = await kernel.queryApproveTask({
      id: this._id,
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        this._todoList.push(new ApprovalItem(a));
      });
    }
    return this._todoList;
  }
  async getNoticeList(): Promise<IApprovalItem[]> {
    if (this._noticeList.length > 0) {
      return this._noticeList;
    }
    const res = await kernel.queryNoticeTask({
      id: this._id,
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        this._noticeList.push(
          new NoticeItem(a, (s) => {
            this._noticeList = this._noticeList.filter((q) => {
              return q.Data.id != s;
            });
          }),
        );
      });
    }
    return this._noticeList;
  }
  async getDoList(page: model.PageRequest): Promise<IApprovalItem[]> {
    let completeList: IApprovalItem[] = [];
    const res = await kernel.queryRecord({
      id: this._id,
      spaceId: provider.spaceId,
      page,
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        completeList.push(new CompleteItem(a));
      });
    }
    return completeList;
  }
  async getApplyList(page: model.PageRequest): Promise<IApplyItem[]> {
    let applyList: ApplyItem[] = [];
    const res = await kernel.queryInstance({
      productId: this._id,
      status: 0,
      spaceId: provider.spaceId,
      page,
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        applyList.push(new ApplyItem(a));
      });
    }
    return applyList;
  }
}

class ApprovalItem implements IApprovalItem {
  private _data: schema.XFlowTask;
  constructor(data: schema.XFlowTask) {
    this._data = data;
  }
  get Data(): schema.XFlowTask {
    return this._data;
  }
  async pass(status: number, comment: string = ''): Promise<model.ResultType<any>> {
    return await kernel.approvalTask({ id: this._data.id, status, comment });
  }
  async reject(status: number, comment: string): Promise<model.ResultType<any>> {
    return await kernel.approvalTask({ id: this._data.id, status, comment });
  }
}
class NoticeItem implements IApprovalItem {
  private _data: schema.XFlowTaskHistory;
  private _passCall: (id: string) => void;
  constructor(data: schema.XFlowTaskHistory, passCall: (id: string) => void) {
    this._data = data;
    this._passCall = passCall;
  }
  get Data(): schema.XFlowTaskHistory {
    return this._data;
  }
  async pass(status: number, comment: string = ''): Promise<model.ResultType<any>> {
    const res = await kernel.approvalTask({ id: this._data.id, status, comment });
    if (res.success) {
      this._passCall.apply(this, [this._data.id]);
    }
    return res;
  }
  async reject(status: number, remark: string): Promise<model.ResultType<any>> {
    throw new Error('Method not implemented.');
  }
}
class CompleteItem implements IApprovalItem {
  private _data: schema.XFlowTaskHistory;
  constructor(data: schema.XFlowTaskHistory) {
    this._data = data;
  }
  async pass(status: number, remark: string): Promise<model.ResultType<any>> {
    throw new Error('Method not implemented.');
  }
  async reject(status: number, remark: string): Promise<model.ResultType<any>> {
    throw new Error('Method not implemented.');
  }
  get Data(): schema.XFlowTaskHistory {
    return this._data;
  }
}

class ApplyItem implements IApplyItem {
  private _data: schema.XFlowInstance;
  constructor(data: schema.XFlowInstance) {
    this._data = data;
  }
  get Data(): schema.XFlowInstance {
    return this._data;
  }
  async cancel(status: number, remark: string): Promise<model.ResultType<any>> {
    return await kernel.deleteInstance({
      id: this._data.id,
    });
  }
}
