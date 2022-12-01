import { model } from '../../base';

export interface ITodo {
  /**@count  待办数量*/
  getCount(): Promise<number>;
  /** 获得待办分组 */
  getTodoGroup(): Promise<ITodoGroup[]>;
}

/** 待办组 */
export interface ITodoGroup {
  /**@type 待办类型 */
  type: string;
  /** 待办名称 */
  name: string;
  /**@count  待办数量*/
  getCount(): Promise<number>;
  /**@desc 获取待办列表 */
  getTodoList(): Promise<IApprovalItem[]>;
  /**@desc 获取待抄送待阅列表 */
  getNoticeList(): Promise<IApprovalItem[]>;
  /**@desc 获取已办列表 */
  getDoList(page: model.PageRequest): Promise<IApprovalItem[]>;
  /**@desc 获取申请列表 */
  getApplyList(page: model.PageRequest): Promise<IApplyItem[]>;
}

/** 待办/已办项 */
export interface IApprovalItem {
  /** 获得审批内容 */
  Data: any;
  /**@pass 通过 */
  pass(status: number, remark: string): Promise<model.ResultType<any>>;
  /**@reject 拒绝 */
  reject(status: number, remark: string): Promise<model.ResultType<any>>;
}
/** 申请项 */
export interface IApplyItem {
  /** 获得审批内容 */
  Data: any;
  /**@cancel 取消 */
  cancel(status: number, remark: string): Promise<model.ResultType<any>>;
}
// export class JoinMarketTodo implements ITodoGroup {
//   private _name: string;
//   private _todoList: IApprovalItem[];
//   get type(): string {
//     return '应用上架';
//   }
//   get name(): string {
//     return this._name;
//   }
//   constructor() {}
//   async getCount(): Promise<number> {
//     if (this._todoList.length <= 0) {
//       await this.getTodoList();
//     }
//     return this._todoList.length;
//   }
//   getTodoList: () => Promise<IApprovalItem[]>;
//   getNoticeList: () => Promise<IApprovalItem[]>;
//   getDoList: (page: model.PageRequest) => Promise<IApprovalItem[]>;
//   getApplyList: (page: model.PageRequest) => Promise<IApplyItem>;
// }
