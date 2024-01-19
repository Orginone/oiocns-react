import React from 'react';
import { Typography } from 'antd';
import { model, schema } from '@/ts/base';
import { ProColumns } from '@ant-design/pro-components';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

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
      options: {
        fixed: true,
        visible: false,
      },
    },
    {
      id: 'name',
      code: 'name',
      name: '名称',
      valueType: '描述型',
      remark: '描述信息',
      options: {
        visible: false,
      },
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
