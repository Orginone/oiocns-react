import { logger } from '@/ts/base/common';
import { IWork } from '.';
import { schema, model, kernel } from '../../base';
import { TaskStatus, entityOperates } from '../public';
import { IBelong } from '../target/base/belong';
import { UserProvider } from '../user';
import { IWorkApply } from './apply';
import { FileInfo, IFile } from '../thing/fileinfo';
export type TaskTypeName = '待办事项' | '已办事项' | '抄送我的' | '我发起的';

export interface IWorkTask extends IFile {
  /** 内容 */
  comment: string;
  /** 当前用户 */
  user: UserProvider;
  /** 归属空间 */
  belong: IBelong;
  /** 任务元数据 */
  taskdata: schema.XWorkTask;
  /** 流程实例 */
  instance: schema.XWorkInstance | undefined;
  /** 实例携带的数据 */
  instanceData: model.InstanceDataModel | undefined;
  /** 加用户任务信息 */
  targets: schema.XTarget[];
  /** 是否为指定的任务类型 */
  isTaskType(type: TaskTypeName): boolean;
  /** 是否满足条件 */
  isMatch(filter: string): boolean;
  /** 任务更新 */
  updated(_metadata: schema.XWorkTask): Promise<boolean>;
  /** 加载流程实例数据 */
  loadInstance(reload?: boolean): Promise<boolean>;
  /** 撤回任务 */
  recallApply(): Promise<boolean>;
  /** 创建申请(子流程) */
  createApply(): Promise<IWorkApply | undefined>;
  /** 任务审批 */
  approvalTask(status: number, comment?: string): Promise<boolean>;
}

export class WorkTask extends FileInfo<schema.XEntity> implements IWorkTask {
  constructor(_metadata: schema.XWorkTask, _user: UserProvider) {
    super(_metadata as any, _user.user!.directory);
    this.taskdata = _metadata;
    this.user = _user;
  }
  user: UserProvider;
  cacheFlag: string = 'worktask';
  taskdata: schema.XWorkTask;
  instance: schema.XWorkInstance | undefined;
  instanceData: model.InstanceDataModel | undefined;
  get groupTags(): string[] {
    return [this.belong.name, this.taskdata.taskType, this.taskdata.approveType];
  }
  get metadata(): schema.XEntity {
    let typeName = this.taskdata.taskType;
    if (
      this.taskdata.approveType === '子流程' &&
      this.taskdata.identityId &&
      this.taskdata.identityId.length > 5
    ) {
      typeName = '子流程';
    }
    return {
      ...this.taskdata,
      icon: '',
      typeName,
      belong: undefined,
      name: this.taskdata.title,
      code: this.taskdata.instanceId,
      remark: this.comment || '暂无信息',
    };
  }
  delete(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  operates(): model.OperateModel[] {
    return [entityOperates.Open, entityOperates.Remark, entityOperates.QrCode];
  }
  get comment(): string {
    if (this.targets.length === 2) {
      return `${this.targets[0].name}[${this.targets[0].typeName}]申请加入${this.targets[1].name}[${this.targets[1].typeName}]`;
    }
    return this.taskdata.content;
  }
  get belong(): IBelong {
    for (const company of this.user.user!.companys) {
      if (company.id === this.taskdata.belongId) {
        return company;
      }
    }
    return this.user.user!;
  }
  get targets(): schema.XTarget[] {
    if (this.taskdata.taskType == '加用户') {
      try {
        return JSON.parse(this.taskdata.content) || [];
      } catch (ex) {
        logger.error(ex as Error);
      }
    }
    return [];
  }
  isMatch(filter: string): boolean {
    return JSON.stringify(this.taskdata).includes(filter);
  }
  isTaskType(type: TaskTypeName): boolean {
    switch (type) {
      case '已办事项':
        return this.taskdata.status >= TaskStatus.ApprovalStart;
      case '我发起的':
        return this.taskdata.createUser == this.userId;
      case '待办事项':
        return this.taskdata.status < TaskStatus.ApprovalStart;
      case '抄送我的':
        return this.taskdata.approveType === '抄送';
    }
  }
  async updated(_metadata: schema.XWorkTask): Promise<boolean> {
    if (this.taskdata.id === _metadata.id) {
      this.taskdata = _metadata;
      await this.loadInstance(true);
      return true;
    }
    return false;
  }
  async loadInstance(reload: boolean = false): Promise<boolean> {
    if (this.instanceData !== undefined && !reload) return true;
    const data = await kernel.findInstance(
      this.taskdata.belongId,
      this.taskdata.instanceId,
    );
    if (data) {
      try {
        this.instance = data;
        this.instanceData = eval(`(${data.data})`);
        return this.instanceData !== undefined;
      } catch (ex) {
        logger.error(ex as Error);
      }
    }
    return false;
  }
  async recallApply(): Promise<boolean> {
    if ((await this.loadInstance()) && this.instance) {
      if (this.instance.createUser === this.belong.userId) {
        if (await kernel.recallWorkInstance({ id: this.instance.id })) {
          return true;
        }
      }
    }
    return false;
  }
  async approvalTask(status: number, comment: string): Promise<boolean> {
    if (this.taskdata.status < TaskStatus.ApprovalStart) {
      if (status === -1) {
        return await this.recallApply();
      }
      if (this.taskdata.taskType === '加用户' || (await this.loadInstance(true))) {
        const res = await kernel.approvalTask({
          id: this.taskdata.id,
          status: status,
          comment: comment,
          data: JSON.stringify(this.instanceData),
        });
        if (res.data && status < TaskStatus.RefuseStart) {
          if (this.targets && this.targets.length === 2) {
            for (const item of this.user.targets) {
              if (item.id === this.targets[1].id) {
                item.pullMembers([this.targets[0]]);
                break;
              }
            }
          }
        }
      }
    }
    return false;
  }
  async createApply(): Promise<IWorkApply | undefined> {
    if (this.taskdata.approveType == '子流程') {
      await this.loadInstance();
      var define = await this.findWorkById(this.taskdata.defineId);
      if (define) {
        return await define.createApply(this.id, this.instanceData);
      }
    }
  }

  private async findWorkById(wrokId: string): Promise<IWork | undefined> {
    for (var target of this.user.targets) {
      for (var app of await target.directory.loadAllApplication()) {
        const work = await app.findWork(wrokId);
        if (work) {
          return work;
        }
      }
    }
  }
}
