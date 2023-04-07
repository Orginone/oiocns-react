import React from 'react';
import { message } from 'antd';
import { OrderStatus } from '@/ts/core';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { SaleColumns } from '../../../../config/columns';
import CardOrTableComp from '@/components/CardOrTableComp';
import { IApprovalItem, ITodoGroup } from '@/ts/core/todo/itodo';
import todoCtrl from '@/ts/controller/todo/todoCtrl';

// 卡片渲染
interface IProps {
  typeName: string;
  todoGroup: ITodoGroup;
}

/**
 * 办事-售卖订单
 * @returns
 */
const TodoOrg: React.FC<IProps> = (props) => {
  const [key, forceUpdate] = useObjectUpdate(props);
  /** 生成订单操作菜单  */
  const orderOperation = (data: IApprovalItem) => {
    // 是否是待发货的订单状态
    const menu = [];
    if (data.Data.status < 102) {
      menu.push({
        key: 'retractApply',
        label: '取消订单',
        onClick: async () => {
          if (await data.reject(OrderStatus.SellerCancel, '')) {
            message.success('取消订单成功');
            forceUpdate();
          }
        },
      });
      menu.push({
        key: 'approve',
        label: '确认交付',
        onClick: async () => {
          if (await data.pass(OrderStatus.Deliver, '')) {
            message.success('交付成功');
            // forceUpdate();
            todoCtrl.changCallback();
          }
        },
      });
    }
    return menu;
  };
  return (
    <CardOrTableComp<IApprovalItem>
      key={key}
      rowKey={(record) => record?.Data?.id}
      columns={SaleColumns}
      dataSource={[]}
      request={async (page) => {
        let data = await props.todoGroup.getTodoList(true);
        return {
          result: data.splice(page.offset, page.limit),
          total: data.length,
          offset: page.offset,
          limit: page.limit,
        };
      }}
      operation={(item) => orderOperation(item)}
    />
  );
};

export default TodoOrg;
