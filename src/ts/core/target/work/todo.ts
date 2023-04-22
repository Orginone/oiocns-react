import { XFlowTaskHistory } from '@/ts/base/schema';

export default interface ITodo {
  /** 唯一Id */
  id: string;
  /** 事项名称 */
  name: string;
  /** 事项类型 */
  type: string;
  /** 共享组织 */
  shareId: string;
  /** 所在空间ID */
  spaceId: string;
  /** 分类Id */
  speciesId: string;
  /** 对象 */
  target: any;
  /** 发起人 */
  createUser: string;
  /** 状态 */
  status: number;
}

export class FlowTodo implements ITodo {
  id: string;
  name: string;
  type: string;
  shareId: string;
  spaceId: string;
  speciesId: string;
  /** 发起人 */
  createUser: string;
  /** 状态 */
  status: number;
  /** 对象 */
  target: XFlowTaskHistory;
  constructor(task: XFlowTaskHistory) {
    this.id = task.id;
    this.name = task.instance!.title;
    this.target = task;
    this.type = '办事';
    this.status = task.status;
    this.shareId = task.instance!.belongId;
    this.spaceId = task.instance!.belongId;
    this.createUser = task.instance!.createUser;
    this.speciesId = task.instance!.define?.speciesId || '';
  }
}
