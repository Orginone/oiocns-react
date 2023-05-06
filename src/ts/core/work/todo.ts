import { common, kernel } from '@/ts/base';
import { Emitter } from '@/ts/base/common';
import orgCtrl from '@/ts/controller';
import { XRelation, XWorkInstance, XWorkTaskHistory } from '@/ts/base/schema';
import { PageAll } from '../public/consts';

// 消息变更推送
export const workNotify = new Emitter();
export interface ITodo {
  /** 唯一Id */
  id: string;
  /** 事项名称 */
  name: string;
  /** 备注 */
  remark: string;
  /** 共享组织 */
  shareId: string;
  /** 所在空间ID */
  belongId: string;
  /** 分类Id */
  speciesId: string;
  /** 对象 */
  metadata: any;
  /** 创建时间 */
  createTime: string;
  /** 发起人 */
  createUser: string;
  /** 状态 */
  status: number;
  /** 事项类型 */
  typeName: string;
  /** 审批办事 */
  approval(status: number, comment: string, data: string): Promise<boolean>;
}

export class WorkTodo extends common.Entity implements ITodo {
  id: string;
  name: string;
  typeName: string;
  remark: string;
  shareId: string;
  belongId: string;
  speciesId: string;
  createUser: string;
  createTime: string;
  status: number;
  metadata: XWorkTaskHistory;
  constructor(metadata: XWorkTaskHistory) {
    super();
    this.id = metadata.id;
    this.name = metadata.instance!.title;
    this.metadata = metadata;
    this.remark = '';
    this.typeName = '事项';
    this.status = metadata.status;
    this.createTime = metadata.createTime;
    this.shareId = metadata.instance!.belongId;
    this.belongId = metadata.instance!.belongId;
    this.createUser = metadata.instance!.createUser;
    this.speciesId = metadata.instance!.define?.speciesId || '';
    this.metadata = metadata;
  }
  async approval(status: number, comment: string, data: string): Promise<boolean> {
    const res = await kernel.approvalTask({
      id: this.id,
      comment: comment,
      status: status,
      data: data,
    });
    if (res.success) {
      orgCtrl.user.todos = orgCtrl.user.todos.filter((a) => a.id != this.id);
      workNotify.changCallback();
    }
    return res.success;
  }
  async getInstance() {
    return await kernel.queryWorkInstanceById({
      id: this.metadata.instanceId,
      page: PageAll,
    });
  }
}

export class OrgTodo extends common.Entity implements ITodo {
  id: string;
  name: string;
  typeName: string;
  remark: string;
  shareId: string;
  belongId: string;
  speciesId: string;
  createTime: string;
  createUser: string;
  status: number;
  metadata: XRelation;
  constructor(metadata: XRelation) {
    super();
    this.id = metadata.id;
    this.metadata = metadata;
    this.typeName = '关系';
    this.remark = '';
    this.speciesId = '';
    this.status = metadata.status;
    this.createTime = metadata.createTime;
    this.name = `申请加入${metadata.team?.name}`;
    this.shareId = metadata.team?.targetId || '0';
    this.belongId = metadata.team?.targetId || '0';
    this.createUser = metadata.targetId;
    this.metadata = metadata;
  }
  async approval(status: number, _: string, _data: string): Promise<boolean> {
    const res = await kernel.joinTeamApproval({
      id: this.metadata.id,
      status: status,
    });
    if (res.success) {
      orgCtrl.user.todos = orgCtrl.user.todos.filter((a) => a.id != this.id);
      workNotify.changCallback();
    }
    return res.success;
  }
}
