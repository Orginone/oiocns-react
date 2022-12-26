import { common } from '../../base';
import { CommonStatus, TodoType } from '../enum';
import {
  ITodoGroup,
  IApprovalItem,
  IApplyItem,
  IApprovalItemResult,
  IApplyItemResult,
} from './itodo';
import { model, kernel, schema } from '../../base';
import userCtrl from '@/ts/controller/setting/';
import { XTarget } from '@/ts/base/schema';

class OrgTodo implements ITodoGroup {
  id: string;
  icon?: string;
  displayName: string = '组织审批';
  private _todoList: ApprovalItem[] = [];
  private _doList: ApprovalItem[] = [];
  private _applyList: ApplyItem[] = [];
  type: TodoType = TodoType.OrgTodo;
  constructor(target: XTarget) {
    this.id = target.id;
    if (target.avatar) {
      this.icon = JSON.parse(target.avatar).thumbnail;
    }
    this.displayName = target.name;
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
    await this.getApprovalList();
    return this._todoList;
  }
  async getNoticeList(_: boolean = false): Promise<IApprovalItem[]> {
    throw new Error('Method not implemented.');
  }
  async getDoList(page: model.PageRequest): Promise<IApprovalItemResult> {
    if (this._doList.length == 0) {
      await this.getApprovalList();
    }
    return {
      result: this._doList.splice(page.offset, page.limit),
      total: this._doList.length,
      offset: page.offset,
      limit: page.limit,
    };
  }
  async getApplyList(page: model.PageRequest): Promise<IApplyItemResult> {
    const res = await kernel.queryJoinTeamApply({
      id: this.id,
      page,
    });
    if (res.success && res.data.result) {
      this._applyList = res.data.result.map((a) => {
        return new ApplyItem(a, (q) => {
          this._applyList = this._applyList.filter((s) => {
            return s.Data.id != q.id;
          });
        });
      });
    }
    return {
      result: this._applyList,
      total: res.data.total,
      offset: page.offset,
      limit: page.limit,
    };
  }
  private async getApprovalList() {
    const res = await kernel.queryTeamJoinApproval({
      id: this.id,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success && res.data.result) {
      // 同意回调
      let passfun = (s: schema.XRelation) => {
        this._todoList = this._todoList.filter((q) => {
          return q.Data.id != s.id;
        });
      };
      // 已办中再次同意回调
      let rePassfun = (s: schema.XRelation) => {
        this._doList = this._doList.filter((q) => {
          return q.Data.id != s.id;
        });
      };
      // 拒绝回调
      let rejectfun = (s: schema.XRelation) => {
        this._doList.unshift(new ApprovalItem(s, rePassfun, (s) => {}));
      };
      let reRejectfun = (_: schema.XRelation) => {};
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
  private _data: schema.XRelation;
  private _passCall: (data: schema.XRelation) => void;
  private _rejectCall: (data: schema.XRelation) => void;
  constructor(
    data: schema.XRelation,
    passCall: (data: schema.XRelation) => void,
    rejectCall: (data: schema.XRelation) => void,
  ) {
    this._data = data;
    this._passCall = passCall;
    this._rejectCall = rejectCall;
  }
  get Data(): schema.XRelation {
    return this._data;
  }
  async pass(status: number, _: string = ''): Promise<boolean> {
    const res = await kernel.joinTeamApproval({ id: this._data.id, status });
    if (res.success) {
      this._passCall.apply(this, [this._data]);
    }
    return res.success;
  }
  async reject(status: number, _: string): Promise<boolean> {
    const res = await kernel.joinTeamApproval({ id: this._data.id, status });
    if (res.success) {
      this._rejectCall.apply(this, [this._data]);
    }
    return res.success;
  }
}

class ApplyItem implements IApplyItem {
  private _data: schema.XRelation;
  private _cancelFun: (s: schema.XRelation) => void;
  constructor(data: schema.XRelation, cancelFun: (s: schema.XRelation) => void) {
    this._data = data;
    this._cancelFun = cancelFun;
  }
  get Data(): schema.XRelation {
    return this._data;
  }
  async cancel(_status: number, _remark?: string): Promise<boolean> {
    const res = await kernel.cancelJoinTeam({
      id: this._data.id,
      typeName: '',
    });
    if (res.success) {
      this._cancelFun.apply(this, [this._data]);
    }
    return res.success;
  }
}

/** 加载组织任务 */
export const loadOrgTodo = async () => {
  const orgTodo = new OrgTodo(userCtrl.user.target);
  await orgTodo.getTodoList();
  orgTodo.displayName = '好友审批';
  let todoGroups = [orgTodo];
  let companys = await userCtrl.user.getJoinedCompanys(false);
  companys.forEach(async (a) => {
    const companyTodo = new OrgTodo(a.target);
    await companyTodo.getTodoList();
    todoGroups.push(companyTodo);
  });
  return todoGroups;
};
