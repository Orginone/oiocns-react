import { common } from '../../base';
import { CommonStatus, TodoType } from '../enum';
import { ITodoGroup, IApprovalItem, IApplyItem } from './itodo';
import { model, kernel, schema } from '../../base';

class MarketJoinTodo implements ITodoGroup {
  private _name: string;
  private _todoList: ApprovalItem[];
  private _doList: ApprovalItem[];
  type: TodoType = TodoType.MarketTodo;
  get name(): string {
    return this._name;
  }
  constructor() {
    this._name = '加入市场';
    this._todoList = [];
    this._doList = [];
  }
  async getCount(): Promise<number> {
    if (this._todoList.length <= 0) {
      await this.getTodoList();
    }
    return this._todoList.length;
  }
  async getApplyList(page: model.PageRequest): Promise<IApplyItem[]> {
    let applyList: IApplyItem[] = [];
    const res = await kernel.queryJoinMarketApply({
      id: '0',
      page,
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        applyList.push(new ApplyItem(a));
      });
    }
    return applyList;
  }
  async getTodoList(refresh: boolean = false): Promise<IApprovalItem[]> {
    if (!refresh && this._todoList.length > 0) {
      return this._todoList;
    }
    await this.getJoinApproval();
    return this._todoList;
  }
  async getDoList(page: model.PageRequest): Promise<IApprovalItem[]> {
    if (this._doList.length > 0) {
      return this._doList;
    }
    await this.getJoinApproval();
    return this._doList;
  }
  async getNoticeList(refresh: boolean = false): Promise<IApprovalItem[]> {
    throw new Error('Method not implemented.');
  }
  private async getJoinApproval() {
    const res = await kernel.queryJoinApproval({
      id: '0',
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success && res.data.result) {
      let rePassFun = (id: string) => {
        this._doList = this._doList.filter((q) => {
          return q.Data.id != id;
        });
      };
      let passFun = (id: string) => {
        this._todoList = this._todoList.filter((q) => {
          return q.Data.id != id;
        });
      };
      this._doList = res.data.result
        .filter((a) => {
          return a.status >= CommonStatus.RejectStartStatus;
        })
        .map((a) => {
          return new ApprovalItem(a, rePassFun, () => {});
        });
      this._todoList = res.data.result
        .filter((a) => {
          return a.status < CommonStatus.RejectStartStatus;
        })
        .map((a) => {
          return new ApprovalItem(a, passFun, (data) => {
            this._doList.push(new ApprovalItem(data, rePassFun, () => {}));
          });
        });
    }
  }
}
class ApprovalItem implements IApprovalItem {
  private _data: schema.XMarketRelation;
  private _passCall: (id: string) => void;
  private _rejectCall: (data: schema.XMarketRelation) => void;
  get Data(): schema.XMarketRelation {
    return this._data;
  }
  constructor(
    data: schema.XMarketRelation,
    passCall: (id: string) => void,
    rejectCall: (data: schema.XMarketRelation) => void,
  ) {
    this._data = data;
    this._passCall = passCall;
    this._rejectCall = rejectCall;
  }
  async pass(status: number, remark: string): Promise<model.ResultType<any>> {
    const res = await kernel.approvalJoinApply({
      id: this._data.id,
      status,
    });
    if (res.success) {
      this._passCall.apply(this, [this._data.id]);
    }
    return res;
  }
  async reject(status: number, remark: string): Promise<model.ResultType<any>> {
    const res = await kernel.approvalJoinApply({
      id: this._data.id,
      status,
    });
    if (res.success) {
      this._rejectCall.apply(this, [this._data]);
    }
    return res;
  }
}
class ApplyItem implements IApplyItem {
  private _data: schema.XMarketRelation;
  get Data(): schema.XMarketRelation {
    return this._data;
  }
  constructor(data: schema.XMarketRelation) {
    this._data = data;
  }
  async cancel(status: number, remark: string): Promise<model.ResultType<any>> {
    return await kernel.cancelJoinMarket({
      id: this._data.id,
      belongId: '0',
      typeName: '',
    });
  }
}

/** 加载市场任务 */
export const loadMarketTodo = async () => {
  const marketTodo = new MarketJoinTodo();
  await marketTodo.getTodoList();
  return marketTodo;
};
