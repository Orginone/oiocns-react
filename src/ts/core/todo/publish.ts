import { common } from '../../base';
import { CommonStatus, TodoType } from '../enum';
import { ITodoGroup, IApprovalItem, IApplyItem } from './itodo';
import { model, kernel, schema } from '../../base';

class PublishTodo implements ITodoGroup {
  name: string = '应用上架';
  private _doList: ApprovalItem[] = [];
  private _applyList: ApplyItem[] = [];
  private _todoList: ApprovalItem[] = [];
  type: TodoType = TodoType.MarketTodo;
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
    await this.getApprovalList();
    return this._todoList;
  }
  async getNoticeList(_: boolean = false): Promise<IApprovalItem[]> {
    throw new Error('Method not implemented.');
  }
  async getDoList(_: model.PageRequest): Promise<IApprovalItem[]> {
    if (this._doList.length > 0) {
      return this._doList;
    }
    await this.getApprovalList();
    return this._doList;
  }
  async getApplyList(_: model.PageRequest): Promise<IApplyItem[]> {
    if (this._applyList.length > 0) {
      return this._applyList;
    }
    const res = await kernel.queryMerchandiseApply({
      id: '0',
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success && res.data.result) {
      this._applyList = res.data.result.map((a) => {
        return new ApplyItem(a, (id: string) => {
          this._applyList = this._applyList.filter((s) => {
            return s.Data.id != id;
          });
        });
      });
    }
    return this._applyList;
  }
  private async getApprovalList() {
    const res = await kernel.queryPublicApproval({
      id: '0',
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success && res.data.result) {
      // 同意回调
      let passfun = (id: string) => {
        this._todoList = this._todoList.filter((q) => {
          return q.Data.id != id;
        });
      };
      // 已办中再次同意回调
      let rePassfun = (id: string) => {
        this._doList = this._doList.filter((q) => {
          return q.Data.id != id;
        });
      };
      // 拒绝回调
      let rejectfun = (s: schema.XMerchandise) => {
        this._doList.unshift(new ApprovalItem(s, rePassfun, (s) => {}));
      };
      let reRejectfun = (_: schema.XMerchandise) => {};
      this._doList = res.data.result
        .filter((a) => {
          return a.status >= CommonStatus.RejectStartStatus;
        })
        .map((a) => {
          return new ApprovalItem(a, rePassfun, reRejectfun);
        });
      this._todoList = res.data.result
        .filter((a) => {
          return a.status < CommonStatus.RejectStartStatus;
        })
        .map((a) => {
          return new ApprovalItem(a, passfun, rejectfun);
        });
    }
  }
}
class ApprovalItem implements IApprovalItem {
  private _data: schema.XMerchandise;
  private _passCall: (id: string) => void;
  private _rejectCall: (data: schema.XMerchandise) => void;
  get Data(): schema.XMerchandise {
    return this._data;
  }
  constructor(
    data: schema.XMerchandise,
    passCall: (id: string) => void,
    rejectCall: (data: schema.XMerchandise) => void,
  ) {
    this._data = data;
    this._passCall = passCall;
    this._rejectCall = rejectCall;
  }
  async pass(status: number, _: string): Promise<boolean> {
    const res = await kernel.approvalMerchandise({
      id: this._data.id,
      status,
    });
    if (res.success) {
      this._passCall.apply(this, [this._data.id]);
    }
    return res.success;
  }
  async reject(status: number, _: string): Promise<boolean> {
    const res = await kernel.approvalMerchandise({
      id: this._data.id,
      status,
    });
    if (res.success) {
      this._rejectCall.apply(this, [this._data]);
    }
    return res.success;
  }
}
class ApplyItem implements IApplyItem {
  private _data: schema.XMerchandise;
  private _cancelCall: (id: string) => void;
  get Data(): schema.XMerchandise {
    return this._data;
  }
  constructor(data: schema.XMerchandise, cancelCall: (id: string) => void) {
    this._data = data;
    this._cancelCall = cancelCall;
  }
  async cancel(_status: number, _remark: string): Promise<boolean> {
    const res = await kernel.deleteMerchandise({
      id: this._data.id,
      belongId: '0',
    });
    if (res.success) {
      this._cancelCall.apply(this, [this._data.id]);
    }
    return res.success;
  }
}

/** 加载应用上架任务 */
export const loadPublishTodo = async () => {
  const publishTodo = new PublishTodo();
  await publishTodo.getTodoList();
  return publishTodo;
};
