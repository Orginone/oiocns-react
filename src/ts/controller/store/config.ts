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
    dataIndex: ['_prod', 'id'],
  },
  {
    title: '应用名称',
    dataIndex: ['_prod', 'name'],
  },
  {
    title: '版本号',
    dataIndex: ['_prod', 'version'],
  },
  {
    title: '应用类型',
    dataIndex: ['_prod', 'typeName'],
  },
  {
    title: '应用来源',
    ellipsis: true,
    dataIndex: ['_prod', 'source'],
  },
  {
    title: '创建时间',
    width: 200,
    dataIndex: ['_prod', 'createTime'],
  },
  {
    title: '备注',
    ellipsis: true,
    dataIndex: ['_prod', 'remark'],
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
    dataIndex: ['_product', 'typeName'],
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
    dataIndex: ['_product', 'remark'],
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
