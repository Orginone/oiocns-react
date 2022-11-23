import Provider from '../provider';
import { ApplicationTodo } from './todo';

export const loadApplicationTodos = async () => {
  if (Provider.getPerson) {
    const data = await Provider.getPerson?.getOwnProducts(); // 暂用获取我的应用接口，待改为新借口
    console.log('menu', data);
    let applicationTodos: { label: string; key: string; node: ApplicationTodo }[] = [];
    if (data && data.length > 0) {
      // 遍历数据生成待办应用列表
      applicationTodos = data.map((product) => {
        const prod = product.prod;
        return {
          label: prod.name,
          key: '/todo/' + prod.id,
          node: new ApplicationTodo(prod.id, prod.name),
        };
      });
    }
    return applicationTodos;
  }
};
