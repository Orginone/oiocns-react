import { schema } from '@/ts/base';
import {
  XMarketRelation,
  XMerchandise,
  XRelation,
  XRelationArray,
} from '@/ts/base/schema';

/**
 * 应用待办&平台待办
 * */
export interface iTodo {
  /**@id 当前应用id */
  id: string;
  /**@name 当前应用name */
  name: string;
  /**@count  待办数量*/
  count: number;
  /**@todoList  待办数据列表*/
  todoList: TodoItem[] | undefined;
  /**@doList  已办数据列表*/
  doList: TodoItem[] | undefined;
  /**@noticeList  待审阅抄送列表*/
  noticeList?: TodoItem[] | undefined;
  /**@applyList  我的申请数据列表*/
  applyList: TodoItem[] | undefined;
  /**@desc 获取待办列表 */
  getTodoList: () => Promise<TodoItem[] | undefined>;
  /**@desc 获取已办列表 */
  getDoList: () => Promise<TodoItem[] | undefined>;
  /**@desc 获取待shenyuechaosx列表 */
  getNoticeList?: () => Promise<TodoItem[] | undefined>;
  /**@desc 获取申请列表 */
  getApplyList: () => Promise<TodoItem[] | undefined>;
}

/**todoItem 待办数据*/
export interface TodoItem {
  /**@name 当前目标 对象 */
  target: any;
  /**@desc 同意 */
  approve: (comment: string) => void;
  /**@desc 拒绝 */
  refuse: (comment: string) => {};
  /**@desc 取消申请 */
  retract: () => {};
}
export type StytemTodosType = XRelation | XMarketRelation | XMerchandise;
export interface StytemITodo {
  /**@id 当前模块id */
  id: string;
  /**@name 当前模块name */
  name: string;
  /**@count  待办数量*/
  get count(): number;
  /**@todoList  待办数据列表*/
  todoList: StytemTodosType[];
  /**@doList  已办数据列表*/
  doList: StytemTodosType[];
  /**@applyList  我的申请数据列表*/
  applyList: StytemTodosType[];
  /**@getTodoList 获取待办列表 */
  getTodoList: () => void;
  /**@getApplyList 获取申请列表 */
  getApplyList: () => void;

  /**@approve 同意请求 */
  approve: (target: StytemTodosType) => any;
  /**@reject 拒绝请求 */
  reject: (target: StytemTodosType) => any;
  /**@cancel 取消请求 */
  cancel: (target: StytemTodosType) => any;
}
