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
    title: '类型',
    dataIndex: 'caption',
  },
  {
    title: '编码',
    dataIndex: 'marketId',
  },
  {
    title: '名称',
    dataIndex: 'typeName',
  },
  {
    title: '创建时间',
    dataIndex: 'sellAuth',
  },
];
