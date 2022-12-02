import { ApplicationTodo, FriendTodo, TeamTodo, StoreTodo, ProductTodo } from './todo';
import OrderTodo from './order';
import userCtrl from '@/ts/controller/setting/userCtrl';
// import { kernel } from '@/ts/base';

export type MenuTodoType = {
  label: string;
  key: string;
  node?: ApplicationTodo;
  icon?: string;
};
/**
 * 获取应用待办列表
 * @returns
 */
export const loadApplicationTodos = async () => {
  // 错误的接口数据，当下面的有数据时进行切换调试开发
  if (userCtrl.User) {
    const data = await userCtrl.User?.getOwnProducts(); // 暂用获取我的应用接口，待改为新借口
    // console.log('menu', data);
    let applicationTodos: { label: string; key: string; node: ApplicationTodo }[] = [];
    if (data && data.length > 0) {
      // 遍历数据生成待办应用列表
      applicationTodos = data.map((product) => {
        const prod = product._prod;
        return {
          label: prod.name,
          key: '/todo/' + prod.id,
          node: new ApplicationTodo(prod.id, prod.name),
        };
      });
    }
    // 正确的接口 但是还没有数据没有调通
    // if (Provider.getPerson) {
    //   const result = await kernel.queryApproveTask({ id: Provider.userId }); // 暂用获取我的应用接口，待改为新借口
    //   console.log('menu', result);
    //   let applicationTodos: { label: string; key: string; node: ApplicationTodo }[] = [];
    //   if (result && result.data && result.data.total > 0 && result.data.result) {
    //     // 遍历数据生成待办应用列表
    //     applicationTodos = result.data.result.map((task) => {
    //       const prod = task.prod;
    //       return {
    //         label: prod.name,
    //         key: '/todo/' + prod.id,
    //         node: new ApplicationTodo(prod.id, prod.name),
    //       };
    //     });
    //   }
    return applicationTodos;
  }
  return [];
};

export const productTodo = new ProductTodo();
export const friendTodo = new FriendTodo();
export const storeTodo = new StoreTodo();
export const teamTodo = new TeamTodo();
export const orderTodo = new OrderTodo();
