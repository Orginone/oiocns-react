import { Emitter } from '@/ts/base/common';
import ITodo, { FlowTodo, OrgTodo } from './todo';
import { kernel, pageAll } from '@/ts/base';

// 消息变更推送
export const workNotify = new Emitter();
/**
 * 办事接口
 */
export interface IWork {
  todos: ITodo[];
  /** 查询待办 */
  loadTodo(reload?: boolean): Promise<ITodo[]>;
  /** 批量审批办事 */
  approvals(
    todos: ITodo[],
    status: number,
    comment: string,
    data: string,
  ): Promise<boolean>;
  /** 审批办事 */
  approval(todo: ITodo, status: number, comment: string, data: string): Promise<boolean>;
}

// 办事
export class Work implements IWork {
  private orgTodo: ITodo[] = [];
  private flowTodo: ITodo[] = [];
  get todos() {
    return [...this.orgTodo, ...this.flowTodo];
  }
  async approvals(
    todos: ITodo[],
    status: number,
    comment: string,
    data: string,
  ): Promise<boolean> {
    for (let todo of todos) {
    await todo.approval(status, comment, data);
    }
    this.orgTodo = this.orgTodo.filter((a) => !todos.includes(a));
    this.flowTodo = this.flowTodo.filter((a) => !todos.includes(a));
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
    if (await todo.approval(status, comment, data)) {
      this.orgTodo = this.orgTodo.filter((a) => a.id != todo.id);
      this.flowTodo = this.flowTodo.filter((a) => a.id != todo.id);
      workNotify.changCallback();
    }
    return success;
  }
  async loadTodo(reload?: boolean): Promise<ITodo[]> {
    if (reload || this.orgTodo.length == 0) {
      let org = await kernel.queryTeamJoinApproval({ id: '0', page: pageAll() });
      if (org.success) {
        this.orgTodo = org.data.result?.map((a) => new OrgTodo(a)) || [];
      }
    }
    if (reload || this.flowTodo.length == 0) {
      let res = await kernel.queryApproveTask({ id: '0' });
      if (res.success) {
        this.flowTodo = res.data.result?.map((a) => new FlowTodo(a)) || [];
      }
    }
    return [...this.orgTodo, ...this.flowTodo];
  }
}
