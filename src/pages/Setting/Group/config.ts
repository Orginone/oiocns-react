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
    title: '简称',
    dataIndex: 'caption',
  },
  {
    title: '信用代码',
    dataIndex: 'marketId',
  },
  {
    title: '全称',
    dataIndex: 'typeName',
  },
  {
    title: '代码',
    dataIndex: 'sellAuth',
  },
  {
    title: '简介',
    dataIndex: 'sellAuth',
  },
];
