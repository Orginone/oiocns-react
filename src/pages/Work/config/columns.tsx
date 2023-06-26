import React from 'react';
import { Tag } from 'antd';
import { ProColumns } from '@ant-design/pro-table';
import { schema } from '@/ts/base';
import { IWork, IWorkTask } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

export const DefineColumns: ProColumns<IWork>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '名称',
    dataIndex: ['metadata', 'name'],
    width: 100,
  },
  {
    title: '编码',
    width: 100,
    dataIndex: ['metadata', 'code'],
  },
  {
    key: 'belongId',
    width: 100,
    title: '归属用户',
    dataIndex: ['metadata', 'belongId'],
    render: (_: any, record: IWork) => {
      return <EntityIcon entityId={record.metadata.belongId} showName />;
    },
  },
  {
    key: 'shareId',
    width: 100,
    title: '共享用户',
    dataIndex: ['metadata', 'shareId'],
    render: (_: any, record: IWork) => {
      return <EntityIcon entityId={record.metadata.shareId} showName />;
    },
  },
  {
    key: 'createUser',
    width: 100,
    title: '创建人员',
    dataIndex: 'createUser',
    render: (_: any, record: IWork) => {
      return <EntityIcon entityId={record.metadata.createUser} showName />;
    },
  },
  {
    title: '备注',
    width: 200,
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    valueType: 'dateTime',
    width: 200,
    dataIndex: ['metadata', 'createTime'],
  },
];
export const WorkColumns: ProColumns<IWorkTask>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '类型',
    dataIndex: ['metadata', 'taskType'],
    width: 80,
  },
  {
    title: '标题',
    width: 150,
    dataIndex: ['metadata', 'title'],
  },
  {
    key: 'shareId',
    width: 150,
    title: '共享组织',
    dataIndex: ['metadata', 'shareId'],
    render: (_: any, record: IWorkTask) => {
      return <EntityIcon entityId={record.metadata.shareId} showName />;
    },
  },
  {
    key: 'createUser',
    width: 100,
    title: '申请人',
    dataIndex: ['metadata', 'createUser'],
    render: (_: any, record: IWorkTask) => {
      return <EntityIcon entityId={record.metadata.createUser} showName />;
    },
  },
  {
    title: '发起组织',
    width: 100,
    dataIndex: ['metadata', 'applyId'],
    render: (_: any, record: IWorkTask) => {
      return <EntityIcon entityId={record.metadata.applyId} showName />;
    },
  },
  {
    title: '状态',
    width: 80,
    dataIndex: ['metadata', 'status'],
    render: (_: any, record: IWorkTask) => {
      const status = statusMap.get(record.metadata.status as number);
      return <Tag color={status!.color}>{status!.text}</Tag>;
    },
  },
  {
    title: '内容',
    width: 400,
    dataIndex: ['metadata', 'content'],
    render: (_: any, record: IWorkTask) => {
      if (record.metadata.taskType === '加用户') {
        if (record.targets.length === 2) {
          return `${record.targets[0].name}[${record.targets[0].typeName}]申请加入${record.targets[1].name}[${record.targets[1].typeName}]`;
        }
      }
      return record.metadata.content;
    },
  },
  {
    title: '申请时间',
    valueType: 'dateTime',
    width: 200,
    dataIndex: ['metadata', 'createTime'],
  },
];

export const DoneColumns: ProColumns<schema.XWorkRecord>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '类型',
    dataIndex: ['task', 'taskType'],
  },
  {
    title: '内容',
    dataIndex: ['task', 'title'],
  },
  {
    key: 'shareId',
    width: 200,
    title: '共享组织',
    dataIndex: 'shareId',
    render: (_: any, record: schema.XWorkRecord) => {
      return <EntityIcon entityId={record.task!.shareId} showName />;
    },
  },
  {
    key: 'createUser',
    width: 200,
    title: '申请人',
    dataIndex: 'createUser',
    render: (_: any, record: schema.XWorkRecord) => {
      return <EntityIcon entityId={record.task!.createUser} showName />;
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (_: any, record: schema.XWorkRecord) => {
      const status = statusMap.get(record.status as number);
      return <Tag color={status!.color}>{status!.text}</Tag>;
    },
  },
  {
    title: '意见',
    dataIndex: 'comment',
  },
  {
    title: '审批时间',
    valueType: 'dateTime',
    dataIndex: 'createTime',
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
  [
    240,
    {
      color: 'red',
      text: '已取消',
    },
  ],
]);
