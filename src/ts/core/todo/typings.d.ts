/**
 * 应用待办
 * */
interface Application {
  /**@id 当前应用id */
  id: string;
  /**@name 当前应用name */
  name: string;
  /**@name  待办数量*/
  count: number;
  /**@name 当前列表数据类型 */
  listType: string;
  /**@name 当前列表*/
  list: Application[];

  /**@desc 同意 */
  approve: () => void;
  /**@desc 拒绝 */
  refuse: () => {};
  /**@desc 取消申请 */
  retract: () => {};
}
