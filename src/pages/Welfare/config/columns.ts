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

//公益捐赠审批单
export const donationfromListColumns: ProColumns[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '事项',
    dataIndex: 'event',
    key: 'event',
  },
  {
    title: '描述',
    dataIndex: 'describe',
    key: 'describe',
  },
  {
    title: '发起人/单位',
    dataIndex: 'sponsor',
    key: 'sponsor',
  },
  {
    title: '提交时间',
    dataIndex: 'creatTime',
    key: 'creatTime',
  },
  {
    title: '过期时间',
    dataIndex: 'expireTime',
    key: 'expireTime',
    width: 400,
  },
  {
    title: '处理结果',
    dataIndex: 'handle',
    key: 'handle',
  },

];


