import { ITodoGroup, IApprovalItem, IApplyItem, IApplyItemResult } from './itodo';
import { IApprovalItemResult } from './itodo';
import { model, kernel, schema } from '../../base';
import { TodoType } from '../enum';

class ApplicationTodo implements ITodoGroup {
  private _id: string;
  private _name: string;
  private _todoList: ApprovalItem[];
  private _noticeList: NoticeItem[];
  type: TodoType = TodoType.ApplicationTodo;
  get name(): string {
    return this._name;
  }
  get id(): string {
    return this._id;
  }
  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this._todoList = [];
    this._noticeList = [];
  }
  async getCount(): Promise<number> {
    if (this._todoList.length <= 0) {
      await this.getTodoList();
    }
    return this._todoList.length;
  }
  async getTodoList(refresh: boolean = false): Promise<IApprovalItem[]> {
    if (!refresh && this._todoList.length > 0) {
      return this._todoList;
    }
    const res = await kernel.queryApproveTask({
      id: this._id,
    });
    if (res.success && res.data.result) {
      this._todoList = res.data.result.map((a) => {
        return new ApprovalItem(a, (id: string) => {
          this._todoList = this._todoList.filter((s) => {
            return s.Data.id != id;
          });
        });
      });
    }
    return this._todoList;
  }
  async getNoticeList(refresh: boolean = false): Promise<IApprovalItem[]> {
    if (!refresh && this._noticeList.length > 0) {
      return this._noticeList;
    }
    const res = await kernel.queryNoticeTask({
      id: this._id,
    });
    if (res.success && res.data.result) {
      this._noticeList = res.data.result.map((a) => {
        return new NoticeItem(a, (s) => {
          this._noticeList = this._noticeList.filter((q) => {
            return q.Data.id != s;
          });
        });
      });
    }
    return this._noticeList;
  }
  async getDoList(page: model.PageRequest): Promise<IApprovalItemResult> {
    let completeList: IApprovalItem[] = [];
    const res = await kernel.queryRecord({
      id: this._id,
      page,
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        completeList.push(new CompleteItem(a));
      });
    }
    return {
      result: completeList,
      total: res.data?.total || 0,
      offset: page.offset,
      limit: page.limit,
    };
  }
  async getApplyList(page: model.PageRequest): Promise<IApplyItemResult> {
    let applyList: ApplyItem[] = [];
    const res = await kernel.queryInstance({
      productId: this._id,
      status: 0,
      page,
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        applyList.push(new ApplyItem(a));
      });
    }
    return {
      result: applyList,
      total: res.data.total,
      offset: page.offset,
      limit: page.limit,
    };
  }
}

class ApprovalItem implements IApprovalItem {
  private _data: schema.XFlowTask;
  private _completeFun: (id: string) => void;
  constructor(data: schema.XFlowTask, completeFunc: (id: string) => void) {
    this._data = data;
    this._completeFun = completeFunc;
  }
  get Data(): schema.XFlowTask {
    return this._data;
  }
  async pass(status: number, comment: string = ''): Promise<boolean> {
    const res = await kernel.approvalTask({ id: this._data.id, status, comment });
    if (res.success) {
      this._completeFun.apply(this, [this._data.id]);
    }
    return res.success;
  }
  async reject(status: number, comment: string): Promise<boolean> {
    const res = await kernel.approvalTask({ id: this._data.id, status, comment });
    if (res.success) {
      this._completeFun.apply(this, [this._data.id]);
    }
    return res.success;
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
  async pass(status: number, comment: string = ''): Promise<boolean> {
    const res = await kernel.approvalTask({ id: this._data.id, status, comment });
    if (res.success) {
      this._passCall.apply(this, [this._data.id]);
    }
    return res.success;
  }
  async reject(_status: number, _remark: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
class CompleteItem implements IApprovalItem {
  private _data: schema.XFlowTaskHistory;
  constructor(data: schema.XFlowTaskHistory) {
    this._data = data;
  }
  async pass(_status: number, _remark: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async reject(_status: number, _remark: string): Promise<boolean> {
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
  async cancel(_status: number, _remark: string): Promise<boolean> {
    return (
      await kernel.deleteInstance({
        id: this._data.id,
      })
    ).success;
  }
}

/** 加载应用任务 */
export const loadAppTodo = async () => {
  const appTodo: ITodoGroup[] = [];
  const res = await kernel.queryApprovalProduct();
  if (res.success) {
    res.data.forEach((a) => {
      appTodo.push(new ApplicationTodo(a.id, a.name));
    });
  }
  return appTodo;
};
