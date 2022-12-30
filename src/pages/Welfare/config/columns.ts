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

/**
 * 公益仓--平台：公益组织加入集团
 */
export const supervisionWelfareOrgColumns: ProColumns[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '组织名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '所在领域',
    dataIndex: 'businessAreas',
    key: 'businessAreas',
  },
  {
    title: '注册类型',
    dataIndex: 'registerType',
    key: 'registerType',
  },
  {
    title: '统一社会征信代码',
    dataIndex: 'code',
    key: 'code',
    width: 180,
  },
  {
    title: '登记管理机关',
    dataIndex: 'registerManageOrgan',
    key: 'registerManageOrgan',
  },
  {
    title: '业务管理机关',
    dataIndex: 'businessManageOrgan',
    key: 'businessManageOrgan',
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
    valueType: 'date',
    key: 'registerTime',
  },
  {
    title: '成立时间',
    dataIndex: 'establishTime',
    valueType: 'date',
    key: 'establishTime',
  },
  {
    title: '联系人',
    dataIndex: 'contactPerson',
    key: 'contactPerson',
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    key: 'phone',
  },
];

/**
 * 公益仓--平台：创建商城
 */
export const supervisionCreateMallColumns: ProColumns[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '商城名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '主营类型',
    dataIndex: 'mainBusiness',
    key: 'mainBusiness',
  },
  {
    title: '次营类型',
    dataIndex: 'minorBusiness',
    key: 'minorBusiness',
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
    title: '联系人',
    dataIndex: 'contactPerson',
    key: 'contactPerson',
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
    valueType: 'date',
    key: 'registerTime',
  },
];
/**
 * 公益仓--平台：仓储机构接入
 */
export const supervisionStorageAgencyColumns: ProColumns[] = [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '仓储名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '统一社会征信代码',
    dataIndex: 'code',
    key: 'code',
    width: 180,
  },
  {
    title: '所在地区',
    dataIndex: 'provincialCity',
    key: 'provincialCity',
  },
  {
    title: '面积㎡',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '库存类型',
    dataIndex: 'storeType',
    key: 'storeType',
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
    valueType: 'date',
    key: 'registerTime',
  },
  {
    title: '成立时间',
    dataIndex: 'establishTime',
    valueType: 'date',
    key: 'establishTime',
  },
  {
    title: '联系人',
    dataIndex: 'contactPerson',
    key: 'contactPerson',
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '仓储地址',
    dataIndex: 'address',
    key: 'address',
  },
];
