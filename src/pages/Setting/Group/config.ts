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
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '信用代码',
    dataIndex: 'code',
  },
  {
    title: '代码',
    key: 'sellAuth',
    render: (_key: any, _record: any, index: number) => {
      return _record.team?.code;
    },
  },
  {
    title: '简介',
    key: 'remark',
    render: (_key: any, _record: any, index: number) => {
      return _record.team?.remark;
    },
  },
];
