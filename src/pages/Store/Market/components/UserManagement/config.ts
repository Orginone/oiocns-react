import { XMarketRelation } from '@/ts/base/schema';
import type { ColumnsType } from 'antd/es/table';

export const columns: ColumnsType<XMarketRelation> = [
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
    dataIndex: ['target', 'typeName'],
  },
  {
    title: '编码',
    dataIndex: ['target', 'code'],
  },
  {
    title: '名称',
    dataIndex: ['target', 'name'],
  },
  {
    title: '创建时间',
    dataIndex: ['target', 'createTime'],
  },
];
