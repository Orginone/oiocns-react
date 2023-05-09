import React from 'react';
import { Tag } from 'antd';
import orgCtrl from '@/ts/controller';
import { ProColumns } from '@ant-design/pro-table';
import { ITodo } from '@/ts/core/work/todo';
import { schema } from '@/ts/base';
import { XWorkTask } from '@/ts/base/schema';
import { IWorkDefine } from '@/ts/core/thing/app/work/workDefine';

export const DefineColumns: ProColumns<IWorkDefine>[] = [
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
    key: 'isCreate',
    width: 200,
    title: '创建类',
    dataIndex: ['metadata', 'isCreate'],
    render: (_: any, record: IWorkDefine) => {
      return record.metadata.isCreate ? '是' : '否';
    },
  },
  {
    key: 'belongId',
    width: 100,
    title: '归属用户',
    dataIndex: ['metadata', 'belongId'],
    render: (_: any, record: IWorkDefine) => {
      return orgCtrl.provider.user?.findShareById(record.metadata.belongId).name;
    },
  },
  {
    key: 'shareId',
    width: 100,
    title: '共享用户',
    dataIndex: ['metadata', 'shareId'],
    render: (_: any, record: IWorkDefine) => {
      return orgCtrl.provider.user?.findShareById(record.metadata.shareId).name;
    },
  },
  {
    key: 'createUser',
    width: 100,
    title: '创建人员',
    dataIndex: 'createUser',
    render: (_: any, record: IWorkDefine) => {
      return orgCtrl.provider.user?.findShareById(record.metadata.createUser).name;
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
export const WorkColumns: ProColumns<ITodo>[] = [
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
    title: '内容',
    width: 100,
    dataIndex: ['metadata', 'title'],
  },
  {
    key: 'shareId',
    width: 200,
    title: '共享组织',
    dataIndex: 'shareId',
    render: (_: any, record: ITodo) => {
      return orgCtrl.provider.user?.findShareById(record.metadata.shareId).name;
    },
  },
  {
    key: 'createUser',
    width: 100,
    title: '申请人',
    dataIndex: 'createUser',
    render: (_: any, record: ITodo) => {
      return orgCtrl.provider.user?.findShareById(record.metadata.createUser).name;
    },
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'status',
    render: (_: any, record: ITodo) => {
      const status = statusMap.get(record.metadata.status as number);
      return <Tag color={status!.color}>{status!.text}</Tag>;
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    render: (_: any, record: ITodo) => {
      if (record.metadata.taskType === '加用户') {
        const targets: schema.XTarget[] = JSON.parse(record.metadata.remark);
        if (targets.length === 2) {
          return `${targets[0].name}[${targets[0].typeName}]申请加入${targets[1].name}[${targets[1].typeName}]`;
        }
      }
      return record.metadata.remark;
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
      return orgCtrl.provider.user?.findShareById(record.task!.shareId).name;
    },
  },
  {
    key: 'createUser',
    width: 200,
    title: '申请人',
    dataIndex: 'createUser',
    render: (_: any, record: schema.XWorkRecord) => {
      return orgCtrl.provider.user?.findShareById(record.task!.createUser).name;
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

export const ApplyColumns: ProColumns<XWorkTask>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
  },
  {
    title: '类型',
    dataIndex: 'taskType',
    width: 80,
  },
  {
    title: '内容',
    width: 100,
    dataIndex: 'title',
  },
  {
    key: 'shareId',
    width: 200,
    title: '共享组织',
    dataIndex: 'shareId',
    render: (_: any, record: XWorkTask) => {
      return orgCtrl.provider.user?.findShareById(record.shareId).name;
    },
  },
  {
    key: 'createUser',
    width: 100,
    title: '申请人',
    dataIndex: 'createUser',
    render: (_: any, record: XWorkTask) => {
      return orgCtrl.provider.user?.findShareById(record.createUser).name;
    },
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'status',
    render: (_: any, record: XWorkTask) => {
      const status = statusMap.get(record.status as number);
      return <Tag color={status!.color}>{status!.text}</Tag>;
    },
  },
  {
    title: '备注',
    width: 200,
    dataIndex: 'content',
  },
  {
    title: '申请时间',
    valueType: 'dateTime',
    width: 200,
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
]);
