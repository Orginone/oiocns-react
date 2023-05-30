import { common, kernel, model, schema } from '../../base';
import { PageAll, storeCollName } from '../public/consts';
import { SpeciesType, TaskStatus } from '../public/enums';
import { IPerson } from '../target/person';
import { IApplication } from '../thing/app/application';
import { IWorkDefine } from '../thing/base/flow';
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
  loadApply(req: model.IdModel): Promise<model.PageResult<schema.XWorkTask>>;
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
  /** 删除办事实例 */
  deleteInstance(id: string): Promise<boolean>;
  /** 根据表单id查询表单特性 */
  loadAttributes(id: string, belongId: string): Promise<schema.XAttribute[]>;
  /** 根据字典id查询字典项 */
  loadItems(id: string): Promise<schema.XDictItem[]>;
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
      this.user.id,
      hisWorkCollName,
      {
        match: {
          belongId: req.id,
          status: {
            _gte_: 100,
          },
          records: {
            _exists_: true,
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
  async loadApply(req: model.IdModel): Promise<model.PageResult<schema.XWorkTask>> {
    const res = await kernel.anystore.pageRequest<schema.XWorkTask>(
      this.user.id,
      hisWorkCollName,
      {
        match: {
          belongId: req.id,
          createUser: this.user.id,
          nodeId: {
            _exists_: false,
          },
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
              for (const item of this.user.targets) {
                if (item.id === targets[1].id) {
                  item.pullMembers([targets[0]]);
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
    const res = await kernel.anystore.aggregate(
      task.belongId,
      storeCollName.WorkInstance,
      {
        match: {
          id: task.instanceId,
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
      return res.data[0];
    }
  }
  async findFlowDefine(defineId: string): Promise<IWorkDefine | undefined> {
    for (const target of this.user.targets) {
      for (const species of target.species) {
        const defines: IWorkDefine[] = [];
        switch (species.typeName) {
          case SpeciesType.Market:
          case SpeciesType.Application:
            defines.push(...(await (species as IApplication).loadWorkDefines()));
            break;
        }
        for (const define of defines) {
          if (define.id === defineId) {
            return define;
          }
        }
      }
    }
  }
  async deleteInstance(id: string): Promise<boolean> {
    const res = await kernel.recallWorkInstance({ id, page: PageAll });
    return res.success;
  }
  async loadAttributes(id: string, belongId: string): Promise<schema.XAttribute[]> {
    const res = await kernel.queryFormAttributes({
      id: id,
      subId: belongId,
    });
    if (res.success) {
      return res.data.result || [];
    }
    return [];
  }
  async loadItems(id: string): Promise<schema.XDictItem[]> {
    const res = await kernel.queryDictItems({
      id: id,
      page: PageAll,
    });
    if (res.success) {
      return res.data.result || [];
    }
    return [];
  }
}
