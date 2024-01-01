import { logger } from '@/ts/base/common';
import { IWork } from '.';
import { schema, model, kernel } from '../../base';
import { TaskStatus, entityOperates } from '../public';
import { IBelong } from '../target/base/belong';
import { UserProvider } from '../user';
import { IWorkApply } from './apply';
import { FileInfo, IFile } from '../thing/fileinfo';
import { Acquire } from './executor/acquire';
import { IExecutor } from './executor';
export type TaskTypeName = '待办' | '已办' | '抄送' | '发起的';

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
  /** 是否为历史对象 */
  isHistory: boolean;
  /** 执行器 */
  executors: IExecutor[];
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
  approvalTask(
    status: number,
    comment?: string,
    fromData?: Map<string, model.FormEditData>,
  ): Promise<boolean>;
  /** 获取办事 */
  findWorkById(wrokId: string): Promise<IWork | undefined>;
  /** 加载执行器 */
  loadExecutors(node: model.WorkNodeModel): IExecutor[];
}

export class WorkTask extends FileInfo<schema.XEntity> implements IWorkTask {
  private history: boolean;
  constructor(
    _metadata: schema.XWorkTask,
    _user: UserProvider,
    history: boolean = false,
  ) {
    super(_metadata as any, _user.user!.directory);
    this.taskdata = _metadata;
    this.user = _user;
    this.history = history;
  }
  user: UserProvider;
  cacheFlag: string = 'worktask';
  taskdata: schema.XWorkTask;
  instance: schema.XWorkInstance | undefined;
  instanceData: model.InstanceDataModel | undefined;
  get isHistory(): boolean {
    return this.history;
  }
  executors: IExecutor[] = [];
  get groupTags(): string[] {
    return [this.belong.name, this.taskdata.taskType, this.taskdata.approveType];
  }
  get metadata(): schema.XEntity {
    let typeName = this.taskdata.taskType;
    if (
      ['子流程', '网关'].includes(this.taskdata.approveType) &&
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
      case '已办':
        return this.taskdata.status >= TaskStatus.ApprovalStart;
      case '发起的':
        return this.taskdata.createUser == this.userId;
      case '待办':
        return this.taskdata.status < TaskStatus.ApprovalStart;
      case '抄送':
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
  loadExecutors(node: model.WorkNodeModel) {
    let executors: IExecutor[] = [];
    for (const item of node.executors) {
      switch (item.funcName) {
        case '数据申领':
          executors.push(new Acquire(item, this));
          break;
        case '归属权变更':
          break;
      }
    }
    return executors;
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

  async createApply(): Promise<IWorkApply | undefined> {
    if (this.taskdata.approveType == '子流程' || this.taskdata.approveType == '网关') {
      await this.loadInstance();
      var define = await this.findWorkById(this.taskdata.defineId);
      if (define) {
        return await define.createApply(this.id, this.instanceData);
      }
    }
  }

  async findWorkById(wrokId: string): Promise<IWork | undefined> {
    for (var target of this.user.targets) {
      for (var app of await target.directory.loadAllApplication()) {
        const work = await app.findWork(wrokId);
        if (work) {
          return work;
        }
      }
    }
  }

  async approvalTask(
    status: number,
    comment: string,
    fromData: Map<string, model.FormEditData>,
  ): Promise<boolean> {
    if (this.taskdata.status < TaskStatus.ApprovalStart) {
      if (status === -1) {
        return await this.recallApply();
      }
      if (this.taskdata.taskType === '加用户') {
        return this.approvalJoinTask(status, comment);
      } else if (await this.loadInstance(true)) {
        fromData?.forEach((data, k) => {
          if (this.instanceData) {
            this.instanceData.data[k] = [data];
          }
        });
        const res = await kernel.approvalTask({
          id: this.taskdata.id,
          status: status,
          comment: comment,
          data: JSON.stringify(this.instanceData),
        });
        return res.data === true;
      }
    }
    return false;
  }

  // 申请加用户审批
  private async approvalJoinTask(status: number, comment: string): Promise<boolean> {
    if (this.targets && this.targets.length === 2) {
      const res = await kernel.approvalTask({
        id: this.taskdata.id,
        status: status,
        comment: comment,
        data: JSON.stringify(this.instanceData),
      });
      if (res.data && status < TaskStatus.RefuseStart) {
        for (const item of this.user.targets) {
          if (item.id === this.targets[1].id) {
            item.pullMembers([this.targets[0]]);
            return true;
          }
        }
      }
    }
    return false;
  }
}
