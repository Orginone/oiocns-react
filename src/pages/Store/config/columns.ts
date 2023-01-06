import { schema } from '@/ts/base';
import { IProduct } from '@/ts/core';
import { ProColumns } from '@ant-design/pro-table';
import { Tag } from 'antd';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import React from 'react';

export const PersonColumns: ProColumns<schema.XTarget>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '账号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '昵称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '姓名',
    key: 'realName',
    render: (_key: any, _record: any, _: number) => {
      return _record.team.name;
    },
  },
  {
    title: '手机号',
    key: 'mobilephone',
    render: (_key: any, _record: any, _: number) => {
      return _record.team.code;
    },
  },
  {
    title: '签名',
    key: 'remark',
    render: (_key: any, _record: any, _: number) => {
      return _record.team.remark;
    },
  },
];

export const CompanyColumn: ProColumns<schema.XTarget>[] = [
  { title: '序号', valueType: 'index', width: 50 },
  { title: '单位简称', dataIndex: 'name' },
  {
    title: '社会统一信用代码',
    dataIndex: 'code',
  },
  { title: '单位全称', dataIndex: ['team', 'name'] },
  { title: '单位代码', dataIndex: ['team', 'code'] },
  {
    title: '单位简介',
    ellipsis: true,
    dataIndex: ['team', 'remark'],
  },
];

export const GroupColumn: ProColumns<schema.XTarget>[] = [
  { title: '序号', valueType: 'index', width: 50 },
  { title: '集团简称', dataIndex: 'name' },
  { title: '集团编码', dataIndex: 'code' },
  { title: '集团全称', dataIndex: ['team', 'name'] },
  { title: '集团代码', dataIndex: ['team', 'code'] },
  {
    title: '集团简介',
    ellipsis: true,
    dataIndex: ['team', 'remark'],
  },
];

export const CohortColumn: ProColumns<schema.XTarget>[] = [
  {
    title: '序号',
    fixed: 'left',
    dataIndex: 'index',
    width: 50,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '群组名称',
    dataIndex: ['target', 'name'],
  },
  {
    title: '群组编号',
    dataIndex: ['target', 'code'],
  },
  {
    title: '群组简介',
    dataIndex: ['target', 'team', 'remark'],
  },
  {
    title: '归属',
    dataIndex: ['target', 'belongId'],
  },
];

export const ApplicationColumns: ProColumns<IProduct>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '应用图标',
    dataIndex: ['prod', 'belongId'],
  },
  {
    title: '应用名称',
    dataIndex: ['prod', 'name'],
  },
  {
    title: '应用类型',
    dataIndex: ['prod', 'typeName'],
  },
  {
    title: '应用来源',
    ellipsis: true,
    dataIndex: ['prod', 'source'],
  },
  {
    title: '创建时间',
    valueType: 'dateTime',
    dataIndex: ['prod', 'createTime'],
  },
  {
    title: '备注',
    ellipsis: true,
    dataIndex: ['prod', 'remark'],
  },
];

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
    title: '身份名称',
    dataIndex: 'name',
  },
  {
    title: '职权',
    dataIndex: 'name',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const AttributeColumns: ProColumns<schema.XAttribute>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '特性编号',
    dataIndex: 'code',
    key: 'code',
    width: 150,
  },
  {
    title: '特性名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '特性类型',
    dataIndex: 'valueType',
    key: 'valueType',
    width: 150,
  },
  {
    title: '特性分类',
    dataIndex: 'speciesId',
    key: 'speciesId',
    width: 150,
  },
  {
    title: '共享组织',
    dataIndex: 'belongId',
    key: 'belongId',
    width: 200,
  },
  {
    title: '特性定义',
    dataIndex: 'remark',
    ellipsis: true,
    key: 'remark',
  },
];

export const FlowColumn: ProColumns<schema.XFlowDefine>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '流程名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
    ellipsis: true,
  },
  {
    title: '备注',
    ellipsis: true,
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    ellipsis: true,
  },
];
export const marketColumns: any = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 50,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '应用名称',
    dataIndex: 'caption',
  },
  {
    title: '来源',
    dataIndex: 'marketId',
  },
  {
    title: '应用类型',
    dataIndex: ['product', 'typeName'],
  },
  {
    title: '售卖权限',
    dataIndex: 'sellAuth',
  },
  {
    title: '价格',
    dataIndex: 'price',
    render: (_text: string, record: any) => {
      return record?.price === undefined ? '免费' : record?.price;
    },
  },

  {
    title: '创建时间',
    dataIndex: 'createTime',
  },

  {
    title: '备注',
    ellipsis: true,
    dataIndex: ['product', 'remark'],
  },
];

export const shareInfoColumns: any = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 50,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
];
