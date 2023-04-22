import ITodo from './todo';
/**
 * 办事接口
 */
export default interface IWork {
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
