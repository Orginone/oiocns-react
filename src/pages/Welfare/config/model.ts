export type TodoModel = {
  id: string;
  event: string;
  describe: string;
  sponsor: string;
  creatTime: string;
  expireTime: string;
  dataStatus: number;
  handle: null;
  formdata: any;
  url: string;
};
export type AssetModel = {
  id: string;
  code: string;
  name: string;
  spec: string;
  amount: number;
  remark: string;
  price: number;
  getTime: string; //取得日期
  startUseTime: string; //开始使用日期
};
export type DonationFormModel = {
  id: string;
  no: string; //单据编号
  sponsor: string; //发起人/单位
  needStore: string;
  store: string;
  linkman: string;
  phone: string;
  totalValue: number;
  amount: number;
  reason: string;
  remark: string;
  status: string; //草稿已送审已审核已资助
  welfareOrg: string; //公益组织
  donorCode: string; //受捐单位机构代码
  assets: AssetModel[];
};
export type SupportFormModel = {
  id: string;
  no: string; //单据编号
  applicant: string; //受赠人
  needsomething: string; //需求物品
  amount: number; //数量
  useWay: string; //发放方式
  useAddress: string; //发放地址
  expireTime: string; //过期时间
  linkman: string; //联系人
  phone: string; //联系电话
  store: string; //仓储
  reason: string; //原因
  remark: string; //备注
  status: string; //草稿已送审已审核已资助
  assets: AssetModel[];
};
