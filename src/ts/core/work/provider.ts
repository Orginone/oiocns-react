import { common, kernel, model, schema } from '../../base';
import { PageAll } from '../public/consts';
import { SpeciesType, TaskStatus } from '../public/enums';
import { IPerson } from '../target/person';
import { OperateType } from '../target/provider';
import { IApplication } from '../thing/app/application';
import { IWorkDefine } from '../thing/base/work';
import { IMarket } from '../thing/market/market';
import orgCtrl from '@/ts/controller';
// 历史任务存储集合名称
const hisWorkCollName = 'work-task';
export interface IWorkProvider {
  /** 当前用户 */
  user: IPerson;
  /** 待办 */
  todos: schema.XWorkTask[];
  /** 变更通知 */
  notity: common.Emitter;
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
    this.notity = new common.Emitter();
    kernel.on('RecvTask', (data: schema.XWorkTask) => {
      if (this._todoLoaded) {
        this.updateTask(data);
      }
    });
  }
  user: IPerson;
  notity: common.Emitter;
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
    this.notity.changCallback();
  }
  async loadTodos(reload?: boolean): Promise<schema.XWorkTask[]> {
    if (!this._todoLoaded || reload) {
      let res = await kernel.queryApproveTask({ id: '0', page: PageAll });
      if (res.success) {
        this._todoLoaded = true;
        this.todos = res.data.result || [];
        this.notity.changCallback();
      }
    }
    return this.todos;
  }
  async loadDones(req: model.IdModel): Promise<schema.XWorkRecordArray> {
    const res = await kernel.anystore.pageRequest<schema.XWorkTask>(
      this.user.metadata.id,
      hisWorkCollName,
      {
        match: {
          belongId: req.id,
          status: {
            _gte_: 100,
          },
        },
        sort: {
          createTime: -1,
        },
      },
      req.page,
    );
    return {
      ...res.data,
      result: (res.data.result || [])
        .map((i) => {
          if (i.records && i.records.length > 0) {
            i.records[0].task = i;
            return i.records[0];
          }
          return undefined;
        })
        .filter((i) => i != undefined)
        .map((i) => i!),
    };
  }
  async loadApply(req: model.IdModel): Promise<schema.XWorkTaskArray> {
    const res = await kernel.anystore.pageRequest<schema.XWorkTask>(
      this.user.metadata.id,
      hisWorkCollName,
      {
        match: {
          belongId: req.id,
          createUser: req.id,
        },
        sort: {
          createTime: -1,
        },
      },
      req.page,
    );
    return res.data;
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
          const res = await kernel.approvalTask({
            id: task.id,
            status: status,
            comment: comment,
            data: data,
          });
          if (res.data && status < TaskStatus.RefuseStart && task.taskType == '加用户') {
            let targets = <Array<schema.XTarget>>JSON.parse(task.content);
            if (targets.length == 2) {
              let teamTarget = this.user.targets.find(
                (a) => a.metadata.id == targets[1].id,
              );
              if (teamTarget) {
                if (await teamTarget.pullMembers([targets[0]])) {
                  orgCtrl.target.prodRelationChange(
                    OperateType.Add,
                    teamTarget,
                    targets[0],
                  );
                }
              }
            }
          }
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
