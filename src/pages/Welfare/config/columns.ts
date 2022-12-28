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
    dataIndex: 'welfareOrg',
    key: 'welfareOrg',
  },
  {
    title: '仓储机构',
    dataIndex: 'storageAgency',
    key: 'storageAgency',
  },
  {
    title: '型号',
    dataIndex: 'spec',
    key: 'spec',
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '货值',
    dataIndex: 'mobilephone',
    key: 'mobilephone',
  },
  {
    title: '存放地',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
];

//捐赠单-物资列表
export const DonationFormAssetColumns: ProColumns[] = [
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
    title: '资产名称',
    dataIndex: 'name',
    key: 'name',
  },

  {
    title: '型号',
    dataIndex: 'spec',
    key: 'spec',
  },
  {
    title: '申请数量',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 400,
  },

];

//发起捐赠-选择物资
export const DoDonationAssetColumns: ProColumns[] = [
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
    title: '资产名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '申请数量',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: '存放地点',
    dataIndex: 'storeAddress',
    key: 'storeAddress',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 400,
  },

];


