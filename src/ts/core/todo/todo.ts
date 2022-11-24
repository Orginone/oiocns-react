import { iTodo, TodoItem } from './typings';
import { common, kernel } from '../../base';
import Provider from '../provider';

/** 应用待办的实现*/
export class SystemTodo implements iTodo {
  id: string;
  name: string;
  todoList: TodoItem[] | undefined;
  doList: TodoItem[] | undefined;
  noticeList: TodoItem[] | undefined;
  applyList: TodoItem[] | undefined;
  count: number = 0;
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  public getTodoList = async () => {
    const result = await kernel.queryApproveTask({ id: this.id });
    return (this.todoList = this._createTodoItem(result));
  };
  public getDoList = async () => {
    const result = await kernel.queryRecord({
      id: this.id,
      spaceId: Provider.userId,
      page: { offset: 0, filter: '', limit: common.Constants.MAX_UINT_8 },
    });

    return (this.doList = this._createTodoItem(result));
  };
  public getNoticeList = async () => {
    const result = await kernel.queryNoticeTask({ id: this.id });
    return (this.noticeList = this._createTodoItem(result));
  };
  public getApplyList = async () => {
    const result = await kernel.queryInstance({
      id: this.id,
      spaceId: Provider.userId,
      status: 1,
      page: { offset: 0, filter: '', limit: common.Constants.MAX_UINT_8 },
    });
    return (this.applyList = this._createTodoItem(result));
  };

  /**生成待办数据实例 */
  private _createTodoItem = (result) => {
    if (result.success && result.data && result.data.total > 0) {
      return result.data.result.map((n) => new Todo(n));
    } else {
      return [];
    }
  };
}
/**平台待办实例 */
export class ApplicationTodo extends SystemTodo {
  id: string;
  name: string;
  count: number;
  getTodoList: () => Promise<TodoItem[] | undefined>;
  getDoList: () => Promise<TodoItem[] | undefined>;
  getApplyList: () => Promise<TodoItem[] | undefined>;
}
/** 待办数据实现 */
class Todo implements TodoItem {
  target: any;
  constructor(target) {
    this.target = target;
  }

  approve: () => void;
  refuse: () => {};
  retract: () => {};
}
