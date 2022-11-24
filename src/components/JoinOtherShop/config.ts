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
    title: '商店名称',
    dataIndex: 'caption',
  },
  {
    title: '商店编码',
    dataIndex: 'marketId',
  },
  {
    title: '商店简介',
    dataIndex: 'typeName',
  },
  {
    title: '商店归属',
    dataIndex: 'sellAuth',
  },
  {
    title: '商店创建',
    dataIndex: 'sellAuth',
  },
];
