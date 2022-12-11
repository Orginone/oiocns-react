import type { ColumnsType } from 'antd/es/table';
export const columns: ColumnsType<any> = [
  {
    title: '序号',
    fixed: 'left',
    width: 50,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '人员名称',
    dataIndex: 'name',
  },
  {
    title: '姓名',
    dataIndex: ['team', 'name'],
  },
  {
    title: '手机号',
    dataIndex: ['team', 'code'],
  },
];

export const indentitycolumns: ColumnsType<any> = [
  {
    title: '序号',
    fixed: 'left',
    width: 60,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
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
