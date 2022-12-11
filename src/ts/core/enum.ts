/* eslint-disable no-unused-vars */

/** 组织对象类型 */
export enum TargetType {
  Group = '集团',
  Person = '人员',
  Cohort = '群组',
  Company = '单位',
  College = '学院',
  Major = '专业',
  Section = '科室',
  Office = '办事处',
  Hospital = '医院',
  Working = '工作组',
  University = '大学',
  Department = '部门',
  Research = '研究所',
  JobCohort = '工作群',
  Laboratory = '实验室',
  Station = '岗位',
}

/** 消息类型 */
export enum MessageType {
  Text = '文本',
  Image = '图片',
  Video = '视频',
  Voice = '语音',
  Recall = '撤回',
  Readed = '已读',
}

/** 职权类型 */
export enum AuthorityType {
  SuperAdmin = 'super-admin',
  RelationAdmin = 'relation-admin',
  ThingAdmin = 'thing-admin',
  MarketAdmin = 'market-admin',
  ApplicationAdmin = 'application-admin',
}

/** 通用状态 */
export enum CommonStatus {
  ApplyStartStatus = 1,
  ApproveStartStatus = 100,
  RejectStartStatus = 200,
}
/** 域类型 */
export enum DomainTypes {
  User = 'user',
  Company = 'company',
  All = 'all',
}

export enum ProductType {
  WebApp = 'web应用',
}

/**订单状态 */
export enum OrderStatus {
  Deliver = 102,
  BuyerCancel = 220,
  SellerCancel = 221,
  RejectOrder = 222,
}

export enum TodoType {
  FrientTodo = '好友申请',
  OrgTodo = '组织审批',
  OrderTodo = '订单管理',
  MarketTodo = '市场管理',
  ApplicationTodo = '应用待办',
}

export const companyTypes = [
  TargetType.Company,
  TargetType.Hospital,
  TargetType.University,
];

export const departmentTypes = [
  TargetType.Office,
  TargetType.Section,
  TargetType.Research,
  TargetType.Laboratory,
  TargetType.JobCohort,
  TargetType.Department,
];

export const subDepartmentTypes = [
  TargetType.Office,
  TargetType.Section,
  TargetType.Laboratory,
  TargetType.JobCohort,
  TargetType.Research,
];
