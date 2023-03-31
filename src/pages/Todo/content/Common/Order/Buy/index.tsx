import React from 'react';
import { message } from 'antd';
import { OrderStatus } from '@/ts/core';
import { XOrderDetail } from '@/ts/base/schema';
import CardOrTableComp from '@/components/CardOrTableComp';
import { IOrderApplyItem, ITodoGroup } from '@/ts/core/todo/itodo';
import { BuyOrderColumns, BuyOrderItemColumns } from '../../../../config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';

// 卡片渲染
interface IProps {
  typeName: string;
  todoGroup: ITodoGroup;
}
/**
 * 办事-采购订单
 * @returns
 */
const BuyOrder: React.FC<IProps> = (props) => {
  const [key, forceUpdate] = useObjectUpdate(props);
  const orderOperation = (data: IOrderApplyItem, _record?: XOrderDetail) => {
    const item = data.Data;
    // 是否是待发货的订单状态
    let allowToCancel = item.status < 102;
    if (_record) {
      allowToCancel = _record ? _record.status < 102 : false;
    } else {
      allowToCancel =
        item.details?.find((n: XOrderDetail) => n.status < OrderStatus.Deliver) !=
        undefined;
    }
    const menu = [];
    if (allowToCancel) {
      menu.push({
        key: 'retractApply',
        label: '取消订单',
        onClick: async () => {
          if (_record) {
            if (await data.cancelItem(_record?.id, OrderStatus.BuyerCancel, '')) {
              message.success('取消订单成功');
              forceUpdate();
            }
          }
        },
      });
    } else if (_record && _record.status == OrderStatus.Deliver) {
      menu.push({
        key: 'reject',
        label: '退货退款',
        onClick: async () => {
          if (await data.reject(_record.id, OrderStatus.RejectOrder, '')) {
            message.success('退货退款成功');
            forceUpdate();
          }
        },
      });
    }
    return menu;
  };
  /**采购订单详情表格 */
  const expandedRowRender = (item: IOrderApplyItem) => {
    return (
      <CardOrTableComp<XOrderDetail>
        showChangeBtn={false}
        columns={BuyOrderItemColumns}
        rowKey={(record) => record.id}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={item?.Data?.details || []}
        pagination={true}
        operation={(_record: XOrderDetail) => orderOperation(item, _record)}
      />
    );
  };
  return (
    <CardOrTableComp<IOrderApplyItem>
      key={key}
      showChangeBtn={false}
      rowKey={(record) => record?.Data?.id}
      columns={BuyOrderColumns}
      dataSource={[]}
      expandable={{
        // defaultExpandAllRows: true,
        indentSize: 0,
        expandedRowRender: (record: IOrderApplyItem) => expandedRowRender(record),
      }}
      request={async (page) => {
        let data = await props.todoGroup.getApplyList(page);
        return {
          result: data.result as IOrderApplyItem[],
          limit: data.limit,
          offset: data.offset,
          total: data.total,
        };
      }}
      operation={(item) => orderOperation(item)}
    />
  );
};

export default BuyOrder;
