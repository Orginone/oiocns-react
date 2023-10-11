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
  /** 所有 */
  tasks: IWorkTask[];
  /** 变更通知 */
  notity: common.Emitter;
  /** 加载已办数量 */
  loadCompletedCount(): Promise<number>;
  /** 加载已完结数量 */
  loadApplyCount(): Promise<number>;
  /** 任务更新 */
  updateTask(task: schema.XWorkTask): void;
  /** 加载实例详情 */
  loadInstanceDetail(
    id: string,
    belongId: string,
  ): Promise<schema.XWorkInstance | undefined>;
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
  tasks: IWorkTask[] = [];
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
    switch (typeName) {
      case '待办事项':
        return await this.loadTodos(reload);
      case '已办事项':
        return await this.loadDones(reload);
      case '我发起的':
        return await this.loadApply(reload);
      case '抄送我的':
        return await this.loadCopys(reload);
    }
    return [];
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
  async loadCopys(reload: boolean = false): Promise<IWorkTask[]> {
    if (reload) {
      this.tasks = [];
    }
    const skip = this.tasks.filter((i) => i.isTaskType('抄送我的')).length;
    await this.loadTasks(
      {
        approveType: '抄送',
      },
      skip,
    );
    return this.tasks.filter((i) => i.isTaskType('抄送我的'));
  }
  async loadDones(reload: boolean = false): Promise<IWorkTask[]> {
    if (reload) {
      this.tasks = [];
    }
    const skip = this.tasks.filter((i) => i.isTaskType('已办事项')).length;
    await this.loadTasks(
      {
        status: {
          _gte_: 100,
        },
        records: {
          _exists_: true,
        },
      },
      skip,
    );
    return this.tasks.filter((i) => i.isTaskType('已办事项'));
  }
  async loadApply(reload: boolean = false): Promise<IWorkTask[]> {
    if (reload) {
      this.tasks = [];
    }
    const skip = this.tasks.filter((i) => i.isTaskType('我发起的')).length;
    await this.loadTasks(
      {
        createUser: this.userId,
        nodeId: {
          _exists_: false,
        },
      },
      skip,
    );
    return this.tasks.filter((i) => i.isTaskType('我发起的'));
  }
  async loadTasks(match: any, skip: number): Promise<void> {
    const result = await kernel.collectionLoad<schema.XWorkTask[]>(
      this.userId,
      [],
      TaskCollName,
      {
        options: {
          match: match,
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
        if (this.tasks.every((i) => i.id != item.id)) {
          this.tasks.push(new WorkTask(item, this.user));
        }
      });
    }
  }
  async loadCompletedCount(): Promise<number> {
    const res = await kernel.collectionLoad(this.userId, [], TaskCollName, {
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
    const res = await kernel.collectionLoad(this.userId, [], TaskCollName, {
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
    return await kernel.findInstance(belongId, id);
  }
}
