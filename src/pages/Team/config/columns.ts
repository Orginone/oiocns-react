import { schema } from '@/ts/base';
import { IProduct } from '@/ts/core';
import { ProColumns } from '@ant-design/pro-table';

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
    render: (_key: any, _record: any, index: number) => {
      return _record.team.name;
    },
  },
  {
    title: '手机号',
    key: 'mobilephone',
    render: (_key: any, _record: any, index: number) => {
      return _record.team.code;
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
    title: '版本号',
    dataIndex: ['prod', 'version'],
    width: 100,
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
    render: (_, record) => {
      return JSON.parse(record.content || '{}').fields;
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    ellipsis: true,
  },
];
