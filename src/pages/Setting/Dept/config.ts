import { schema } from '@/ts/base';
import { TargetType } from '@/ts/core';
import { ProColumns } from '@ant-design/pro-table';

const personColumns: ProColumns<schema.XTarget>[] = [
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

const companyColumns: ProColumns<schema.XTarget>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '统一信用代码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '简称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '全称',
    key: 'teamName',
    dataIndex: ['team', 'name'],
  },
  {
    title: '代号',
    key: 'teamCode',
    dataIndex: ['team', 'code'],
  },
  {
    title: '简介',
    key: 'teamRemark',
    dataIndex: ['team', 'remark'],
    ellipsis: {
      showTitle: true,
    },
  },
];

export const getColumns = (typeName: TargetType) => {
  if (typeName === TargetType.Group) {
    return companyColumns;
  }
  return personColumns;
};
