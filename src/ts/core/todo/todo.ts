import {
  iTodo,
  StytemITodo,
  StytemTodosType,
  TodoItem,
  XFlowTaskItem,
  XFlowTaskHistoryItem,
  XFlowInstanceItem,
} from './interface';
import { common, kernel, model, schema } from '../../base';
import { CommonStatus, TargetType } from '../enum';
import { XRelation } from '../../base/schema';
import userCtrl from '@/ts/controller/setting/userCtrl';

/** 应用待办的实现*/
export class ApplicationTodo implements iTodo {
  id: string;
  name: string;
  todoList: XFlowTaskItem[];
  doList: XFlowTaskHistoryItem[];
  noticeList: XFlowTaskHistoryItem[];
  applyList: XFlowInstanceItem[];
  count: number = 0;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.todoList = [];
    this.doList = [];
    this.noticeList = [];
    this.applyList = [];
  }

  public getTodoList = async () => {
    if (this.todoList.length > 0) return this.todoList;
    const result = await kernel.queryApproveTask({ id: this.id });
    return (this.todoList = this._createTodoItem(result) as XFlowTaskItem[]);
  };
  public getDoList = async () => {
    if (this.doList.length > 0) return this.doList;
    const result = await kernel.queryRecord({
      id: this.id,
      spaceId: userCtrl.User.target.id,
      page: { offset: 0, filter: '', limit: common.Constants.MAX_UINT_8 },
    });

    return (this.doList = this._createTodoItem(result) as XFlowTaskHistoryItem[]);
  };
  public getNoticeList = async () => {
    if (this.noticeList.length > 0) return this.noticeList;
    const result = await kernel.queryNoticeTask({ id: this.id });
    return (this.noticeList = this._createTodoItem(result) as XFlowTaskHistoryItem[]);
  };
  public getApplyList = async () => {
    if (this.applyList.length > 0) return this.applyList;
    const result = await kernel.queryInstance({
      productId: this.id,
      spaceId: userCtrl.User.target.id,
      status: 1,
      page: { offset: 0, filter: '', limit: common.Constants.MAX_UINT_8 },
    });
    return (this.applyList = this._createTodoItem(result) as XFlowInstanceItem[]);
  };

  /**生成待办数据实例 */
  private _createTodoItem = (
    result: model.ResultType<
      schema.XFlowInstanceArray | schema.XFlowTaskArray | schema.XFlowTaskHistoryArray
    >,
  ) => {
    if (result.success && result.data && result.data.total > 0) {
      return result.data.result!.map((n) => ({ ...n, node: new ApplicationTodoItem(n) }));
    } else {
      return [];
    }
  };
}

/** 待办数据实现 */
class ApplicationTodoItem implements TodoItem {
  target: any;
  constructor(target: any) {
    this.target = target;
  }

  /** 同意审批任务 */
  public approve = async (comment: string) => {
    return await kernel.approvalTask({
      id: this.target.id,
      status: CommonStatus.ApproveStartStatus,
      comment,
    });
  };
  /** 驳回审批任务 */
  public refuse = async (comment: string) => {
    return await kernel.approvalTask({
      id: this.target.id,
      status: CommonStatus.RejectStartStatus,
      comment,
    });
  };
  /**取消发起的审批任务 */
  retract = async () => {
    return await kernel.deleteInstance({ id: this.target.id });
  };
}

abstract class BaseTodo implements StytemITodo {
  id: string;
  name: string;
  todoList: StytemTodosType[];
  doList: StytemTodosType[];
  applyList: StytemTodosType[];
  constructor() {
    this.name = '';
    this.id = '';
    this.todoList = [];
    this.doList = [];
    this.applyList = [];
  }
  get count() {
    return this.todoList.length;
  }
  getTodoList = () => {};
  getApplyList = () => {};
  approve = (target: any) => {};
  reject = (target: any) => {};
  cancel = (target: any) => {};
  protected removeList = <T extends any[]>(list: T, needRemoveId: string) => {
    return list.length > 1 ? list.filter((n) => n.id !== needRemoveId) : [];
  };
}
/**好友待办 */
export class FriendTodo extends BaseTodo {
  // id: string;
  // name: string;
  todoList: XRelation[];
  doList: XRelation[];
  applyList: XRelation[];
  constructor() {
    super();
    this.name = '好友审核';
    this.id = 'firend';
    this.todoList = [];
    this.doList = [];
    this.applyList = [];
    this.getTodoList();
    this.getApplyList();
  }
  get count() {
    return this.todoList.length;
  }
  getTodoList = async () => {
    const res = await userCtrl.User?.queryJoinApproval();
    if (res?.success && res.data.result && res.data.result.length > 0) {
      const list = res.data.result.filter((n: XRelation) => {
        return n.team?.target?.typeName === TargetType.Person;
      });
      if (list.length) {
        list.forEach((n) => {
          if (n.status === 1) {
            this.todoList.push(n);
          } else {
            this.doList.push(n);
          }
        });
      }
    }
  };

  getApplyList = async () => {
    const res = await userCtrl.User?.queryJoinApply();
    if (res?.success && res.data.result) {
      this.applyList = res.data.result.filter((n: XRelation) => {
        return n.team?.target?.typeName === TargetType.Person;
      });
    }
    return this.applyList;
  };

  approve = async (
    target: schema.XRelation,
  ): Promise<model.ResultType<schema.XRelation>> => {
    const result = await userCtrl.User.approvalFriendApply(
      target,
      CommonStatus.ApplyStartStatus,
    );
    if (result.success) {
      if (target.status === 1) {
        this.todoList = this.removeList<XRelation[]>(this.todoList, target.id);
      } else {
        this.doList = this.removeList(this.doList, target.id);
      }
    }
    return result;
  };
  reject = async (target: schema.XRelation) => {
    const result = await userCtrl.User.approvalFriendApply(
      target,
      CommonStatus.RejectStartStatus,
    );
    if (result.success) {
      this.todoList = this.removeList(this.todoList, target.id);
      this.doList.push(target);
    }
    return result;
  };
  cancel = async (target: schema.XRelation) => {
    const result = await userCtrl.User.cancelJoinApply(target.id);
    if (result.success) {
      this.applyList = this.removeList(this.applyList, target.id);
    }
    return result;
  };
}
/**组织单位待办 */
export class TeamTodo extends BaseTodo {
  static _self: TeamTodo;
  id: string;
  name: string;
  constructor() {
    super();
    this.name = '单位审核';
    this.id = 'org';
    this.getTodoList();
    this.getApplyList();
  }
  get count() {
    return this.todoList.length;
  }
  getTodoList = async () => {
    const res = await userCtrl.User?.queryJoinApproval();
    if (res?.success && res.data.result && res.data.result.length > 0) {
      const list = res.data.result.filter((n: XRelation) => {
        return n.team?.target?.typeName !== TargetType.Person;
      });
      if (list.length) {
        list.map((n) => {
          if (n.status === 1) {
            this.todoList.push(n);
          } else {
            this.doList.push(n);
          }
        });
      }
    }
  };
  getApplyList = async () => {
    const res = await userCtrl.User?.queryJoinApply();
    if (res?.success && res.data.result) {
      this.applyList = res.data.result.filter((n: XRelation) => {
        return n.team?.target?.typeName !== TargetType.Person;
      });
    }
    return this.applyList;
  };
  approve = async (
    target: schema.XRelation,
  ): Promise<model.ResultType<schema.XRelation>> => {
    const result = await userCtrl.User.approvalFriendApply(
      target,
      CommonStatus.ApplyStartStatus,
    );
    if (result.success) {
      if (target.status === 1) {
        this.todoList = this.removeList(this.todoList, target.id);
      } else {
        this.doList = this.removeList(this.doList, target.id);
      }
    }
    return result;
  };
  reject = async (target: schema.XRelation) => {
    const result = await userCtrl.User.approvalFriendApply(
      target,
      CommonStatus.RejectStartStatus,
    );
    if (result.success) {
      this.todoList = this.removeList(this.todoList, target.id);
      this.doList.push(target);
    }
    return result;
  };
  cancel = async (target: schema.XRelation) => {
    const result = await kernel.cancelJoinTeam({
      id: target.id,
      typeName: target.team?.target?.typeName || TargetType.Company, // 如果没有就默认是单位，暂时
      belongId: userCtrl.User.target.id,
    });
    if (result.success) {
      this.applyList = this.removeList(this.applyList, target.id);
    }
    return result;
  };
}

/**加入市场审批 */
export class StoreTodo extends BaseTodo {
  id: string;
  name: string;
  todoList: schema.XMarketRelation[];
  doList: schema.XMarketRelation[];
  applyList: schema.XMarketRelation[];
  constructor() {
    super();
    this.name = '加入市场';
    this.id = 'store';
    this.todoList = [];
    this.doList = [];
    this.applyList = [];
    this.getTodoList();
    this.getApplyList();
  }
  get count() {
    return this.todoList.length;
  }
  getTodoList = async () => {
    const res = await kernel.queryJoinMarketApplyByManager({
      id: userCtrl.User.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res?.success && res.data.total > 0 && res.data.result) {
      res.data.result.forEach((n) => {
        if (n.status === 1) {
          this.todoList.push(n);
        } else {
          this.doList.push(n);
        }
      });
    }
  };

  getApplyList = async () => {
    const res = await kernel.queryJoinMarketApplyByManager({
      id: userCtrl.User.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res?.success && res.data.result) {
      this.applyList = res.data.result;
    }
    return this.applyList;
  };

  approve = async (
    target: schema.XMarketRelation,
  ): Promise<model.ResultType<boolean>> => {
    const result = await kernel.approvalJoinApply({
      id: target.id,
      status: CommonStatus.ApplyStartStatus,
    });
    if (result.success) {
      if (target.status === 1) {
        this.todoList = this.removeList(this.todoList, target.id);
      } else {
        this.doList = this.removeList(this.doList, target.id);
      }
    }
    return result;
  };
  reject = async (target: schema.XMarketRelation) => {
    const result = await kernel.approvalJoinApply({
      id: target.id,
      status: CommonStatus.ApplyStartStatus,
    });
    if (result.success) {
      this.todoList = this.removeList(this.todoList, target.id);
      this.doList.push(target);
    }
    return result;
  };
  cancel = async (target: schema.XMarketRelation) => {
    const result = await userCtrl.User.cancelJoinMarketApply(target.id);
    if (result.success) {
      this.applyList = this.removeList(this.applyList, target.id);
    }
    return result;
  };
}

/**商品上架审批 */
export class ProductTodo extends BaseTodo {
  id: string;
  name: string;
  todoList: schema.XMerchandise[];
  doList: schema.XMerchandise[];
  applyList: schema.XMerchandise[];
  constructor() {
    super();
    this.name = '商品上架';
    this.id = 'product';
    this.todoList = [];
    this.doList = [];
    this.applyList = [];
    this.getTodoList();
    this.getApplyList();
  }
  get count() {
    return this.todoList.length;
  }
  getTodoList = async () => {
    const res = await kernel.queryMerchandiesApplyByManager({
      id: userCtrl.User.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res?.success && res.data.result && res.data.result.length > 0) {
      res.data.result.forEach((n) => {
        if (n.status === 1) {
          this.todoList.push(n);
        } else {
          this.doList.push(n);
        }
      });
    }
  };

  getApplyList = async () => {
    const res = await kernel.queryMerchandiseApply({
      id: userCtrl.User.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    console.log(res.data.result);
    if (res?.success && res.data.result) {
      this.applyList = res.data.result;
    }
    return this.applyList;
  };

  approve = async (target: schema.XMerchandise): Promise<model.ResultType<boolean>> => {
    const result = await kernel.approvalMerchandise({
      id: target.id,
      status: CommonStatus.ApplyStartStatus,
    });
    if (result.success) {
      if (target.status === 1) {
        this.todoList = this.removeList(this.todoList, target.id);
      } else {
        this.doList = this.removeList(this.doList, target.id);
      }
    }
    return result;
  };
  reject = async (target: schema.XMerchandise) => {
    const result = await kernel.approvalMerchandise({
      id: target.id,
      status: CommonStatus.ApplyStartStatus,
    });
    if (result.success) {
      this.todoList = this.removeList(this.todoList, target.id);
      this.doList.push(target);
    }
    return result;
  };
  cancel = async (target: schema.XMerchandise) => {
    const result = await kernel.deleteMerchandise({
      id: target.id,
      belongId: userCtrl.User.target.id,
    });
    if (result.success) {
      this.applyList = this.removeList(this.applyList, target.id);
    }
    return result;
  };
}
