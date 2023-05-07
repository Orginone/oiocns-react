import { common, kernel } from '@/ts/base';
import { Emitter } from '@/ts/base/common';
import orgCtrl from '@/ts/controller';
import { XWorkInstance, XWorkTask } from '@/ts/base/schema';
import { PageAll } from '../public/consts';

// 消息变更推送
export const workNotify = new Emitter();

/** 待办项 */
export interface ITodo {
  /** 数据 */
  metadata: XWorkTask;
  /** 获取实例 */
  getInstance(): Promise<XWorkInstance>;
  /** 审批办事 */
  approval(status: number, comment?: string, data?: string): Promise<boolean>;
}

export class WorkTodo extends common.Entity implements ITodo {
  metadata: XWorkTask;
  constructor(metadata: XWorkTask) {
    super();
    this.metadata = metadata;
  }
  async approval(
    status: number,
    comment: string = '',
    data: string = '',
  ): Promise<boolean> {
    const res = await kernel.approvalTask({
      id: this.metadata.id,
      comment: comment,
      status: status,
      data: data,
    });
    if (res.success) {
      orgCtrl.user.todos = orgCtrl.user.todos.filter(
        (a) => a.metadata.id != this.metadata.id,
      );
      workNotify.changCallback();
    }
    return res.success;
  }
  async getInstance(): Promise<XWorkInstance> {
    const res = await kernel.queryWorkInstanceById({
      id: this.metadata.instanceId,
      page: PageAll,
    });
    return res.data;
  }
}
