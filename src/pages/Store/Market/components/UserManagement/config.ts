import { XMarketRelation } from '@/ts/base/schema';
import { ProColumns } from '@ant-design/pro-components';

export const columns: ProColumns<XMarketRelation>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
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
