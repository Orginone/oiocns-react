import React from 'react';
import { Tag } from 'antd';
import orgCtrl from '@/ts/controller';
import { ProColumns } from '@ant-design/pro-table';
import ITodo from '@/ts/core/target/work/todo';

export const WorkColumns: ProColumns<ITodo>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '事项',
    dataIndex: ['name'],
  },
  {
    key: 'shareId',
    width: 200,
    title: '共享组织',
    dataIndex: 'shareId',
    render: (_: any, record: ITodo) => {
      return orgCtrl.provider.findNameById(record.shareId);
    },
  },
  {
    key: 'createUser',
    width: 200,
    title: '申请人',
    dataIndex: 'createUser',
    render: (_: any, record: ITodo) => {
      return orgCtrl.provider.findNameById(record.createUser);
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (_: any, record: ITodo) => {
      const status = statusMap.get(record.status as number);
      return <Tag color={status!.color}>{status!.text}</Tag>;
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '申请时间',
    dataIndex: ['Data', 'createTime'],
    valueType: 'dateTime',
  },
];

const statusMap = new Map([
  [
    1,
    {
      color: 'blue',
      text: '待处理',
    },
  ],
  [
    100,
    {
      color: 'green',
      text: '已同意',
    },
  ],
  [
    200,
    {
      color: 'red',
      text: '已拒绝',
    },
  ],
  [
    102,
    {
      color: 'green',
      text: '已发货',
    },
  ],
  [
    220,
    {
      color: 'gold',
      text: '买方取消订单',
    },
  ],
  [
    221,
    {
      color: 'volcano',
      text: '卖方取消订单',
    },
  ],
  [
    222,
    {
      color: 'default',
      text: '已退货',
    },
  ],
]);
