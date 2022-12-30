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
    title: '余量',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
  },
  // {
  //   title: '货值',
  //   dataIndex: 'totalValue',
  //   key: 'totalValue',
  // },
  // {
  //   title: '存放地',
  //   dataIndex: 'address',
  //   key: 'address',
  // },
  // {
  //   title: '描述',
  //   dataIndex: 'description',
  //   key: 'description',
  // },
];
/**
 * 公益仓--仓库资产、物资
 */
export const AssetStoreColumns: ProColumns[] = [
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
    title: '型号',
    dataIndex: 'spec',
    key: 'spec',
  },
  {
    title: '余量',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '货值',
    dataIndex: 'totalValue',
    key: 'totalValue',
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

//公益发起捐赠列表(已审核)
export const dodonationListColumns_Processed: ProColumns[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '单据编号',
    dataIndex: 'no',
    key: 'no',
  },
  {
    title: '物资名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '受捐人/单位',
    dataIndex: 'donors',
    key: 'donors',
  },
  {
    title: '涉及总数量',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: '联系人',
    dataIndex: 'linkman',
    key: 'linkman',
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '审核状态',
    dataIndex: 'status',
    key: 'status',
  },

];
//公益发起捐赠列表(已资助)
export const dodonationListColumns_Supported: ProColumns[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '单据编号',
    dataIndex: 'no',
    key: 'no',
  },
  {
    title: '物资名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '受捐人/单位',
    dataIndex: 'donors',
    key: 'donors',
  },
  {
    title: '涉及总数量',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: '联系人',
    dataIndex: 'linkman',
    key: 'linkman',
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '物资状态',
    dataIndex: 'assetStatus',
    key: 'assetStatus',
  },

];

