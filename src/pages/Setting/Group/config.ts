import { schema } from '@/ts/base';
import { ProColumns } from '@ant-design/pro-components';

export const columns: ProColumns<schema.XTarget>[] = [
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
