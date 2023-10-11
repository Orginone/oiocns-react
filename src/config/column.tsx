import React from 'react';
import { statusMap } from './consts';
import { Tag, Typography } from 'antd';
import { model, schema } from '@/ts/base';
import { ProColumns } from '@ant-design/pro-components';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { IWorkTask } from '@/ts/core';

/** 人员信息列 */
export const PersonColumns: ProColumns<schema.XTarget>[] = [
  { title: '序号', valueType: 'index', width: 50 },
  {
    title: '名称',
    dataIndex: 'name',
    render: (_: any, record: schema.XTarget) => {
      return <EntityIcon entityId={record.id} showName />;
    },
  },
  { title: '账号', dataIndex: 'code' },
  { title: '手机号', dataIndex: ['team', 'code'] },
  {
    title: '座右铭',
    dataIndex: 'remark',
    render: (_: any, record: schema.XTarget) => {
      return (
        <Typography.Paragraph ellipsis={{ rows: 1, expandable: true, symbol: '更多' }}>
          {record.remark}
        </Typography.Paragraph>
      );
    },
  },
];

/** 身份信息列 */
export const IdentityColumn: ProColumns<schema.XIdentity>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '角色编号',
    dataIndex: 'code',
  },
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '权限',
    dataIndex: 'name',
  },
  {
    title: '组织',
    dataIndex: 'shareId',
    render: (_: any, record: schema.XIdentity) => {
      return <EntityIcon entityId={record.shareId} showName />;
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

/** 分类子项信息列 */
export const SpeciesItemColumn: ProColumns<schema.XSpeciesItem>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
    width: 200,
  },
  {
    title: '信息',
    dataIndex: 'info',
    key: 'info',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 150,
  },
  {
    title: '归属组织',
    dataIndex: 'belongId',
    editable: false,
    key: 'belongId',
    width: 200,
    render: (_: any, record: schema.XSpeciesItem) => {
      return <EntityIcon entityId={record.belongId} showName />;
    },
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
    editable: false,
    key: 'createUser',
    width: 150,
    render: (_: any, record: schema.XSpeciesItem) => {
      return <EntityIcon entityId={record.createUser} showName />;
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 200,
    editable: false,
  },
];

/** 特性信息列 */
export const AttributeColumn: ProColumns<schema.XAttribute>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '特性编号',
    dataIndex: 'code',
    key: 'code',
    width: 200,
  },
  {
    title: '特性名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '值类型',
    dataIndex: ['property', 'valueType'],
    key: 'valueType',
    width: 150,
  },
  {
    title: '特性定义',
    dataIndex: 'remark',
    ellipsis: true,
    key: 'remark',
  },
];

/** 办事列 */
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

/** 补齐物的列 */
export const FullThingColumns = (fields: model.FieldModel[]) => {
  return FullEntityColumns([
    {
      id: 'chainId',
      code: 'chainId',
      name: '标识',
      valueType: '描述型',
      remark: '链标识',
    },
    ...fields,
  ]);
};

/** 补齐实体的列 */
export const FullEntityColumns = (fields: model.FieldModel[]) => {
  return [
    {
      id: 'id',
      code: 'id',
      name: '唯一标识',
      valueType: '描述型',
      remark: '由系统生成的唯一标记,无实义.',
    },
    {
      id: 'name',
      code: 'name',
      name: '名称',
      valueType: '描述型',
      remark: '描述信息',
    },
    {
      id: 'code',
      code: 'code',
      name: '代码',
      valueType: '描述型',
      remark: '标识代码',
    },
    ...fields,
    {
      id: 'belongId',
      code: 'belongId',
      name: '归属',
      valueType: '用户型',
      remark: '归属用户',
    },
    {
      id: 'createUser',
      code: 'createUser',
      name: '创建人',
      valueType: '用户型',
      remark: '创建标识的人',
    },
    {
      id: 'updateUser',
      code: 'updateUser',
      name: '变更人',
      valueType: '用户型',
      remark: '变更数据的人',
    },
    {
      id: 'createTime',
      code: 'createTime',
      name: '创建时间',
      valueType: '时间型',
      remark: '创建标识的时间',
    },
    {
      id: 'updateTime',
      code: 'updateTime',
      name: '修改时间',
      valueType: '时间型',
      remark: '最新修改时间',
    },
  ];
};

/** 办事列 */
export const WorkTaskColumns: model.FieldModel[] = [
  {
    id: 'id',
    code: 'id',
    name: '唯一标识',
    valueType: '描述型',
    remark: '由系统生成的唯一标记,无实义.',
  },
  {
    id: 'taskType',
    code: 'metadata.taskType',
    name: '类型',
    valueType: '选择型',
    remark: '任务类型',
    lookups: [
      {
        id: '0',
        text: '加用户',
        value: '加用户',
      },
      {
        id: '1',
        text: '事项',
        value: '事项',
      },
    ],
  },
  {
    id: 'title',
    code: 'metadata.title',
    name: '标题',
    valueType: '描述型',
    remark: '任务类型',
  },
  {
    id: 'shareId',
    code: 'metadata.shareId',
    name: '用户',
    valueType: '用户型',
    remark: '用户',
  },
  {
    id: 'applyId',
    code: 'metadata.applyId',
    name: '发起用户',
    valueType: '用户型',
    remark: '发起用户',
  },
  {
    id: 'status',
    code: 'metadata.status',
    name: '状态',
    valueType: '选择型',
    remark: '状态',
    lookups: [
      {
        id: 'blue',
        text: '待审批',
        value: '1',
      },
      {
        id: 'green',
        text: '已同意',
        value: '100',
      },
      {
        id: 'red',
        text: '已拒绝',
        value: '200',
      },
    ],
  },
  {
    id: 'content',
    code: 'content',
    name: '内容',
    valueType: '描述型',
    remark: '内容',
  },
  {
    id: 'createUser',
    code: 'metadata.createUser',
    name: '申请人',
    valueType: '用户型',
    remark: '申请人',
  },
  {
    id: 'createTime',
    code: 'metadata.createTime',
    name: '申请时间',
    valueType: '时间型',
    remark: '申请时间',
  },
];
