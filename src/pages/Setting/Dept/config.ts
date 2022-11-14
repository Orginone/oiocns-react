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
    title: '账号',
    dataIndex: 'caption',
  },
  {
    title: '昵称',
    dataIndex: 'marketId',
  },
  {
    title: '姓名',
    dataIndex: 'typeName',
  },
  {
    title: '手机号',
    dataIndex: 'sellAuth',
  },
];
