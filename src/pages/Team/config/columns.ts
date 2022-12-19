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
  { title: '单位名称', dataIndex: 'name' },
  {
    title: '社会统一信用代码',
    dataIndex: ['target', 'code'],
  },
  {
    title: '单位简介',
    dataIndex: ['target', 'team', 'remark'],
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
