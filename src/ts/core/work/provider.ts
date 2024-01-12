import { common, kernel, schema } from '../../base';
import { TaskStatus } from '../public/enums';
import { UserProvider } from '../user';
import { IWorkTask, TaskTypeName, WorkTask } from './task';
/** 任务集合名 */
const TaskCollName = 'work-task';
export interface IWorkProvider {
  /** 用户ID */
  userId: string;
  /** 当前用户 */
  user: UserProvider;
  /** 待办 */
  todos: IWorkTask[];
  /** 变更通知 */
  notity: common.Emitter;
  /** 任务更新 */
  updateTask(task: schema.XWorkTask): void;
  /** 加载实例详情 */
  loadInstanceDetail(
    id: string,
    belongId: string,
  ): Promise<schema.XWorkInstance | undefined>;
  /** 加载待办 */
  loadTodos(reload?: boolean): Promise<IWorkTask[]>;
  /** 加载任务数量 */
  loadTaskCount(typeName: TaskTypeName): Promise<number>;
  /** 加载任务事项 */
  loadContent(typeName: TaskTypeName, reload?: boolean): Promise<IWorkTask[]>;
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
  async loadContent(
    typeName: TaskTypeName,
    reload: boolean = false,
  ): Promise<IWorkTask[]> {
    if (typeName === '待办') {
      return await this.loadTodos(reload);
    }
    return await this.loadTasks(typeName, 0);
  }
  async loadTodos(reload: boolean = false): Promise<IWorkTask[]> {
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
  async loadTasks(typeName: TaskTypeName, skip: number = 0): Promise<IWorkTask[]> {
    const tasks: IWorkTask[] = [];
    const result = await kernel.collectionLoad<schema.XWorkTask[]>(
      this.userId,
      [],
      TaskCollName,
      {
        options: {
          match: this._typeMatch(typeName),
          sort: {
            createTime: -1,
          },
        },
        skip: skip,
        take: 30,
      },
    );
    if (result.success && result.data && result.data.length > 0) {
      result.data.forEach((item) => {
        if (tasks.every((i) => i.id != item.id)) {
          tasks.push(new WorkTask(item, this.user, true));
        }
      });
    }
    return tasks.filter((i) => i.isTaskType(typeName));
  }
  async loadTaskCount(typeName: TaskTypeName): Promise<number> {
    const res = await kernel.collectionLoad(this.userId, [], TaskCollName, {
      options: {
        match: this._typeMatch(typeName),
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
    return await kernel.findInstance(belongId, id);
  }
  private _typeMatch(typeName: TaskTypeName): any {
    switch (typeName) {
      case '已办':
        return {
          status: {
            _gte_: 100,
          },
          records: {
            _exists_: true,
          },
        };
      case '已发起':
        return {
          createUser: this.userId,
          nodeId: {
            _exists_: false,
          },
        };
      case '抄送':
        return {
          approveType: '抄送',
        };
      default:
        return {
          status: {
            _lt_: 100,
          },
        };
    }
  }
}
