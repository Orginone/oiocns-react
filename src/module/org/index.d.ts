/**
 *
 * Organization 相关类型
 *
 * ===========================================================
 */


/**
 * 组织分类
 */
 export enum OrgType {
  /* 单位、公司 */
  Company = '单位',
  /* 集团 */
  Group = '集团',
  /* 部门 */
  Dept = '部门',
  /* 工作组 */
  WorkGroup = '工作组',
  /* 群组 */
  Cohort = '群组',
  /* 职权、角色 */
  Authority = '角色',
  /* 身份 */
  Identity = '身份',
  /* 人员、用户 */
  Person = '人员',
}

/**
 * 团队
 */
export interface Team {
  id: string;
  name: string;
  code: string;
  targetId: string;
  remark: string;
  status: number;
  createUser: string;
  updateUser: string;
  version: string;
  createTime: string;
  updateTime: string;
}

/**
 * 组织
 */
export interface Org {
  id: string;
  name: string;
  code: string;
  typeName: string;
  thingId: string;
  status: number;
  createUser: string;
  updateUser: string;
  version: string;
  createTime: string;
  updateTime: string;
  team: Team;
}

export interface UserDept {
  id: React.Key;
  order: number;
  deptId: string;
  deptName: string;
  deptDesc: string;
  createCompany: string;
  createCompanyId: number;
  joinDate: string;

}

/**
 * 我的申请接口返回内容
 */
export interface AllApply {
  id: React.Key;
  targetId: string;
  teamId: string;
  status: string;
  createUser: string;
  updateUser: string;
  version: string;
  createTime: string;
  updateTime: string;
  team: Team;
  target: User;

}

/**
 * 用户
 */
export interface User extends Person {
  identitys: Identity[]
}

/**
 * 单位、公司
 */
export interface Company extends Org {
  typeName: OrgType.Company;
  // 选中的样式
  selectStyle: string;
}

/**
 * 集团
 */
export interface Group extends Org {
  typeName: OrgType.Group;
}

/**
 * 部门
 */
export interface Dept extends Org {
  typeName: OrgType.Dept;
}

/**
 * 工作组
 */
 export interface WorkGroup extends Org {
  typeName: OrgType.WorkGroup;
}


/**
 * 群组
 */
export interface Cohort extends Org {
  typeName: OrgType.Cohort;
  belongId: string;
  selectStyle: string;

}

/**
 * 职权、角色
 */
export interface Authority extends Org {
  typeName: OrgType.Authority;
  public: boolean;
}

/**
 * 身份
 */
export interface Identity extends Org {
  typeName: OrgType.Identity;
  authId: string;
  belongId: string;
}

/**
 * 人员
 */
export interface Person extends Org {
  typeName: OrgType.Person;
}

/**
 * 组织树(单位或工作组)
 */
export interface OrgTree extends Org {
  children?: OrgTree[]
}

/**
 * 工作空间类型
 */
 export enum WorkSpaceType {
  /* 单位、公司 */
  Company = '单位',
  /* 个人 */
  Person = '个人',
}

/**
 * 工作空间
 */
export interface WorkSpace{
  id: string;
  name: string;
  type: WorkSpaceType.Company | WorkSpaceType.Person
}