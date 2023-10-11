import { common, kernel, model, schema } from '../../base';
import { storeCollName } from '../public/consts';
import { TaskStatus } from '../public/enums';
import { UserProvider } from '../user';
import { IWorkTask, WorkTask } from './task';
export interface IWorkProvider {
  /** 用户ID */
  userId: string;
  /** 当前用户 */
  user: UserProvider;
  /** 待办 */
  todos: IWorkTask[];
  /** 变更通知 */
  notity: common.Emitter;
  /** 加载已办数量 */
  loadCompletedCount(): Promise<number>;
  /** 加载已完结数量 */
  loadApplyCount(): Promise<number>;
  /** 加载待办任务 */
  loadTodos(reload?: boolean): Promise<IWorkTask[]>;
  /** 加载已办任务 */
  loadDones(req: model.IdPageModel): Promise<model.PageResult<IWorkTask>>;
  /** 加载我发起的办事任务 */
  loadApply(req: model.IdPageModel): Promise<model.PageResult<IWorkTask>>;
  /** 任务更新 */
  updateTask(task: schema.XWorkTask): void;
  /** 加载实例详情 */
  loadInstanceDetail(
    id: string,
    belongId: string,
  ): Promise<schema.XWorkInstance | undefined>;
}

export class WorkProvider implements IWorkProvider {
  constructor(_user: UserProvider) {
    this.user = _user;
    this.userId = _user.user!.id;
    this.notity = new common.Emitter();
    kernel.on('RecvTask', (data: schema.XWorkTask) => {
      if (this._todoLoaded && data.approveType != '抄送') {
        this.updateTask(data);
      }
    });
  }
  userId: string;
  user: UserProvider;
  notity: common.Emitter;
  todos: IWorkTask[] = [];
  private _todoLoaded: boolean = false;
  updateTask(task: schema.XWorkTask): void {
    const index = this.todos.findIndex((i) => i.metadata.id === task.id);
    if (index > -1) {
      if (task.status < TaskStatus.ApprovalStart) {
        this.todos[index].updated(task);
      } else {
        this.todos.splice(index, 1);
      }
      this.notity.changCallback();
    } else {
      if (task.status < TaskStatus.ApprovalStart) {
        this.todos.unshift(new WorkTask(task, this.user));
        this.notity.changCallback();
      }
    }
  }
  async loadTodos(reload?: boolean): Promise<IWorkTask[]> {
    if (!this._todoLoaded || reload) {
      let res = await kernel.queryApproveTask({ id: '0' });
      if (res.success) {
        this._todoLoaded = true;
        this.todos = (res.data.result || []).map((task) => new WorkTask(task, this.user));
        this.notity.changCallback();
      }
    }
    return this.todos;
  }
  async loadDones(req: model.IdPageModel): Promise<model.PageResult<IWorkTask>> {
    const res = await kernel.collectionLoad<schema.XWorkTask[]>(this.userId, [], {
      collName: storeCollName.WorkTask,
      options: {
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
      skip: req.page?.offset ?? 0,
      take: req.page?.limit ?? 30,
      requireTotalCount: true,
    });
    return {
      offset: req.page?.offset || 0,
      limit: req.page?.limit || 30,
      result: (res.data || [])
        .filter((task) => task.records && task.records.length > 0)
        .map((task) => new WorkTask(task, this.user)),
      total: res.totalCount,
    };
  }
  async loadApply(req: model.IdPageModel): Promise<model.PageResult<IWorkTask>> {
    const res = await kernel.collectionLoad<schema.XWorkTask[]>(this.userId, [], {
      collName: storeCollName.WorkTask,
      options: {
        match: {
          belongId: req.id,
          createUser: this.userId,
          nodeId: {
            _exists_: false,
          },
        },
        sort: {
          createTime: -1,
        },
      },
      skip: req.page?.offset ?? 0,
      take: req.page?.limit ?? 30,
      requireTotalCount: true,
    });
    return {
      offset: req.page?.offset || 0,
      limit: req.page?.limit || 30,
      result: (res.data || []).map((task) => new WorkTask(task, this.user)),
      total: res.totalCount,
    };
  }
  async loadCompletedCount(): Promise<number> {
    const res = await kernel.collectionLoad(this.userId, [], {
      collName: storeCollName.WorkTask,
      options: {
        match: {
          status: {
            _gte_: 100,
          },
          records: {
            _exists_: true,
          },
        },
      },
      isCountQuery: true,
    });
    if (res.success) {
      return res.totalCount;
    }
    return 0;
  }
  async loadApplyCount(): Promise<number> {
    const res = await kernel.collectionLoad(this.userId, [], {
      collName: storeCollName.WorkTask,
      options: {
        match: {
          createUser: this.userId,
          nodeId: {
            _exists_: false,
          },
        },
      },
      isCountQuery: true,
    });
    if (res.success) {
      return res.totalCount;
    }
    return 0;
  }
  async loadInstanceDetail(
    id: string,
    belongId: string,
  ): Promise<schema.XWorkInstance | undefined> {
    const res = await kernel.collectionAggregate(
      belongId,
      [belongId],
      storeCollName.WorkInstance,
      {
        match: {
          id: id,
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
}
