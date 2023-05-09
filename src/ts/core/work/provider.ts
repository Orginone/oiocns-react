import { kernel, model, schema } from '../../base';
import { PageAll } from '../public/consts';
import { SpeciesType, TaskStatus } from '../public/enums';
import { IPerson } from '../target/person';
import { IApplication } from '../thing/app/application';
import { IWorkDefine } from '../thing/base/work';
import { IMarket } from '../thing/market/market';
export interface IWorkProvider {
  user: IPerson;
  /** 待办 */
  todos: schema.XWorkTask[];
  /** 加载待办任务 */
  loadTodos(reload?: boolean): Promise<schema.XWorkTask[]>;
  /** 加载已办任务 */
  loadDones(req: model.IdModel): Promise<schema.XWorkRecordArray>;
  /** 加载我发起的办事任务 */
  loadApply(req: model.IdModel): Promise<schema.XWorkTaskArray>;
  /** 任务更新 */
  updateTask(task: schema.XWorkTask): void;
  /** 任务审批 */
  approvalTask(
    tasks: schema.XWorkTask[],
    status: number,
    comment?: string,
    data?: string,
  ): Promise<void>;
  /** 查询任务明细 */
  loadTaskDetail(task: schema.XWorkTask): Promise<schema.XWorkInstance | undefined>;
  /** 查询流程定义 */
  findFlowDefine(defineId: string): Promise<IWorkDefine | undefined>;
}

export class WorkProvider implements IWorkProvider {
  constructor(_user: IPerson) {
    this.user = _user;
  }
  user: IPerson;
  todos: schema.XWorkTask[] = [];
  private _todoLoaded: boolean = false;
  updateTask(task: schema.XWorkTask): void {
    const index = this.todos.findIndex((i) => i.id === task.id);
    if (task.status < TaskStatus.ApprovalStart) {
      if (index < 0) {
        this.todos.unshift(task);
      } else {
        this.todos[index] = task;
      }
    } else if (index > -1) {
      this.todos.splice(index, 1);
    }
  }
  async loadTodos(reload?: boolean): Promise<schema.XWorkTask[]> {
    if (!this._todoLoaded || reload) {
      let res = await kernel.queryApproveTask({ id: '0', page: PageAll });
      if (res.success) {
        this._todoLoaded = true;
        this.todos = res.data.result || [];
      }
    }
    return this.todos;
  }
  async loadDones(req: model.IdModel): Promise<schema.XWorkRecordArray> {
    return (await kernel.queryWorkRecord(req)).data;
  }
  async loadApply(req: model.IdModel): Promise<schema.XWorkTaskArray> {
    return (await kernel.queryMyApply(req)).data;
  }
  async approvalTask(
    tasks: schema.XWorkTask[],
    status: number,
    comment: string,
    data: any,
  ): Promise<void> {
    for (const task of tasks) {
      if (task.status < TaskStatus.ApprovalStart) {
        if (status === -1) {
          await kernel.recallWorkInstance({
            id: task.id,
            page: PageAll,
          });
        } else {
          await kernel.approvalTask({
            id: task.id,
            status: status,
            comment: comment,
            data: data,
          });
        }
      }
    }
  }
  async loadTaskDetail(
    task: schema.XWorkTask,
  ): Promise<schema.XWorkInstance | undefined> {
    const res = await kernel.queryWorkInstanceById({
      id: task.instanceId,
      page: PageAll,
    });
    return res.data;
  }
  async findFlowDefine(defineId: string): Promise<IWorkDefine | undefined> {
    for (const target of this.user.targets) {
      for (const species of target.species) {
        const defines: IWorkDefine[] = [];
        switch (species.metadata.typeName) {
          case SpeciesType.Market:
            defines.push(...(await (species as IMarket).loadWorkDefines()));
            break;
          case SpeciesType.Application:
            defines.push(...(await (species as IApplication).loadWorkDefines()));
            break;
        }
        for (const define of defines) {
          if (define.metadata.id === defineId) {
            return define;
          }
        }
      }
    }
  }
}
