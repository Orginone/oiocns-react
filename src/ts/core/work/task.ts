import { schema, model, kernel } from '../../base';
import { TaskStatus, storeCollName } from '../public';
import { IBelong } from '../target/base/belong';
import { IPerson } from '../target/person';

export interface IWorkTask {
  /** 当前用户 */
  user: IPerson;
  /** 归属空间 */
  belong: IBelong;
  /** 任务元数据 */
  metadata: schema.XWorkTask;
  /** 流程实例 */
  instance: schema.XWorkInstance;
  /** 实例携带的数据 */
  instanceData: model.InstanceDataModel;
  /** 加用户任务信息 */
  targets: schema.XTarget[];
  /** 任务更新 */
  updated(_metadata: schema.XWorkTask): Promise<boolean>;
  /** 加载流程实例数据 */
  loadInstance(reload?: boolean): Promise<boolean>;
  /** 撤回任务 */
  recallApply(): Promise<boolean>;
  /** 任务审批 */
  approvalTask(status: number, comment?: string): Promise<boolean>;
}

export class WorkTask implements IWorkTask {
  constructor(_metadata: schema.XWorkTask, _user: IPerson) {
    this.metadata = _metadata;
    this.user = _user;
    this.belong = _user.companys.find((i) => i.belongId === _metadata.belongId) || _user;
  }
  user: IPerson;
  belong: IBelong;
  metadata: schema.XWorkTask;
  instance: schema.XWorkInstance;
  instanceData: model.InstanceDataModel;
  get targets(): schema.XTarget[] {
    if (this.metadata.taskType == '加用户') {
      try {
        return JSON.parse(this.metadata.content) || [];
      } catch (ex) {
        console.log(ex);
      }
    }
    return [];
  }
  async updated(_metadata: schema.XWorkTask): Promise<boolean> {
    if (this.metadata.id === _metadata.id) {
      this.metadata = _metadata;
      await this.loadInstance(true);
      return true;
    }
    return false;
  }
  async loadInstance(reload: boolean = false): Promise<boolean> {
    if (this.instanceData !== undefined && !reload) return true;
    const res = await kernel.anystore.aggregate(
      this.metadata.belongId,
      storeCollName.WorkInstance,
      {
        match: {
          id: this.metadata.instanceId,
        },
        limit: 1,
        lookup: {
          from: storeCollName.WorkTask,
          localField: 'id',
          foreignField: 'instanceId',
          as: 'tasks',
        },
      },
    );
    if (res.data && res.data.length > 0) {
      try {
        this.instance = res.data[0];
        this.instanceData = JSON.parse(this.instance.data);
        return this.instanceData !== undefined;
      } catch (ex) {
        console.log(ex);
      }
    }
    return false;
  }
  async recallApply(): Promise<boolean> {
    if (await this.loadInstance()) {
      if (this.instance.createUser === this.user.id) {
        if (await kernel.recallWorkInstance({ id: this.instance.id })) {
          return true;
        }
      }
    }
    return false;
  }
  async approvalTask(status: number, comment: string): Promise<boolean> {
    if (this.metadata.status < TaskStatus.ApprovalStart) {
      if (status === -1) {
        return await this.recallApply();
      }
      if (await this.loadInstance(true)) {
        const res = await kernel.approvalTask({
          id: this.metadata.id,
          status: status,
          comment: comment,
          data: JSON.stringify(this.instanceData),
        });
        if (res.data && status < TaskStatus.RefuseStart) {
          if (this.targets && this.targets.length === 2) {
            for (const item of this.user.targets) {
              if (item.id === this.targets[1].id) {
                item.pullMembers([this.targets[0]]);
              }
            }
          }
        }
      }
    }
    return false;
  }
}
