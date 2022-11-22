interface DataType {
  key: React.Key;
  name: string;
  size: number;
  desc: string;
  creatTime: string;
}
import type { ProColumns } from '@ant-design/pro-components';

export const data: DataType[] = [
  {
    key: '1',
    name: '测试数据1',
    size: 32,
    desc: 'New York No. 1 Lake Park',
    creatTime: '2022-12-12',
  },
  {
    key: '2',
    name: '测试数据2',
    size: 42,
    desc: 'London No. 1 Lake Park',
    creatTime: '2022-12-12',
  },
  {
    key: '3',
    name: '测试数据3',
    size: 32,
    desc: 'Sidney No. 1 Lake Park',
    creatTime: '2022-12-12',
  },
  {
    key: '4',
    name: '测试数据4',
    size: 99,
    desc: 'Sidney No. 1 Lake Park',
    creatTime: '2022-12-12',
  },
  {
    key: '5',
    name: '测试数据5',
    size: 955,
    desc: 'Sidney No. 1 Lake Park',
    creatTime: '2022-12-12',
  },
  {
    key: '6',
    name: '测试数据6',
    size: 66,
    desc: 'Sidney No. 1 Lake Park',
    creatTime: '2022-12-12',
  },
];
export const columns: ProColumns<any>[] = [
  {
    title: '序号',
    fixed: 'left',
    dataIndex: 'index',
    width: 50,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '应用名称',
    dataIndex: 'caption',
  },
  {
    title: '来源',
    dataIndex: 'marketId',
  },
  {
    title: '应用类型',
    dataIndex: 'typeName',
  },
  {
    title: '售卖权限',
    dataIndex: 'sellAuth',
  },
  {
    title: '价格',
    dataIndex: 'price',
  },

  {
    title: '创建时间',
    dataIndex: 'createTime',
  },

  {
    title: '备注',
    ellipsis: true,
    dataIndex: 'remark',
  },
];
export const certificateColumn: ProColumns<any>[] = [
  {
    title: '序号',
    fixed: 'left',
    dataIndex: 'index',
    width: 50,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '卡包名称',
    dataIndex: 'cardName',
  },
  {
    title: '选择网络',
    dataIndex: 'network',
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
  {
    title: '加入时间',
    dataIndex: 'joinDate',
  },
];
export const cohortColumn: ProColumns<any>[] = [
  {
    title: '序号',
    fixed: 'left',
    dataIndex: 'index',
    width: 50,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '群组名称',
    dataIndex: ['target','name'],
  },
  {
    title: '群组编号',
    dataIndex: ['target','code'],
  },
  {
    title: '群组简介',
    dataIndex: ['target','team','remark'],
  },
  {
    title: '归属',
    dataIndex: ['target','belongId'],
  },
];
