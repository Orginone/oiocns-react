import React from 'react';
import BuyOrder from './Buy';
import SellOrder from './Sell';
import { ITodoGroup } from '@/ts/core/todo/itodo';

// 卡片渲染
interface IProps {
  typeName: string;
  todoGroup: ITodoGroup;
}
/**
 * 办事-订单
 * @returns
 */
const OrderTodo: React.FC<IProps> = (props) => {
  let key = props.typeName.split('-');
  if (key.length > 1) {
    switch (key[1]) {
      case '待办':
        return <BuyOrder typeName={props.typeName} todoGroup={props.todoGroup} />;
      case '申请':
        return <SellOrder typeName={props.typeName} todoGroup={props.todoGroup} />;
      default:
        break;
    }
  }
  return <></>;
};

export default OrderTodo;
