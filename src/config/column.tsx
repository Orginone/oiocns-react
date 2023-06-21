import { ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Typography } from 'antd';
import { schema } from '@/ts/base';
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
