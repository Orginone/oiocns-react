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
