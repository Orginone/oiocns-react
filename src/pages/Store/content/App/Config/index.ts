/* 获取我的应用列表 表头 */
export const myColumns: any = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 50,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '应用图标',
    dataIndex: ['prod', 'photo'],
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
    width: 200,
    valueType: 'dateTime',
    dataIndex: ['prod', 'createTime'],
  },
  {
    title: '备注',
    ellipsis: true,
    dataIndex: ['prod', 'remark'],
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
