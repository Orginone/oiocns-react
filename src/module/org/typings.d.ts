
export type ApprovalReq = {
  id: number;
  status: number;
};

export type AppTokenReq = {
  appId: number;
  funcAuthList: FuncAuthReq[];
};

export type AuthorityReq = {
  id: number;
  name: string;
  code: string;
  parentId: number;
  public: boolean;
  remark: string;
  belongId: number;
};

export type FuncAuthReq = {
  funcName: string;
  isGrant: boolean;
  isPermanent: boolean;
};

export type GiveReq = {
  id: number;
  targetIds: number[];
};

export type IdentityReq = {
  id: number;
  name: string;
  code: string;
  remark: string;
  belongId: number;
  authId: number;
};

export type Login = {
  account: string;
  password: string;
};

export type RegisterReq = {
  nickName: string;
  name: string;
  phone: string;
  account: string;
  password: string;
  motto: string;
};

export type ResetPwd = {
  account: string;
  password: string;
  privateKey: string;
};

export type SubTargetReq = {
  id: number;
  name: string;
  code: string;
  belongId: number;
  teamName?: string;
  teamCode?: string;
  teamRemark?: string;
  parentId: number;
};

export type TargetReq = {
  id: number;
  name: string;
  code: string;
  belongId: number;
  teamName?: string;
  teamCode?: string;
  teamRemark?: string;
};

