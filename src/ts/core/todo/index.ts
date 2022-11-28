import Provider from '../provider';
import { ApplicationTodo, FriendTodo, TeamTodo, StoreTodo, ProductTodo } from './todo';
import OrderTodo from './order';
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
  if (Provider.getPerson) {
    const data = await Provider.getPerson?.getOwnProducts(); // 暂用获取我的应用接口，待改为新借口
    // console.log('menu', data);
    let applicationTodos: { label: string; key: string; node: ApplicationTodo }[] = [];
    if (data && data.length > 0) {
      // 遍历数据生成待办应用列表
      applicationTodos = data.map((product) => {
        // const prod = product._prod;
        return {
          label: product.id,
          key: '/todo/' + product.id,
          node: new ApplicationTodo(product.id, product.id),
        };
      });
    }
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
