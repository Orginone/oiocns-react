import { IProduct } from '@/ts/core';
import { ProColumns } from '@ant-design/pro-table';
import userCtrl from '@/ts/controller/setting';
import thingCtrl from '@/ts/controller/thing';
import { XFlowDefine } from '@/ts/base/schema';

export const ApplicationColumns: ProColumns<IProduct>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '应用图标',
    dataIndex: ['prod', 'belongId'],
  },
  {
    title: '应用名称',
    dataIndex: ['prod', 'name'],
  },
  {
    title: '应用类型',
    dataIndex: ['prod', 'typeName'],
  },
  {
    title: '应用来源',
    ellipsis: true,
    dataIndex: ['prod', 'source'],
  },
  {
    title: '创建时间',
    valueType: 'dateTime',
    dataIndex: ['prod', 'createTime'],
  },
  {
    title: '备注',
    ellipsis: true,
    dataIndex: ['prod', 'remark'],
  },
];

export const InnerApplicationColumns: ProColumns<XFlowDefine>[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '应用名称',
    dataIndex: ['name'],
  },
  {
    title: '应用编号',
    dataIndex: ['code'],
  },
  {
    title: '需求主体',
    dataIndex: ['belongId'],
    render: (_, record) => {
      return userCtrl.findTeamInfoById(record.belongId)?.name;
    },
  },
  {
    title: '所属分类',
    ellipsis: true,
    dataIndex: ['speciesId'],
    render: (_, record) => {
      return thingCtrl.species.find((a) => a.id == record.speciesId)?.name ?? '未知';
    },
  },
  {
    title: '业务类型',
    ellipsis: true,
    dataIndex: ['isCreate'],
    render: (_, record) => {
      return record.isCreate ? '创建类' : '附加类';
    },
  },
  {
    title: '创建时间',
    valueType: 'dateTime',
    dataIndex: ['createTime'],
  },
  {
    title: '备注',
    ellipsis: true,
    dataIndex: ['remark'],
  },
];

export const marketColumns: any = [
  {
    title: '序号',
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
    dataIndex: ['product', 'typeName'],
  },
  {
    title: '售卖权限',
    dataIndex: 'sellAuth',
  },
  {
    title: '价格',
    dataIndex: 'price',
    render: (_text: string, record: any) => {
      return record?.price === undefined ? '免费' : record?.price;
    },
  },

  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '备注',
    ellipsis: true,
    dataIndex: ['product', 'remark'],
  },
];

export const shareInfoColumns: any = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 50,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
];
