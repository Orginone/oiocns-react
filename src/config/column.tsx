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

/** 物的默认列信息 */
export const ThingColumns = (hideColumns?: string[]) => [
  {
    id: 'Id',
    dataField: 'Id',
    visible: !hideColumns?.includes('Id'),
    name: '唯一标识',
    valueType: '描述型',
    remark: '由系统生成的唯一标记,无实义.',
  },
  {
    id: 'Creater',
    dataField: 'Creater',
    visible: !hideColumns?.includes('Creater'),
    name: '创建人',
    valueType: '用户型',
    remark: '创建标识的人',
  },
  {
    id: 'Status',
    dataField: 'Status',
    visible: !hideColumns?.includes('Status'),
    name: '状态',
    valueType: '选择型',
    remark: '数据状态',
    lookupSource: [
      {
        text: '正常',
        value: '正常',
      },
      {
        text: '已销毁',
        value: '已销毁',
      },
    ],
  },
  {
    id: 'CreateTime',
    dataField: 'CreateTime',
    visible: !hideColumns?.includes('CreateTime'),
    name: '创建时间',
    valueType: '时间型',
    remark: '创建标识的时间',
  },
  {
    id: 'ModifiedTime',
    dataField: 'ModifiedTime',
    visible: !hideColumns?.includes('ModifiedTime'),
    name: '修改时间',
    valueType: '时间型',
    remark: '最新修改时间',
  },
];
