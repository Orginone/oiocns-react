import { common, kernel, model, schema } from '../../base';
import { PageAll } from '../public/consts';
import { TaskStatus } from '../public/enums';
import { UserProvider } from '../user';
// 历史任务存储集合名称
const hisWorkCollName = 'work-task';
export interface IWorkProvider {
  /** 用户ID */
  userId: string;
  /** 当前用户 */
  user: UserProvider;
  /** 待办 */
  todos: schema.XWorkTask[];
  /** 变更通知 */
  notity: common.Emitter;
  /** 加载待办任务 */
  loadTodos(reload?: boolean): Promise<schema.XWorkTask[]>;
  /** 加载已办任务 */
  loadDones(req: model.IdPageModel): Promise<model.PageResult<schema.XWorkRecord>>;
  /** 加载我发起的办事任务 */
  loadApply(req: model.IdPageModel): Promise<model.PageResult<schema.XWorkTask>>;
  /** 任务更新 */
  updateTask(task: schema.XWorkTask): void;
  /** 根据表单id查询表单特性 */
  loadAttributes(id: string, belongId: string): Promise<schema.XAttribute[]>;
  /** 根据分类id查询分类项 */
  loadItems(id: string): Promise<schema.XSpeciesItem[]>;
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
      let res = await kernel.queryApproveTask({ id: '0' });
      if (res.success) {
        this._todoLoaded = true;
        this.todos = res.data.result || [];
        this.notity.changCallback();
      }
    }
    return this.todos;
  }
  async loadDones(req: model.IdPageModel): Promise<model.PageResult<schema.XWorkRecord>> {
    const res = await kernel.anystore.pageRequest<schema.XWorkTask>(
      this.userId,
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
      req.page || PageAll,
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
  async loadApply(req: model.IdPageModel): Promise<model.PageResult<schema.XWorkTask>> {
    const res = await kernel.anystore.pageRequest<schema.XWorkTask>(
      this.userId,
      hisWorkCollName,
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
    return res.data;
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
}
