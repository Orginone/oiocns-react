import { XFlowTaskHistory, XRelation } from '@/ts/base/schema';

export default interface ITodo {
  /** 唯一Id */
  id: string;
  /** 事项名称 */
  name: string;
  /** 事项类型 */
  type: string;
  /** 备注 */
  remark: string;
  /** 共享组织 */
  shareId: string;
  /** 所在空间ID */
  spaceId: string;
  /** 分类Id */
  speciesId: string;
  /** 对象 */
  target: any;
  /** 创建时间 */
  createTime: string;
  /** 发起人 */
  createUser: string;
  /** 状态 */
  status: number;
}

export class FlowTodo implements ITodo {
  id: string;
  name: string;
  type: string;
  remark: string;
  shareId: string;
  spaceId: string;
  speciesId: string;
  createUser: string;
  createTime: string;
  status: number;
  target: XFlowTaskHistory;
  constructor(task: XFlowTaskHistory) {
    this.id = task.id;
    this.name = task.instance!.title;
    this.target = task;
    this.type = '事项';
    this.remark = '';
    this.status = task.status;
    this.createTime = task.createTime;
    this.shareId = task.instance!.belongId;
    this.spaceId = task.instance!.belongId;
    this.createUser = task.instance!.createUser;
    this.speciesId = task.instance!.define?.speciesId || '';
  }
}

export class OrgTodo implements ITodo {
  id: string;
  name: string;
  type: string;
  remark: string;
  shareId: string;
  spaceId: string;
  speciesId: string;
  createTime: string;
  createUser: string;
  status: number;
  target: XRelation;
  constructor(task: XRelation) {
    this.id = task.id;
    this.target = task;
    this.type = '组织';
    this.remark = '';
    this.speciesId = '';
    this.status = task.status;
    this.createTime = task.createTime;
    this.name = `申请加入${task.team?.name}`;
    this.shareId = task.team?.targetId || '0';
    this.spaceId = task.team?.targetId || '0';
    this.createUser = task.targetId;
  }
}
