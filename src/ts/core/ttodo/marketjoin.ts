import Provider from '../../core/provider';
import { common } from '../../base';
import { CommonStatus, TodoType } from '../../core/enum';
import { ITodoGroup, IApprovalItem, IApplyItem } from './itodo';
import { model, kernel, schema } from '../../base';

export class MarketJoinTodo implements ITodoGroup {
  private _name: string;
  private _todoList: ApprovalItem[];
  private _doList: ApprovalItem[];
  type: TodoType = TodoType.MarketTodo;
  get name(): string {
    return this._name;
  }
  constructor() {
    this._name = '加入市场';
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
      id: Provider.spaceId,
      page,
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        applyList.push(new ApplyItem(a));
      });
    }
    return applyList;
  }
  async getTodoList(): Promise<IApprovalItem[]> {
    if (this._todoList.length > 0) {
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
  async getNoticeList(): Promise<IApprovalItem[]> {
    throw new Error('Method not implemented.');
  }
  private async getJoinApproval() {
    const res = await kernel.queryJoinApproval({
      id: Provider.spaceId,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
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
        if (a.status >= CommonStatus.RejectStartStatus) {
          this._doList.push(new ApprovalItem(a, rePassFun, () => {}));
        } else {
          this._todoList.push(
            new ApprovalItem(a, passFun, (data) => {
              this._doList.push(new ApprovalItem(data, rePassFun, () => {}));
            }),
          );
        }
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
      belongId: Provider.spaceId,
      typeName: '',
    });
  }
}
