import { schema } from '@/ts/base';
import { ProColumns } from '@ant-design/pro-table';

export const columns: ProColumns<schema.XTarget>[] = [
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
