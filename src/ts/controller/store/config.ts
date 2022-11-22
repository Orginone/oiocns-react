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
    dataIndex: 'icon',
  },
  {
    title: '应用名称',
    dataIndex: 'name',
  },
  {
    title: '版本号',
    dataIndex: 'version',
  },
  {
    title: '应用类型',
    dataIndex: 'typeName',
  },
  {
    title: '应用来源',
    ellipsis: true,
    dataIndex: 'belongId',
  },
  {
    title: '创建时间',
    width: 200,
    dataIndex: 'createTime',
  },
  {
    title: '备注',
    ellipsis: true,
    dataIndex: 'remark',
  },
];
