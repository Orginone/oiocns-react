import { common, kernel, model, schema } from '../../base';
import { PageAll, storeCollName } from '../public/consts';
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
  /** 加载待办任务 */
  loadTodos(reload?: boolean): Promise<IWorkTask[]>;
  /** 加载已办任务 */
  loadDones(req: model.IdPageModel): Promise<model.PageResult<IWorkTask>>;
  /** 加载我发起的办事任务 */
  loadApply(req: model.IdPageModel): Promise<model.PageResult<IWorkTask>>;
  /** 任务更新 */
  updateTask(task: schema.XWorkTask): void;
  /** 根据表单id查询表单特性 */
  loadAttributes(id: string, belongId: string): Promise<schema.XAttribute[]>;
  /** 根据分类id查询分类项 */
  loadItems(id: string): Promise<schema.XSpeciesItem[]>;
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
      if (this._todoLoaded) {
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
    if (task.status < TaskStatus.ApprovalStart) {
      if (index < 0) {
        this.todos.unshift(new WorkTask(task, this.user));
      } else {
        this.todos[index].updated(task);
      }
    } else if (index > -1) {
      this.todos.splice(index, 1);
    }
    this.notity.changCallback();
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
    const res = await kernel.collectionPageRequest<schema.XWorkTask>(
      this.userId,
      storeCollName.WorkTask,
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
      req.page || PageAll,
    );
    return {
      ...res.data,
      result: (res.data.result || [])
        .filter((i) => i.records && i.records.length > 0)
        .map((i) => new WorkTask(i, this.user)),
    };
  }
  async loadApply(req: model.IdPageModel): Promise<model.PageResult<IWorkTask>> {
    const res = await kernel.collectionPageRequest<schema.XWorkTask>(
      this.userId,
      storeCollName.WorkTask,
      {
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
      req.page || PageAll,
    );
    return {
      ...res.data,
      result: (res.data.result || []).map((task) => new WorkTask(task, this.user)),
    };
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
  async loadItems(id: string): Promise<schema.XSpeciesItem[]> {
    const res = await kernel.querySpeciesItems({
      id: id,
      page: PageAll,
    });
    if (res.success) {
      return res.data.result || [];
    }
    return [];
  }
  async loadInstanceDetail(
    id: string,
    belongId: string,
  ): Promise<schema.XWorkInstance | undefined> {
    const res = await kernel.collectionAggregate(belongId, storeCollName.WorkInstance, {
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
    });
    if (res.data && res.data.length > 0) {
      return res.data[0];
    }
  }
}
