import { ProColumns } from '@ant-design/pro-table';

/**
 * 公益仓--资产、物资
 */
export const AssetColumns: ProColumns[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '资产编号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '物资名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '公益组织',
    key: 'welfareOrg',
  },
  {
    title: '仓储机构',
    key: 'storageAgency',
  },
  {
    title: '型号',
    key: 'spec',
  },
  {
    title: '单价',
    key: 'price',
  },
  {
    title: '货值',
    key: 'mobilephone',
  },
  {
    title: '存放地',
    key: 'address',
  },
  {
    title: '描述',
    key: 'description',
  },
];
