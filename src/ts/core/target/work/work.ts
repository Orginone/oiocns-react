import IWork from './iwork';
import { Emitter } from '@/ts/base/common';
import ITodo, { FlowTodo } from './todo';
import { kernel } from '@/ts/base';

// 消息变更推送
export const workNotify = new Emitter();

// 办事
export default class Work implements IWork {
  todos: ITodo[] = [];
  async approvals(
    todos: ITodo[],
    status: number,
    comment: string,
    data: string,
  ): Promise<boolean> {
    for (let todo of todos) {
      switch (todo.type) {
        case '办事':
          (
            await kernel.approvalTask({
              id: todo.id,
              comment: comment,
              status: status,
              data: data,
            })
          ).success;
          break;
        default:
          break;
      }
    }
    this.todos = this.todos.filter((a) => !todos.includes(a));
    workNotify.changCallback();
    return true;
  }
  async approval(
    todo: ITodo,
    status: number,
    comment: string,
    data: string,
  ): Promise<boolean> {
    let success = false;
    switch (todo.type) {
      case '办事':
        success = (
          await kernel.approvalTask({
            id: todo.id,
            comment: comment,
            status: status,
            data: data,
          })
        ).success;
        break;
      default:
        break;
    }
    if (success) {
      this.todos = this.todos.filter((a) => a.id != todo.id);
      workNotify.changCallback();
    }
    return success;
  }

  async loadTodo(reload?: boolean): Promise<ITodo[]> {
    if (reload || this.todos.length == 0) {
      let res = await kernel.queryApproveTask({ id: '' });
      if (res.success && res.data.result) {
        this.todos = res.data.result.map((a) => new FlowTodo(a));
        workNotify.changCallback();
      }
    }
    return this.todos;
  }
}
