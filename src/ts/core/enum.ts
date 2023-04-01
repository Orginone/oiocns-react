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

/** 权限类型 */
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

export enum WorkType {
  OrgTodo = '组织待办',
  FriendTodo = '好友待办',
  GroupTodo = '集团待办',
  CompanyTodo = '单位待办',
  CohortTodo = '群组待办',
  OrderTodo = '订单待办',
  StoreTodo = '市场待办',
  PublishTodo = '上架待办',
  JoinStoreTodo = '加入市场待办',
  OrgApply = '组织申请',
  FriendApply = '好友申请',
  CohortApply = '加群申请',
  GroupApply = '集团申请',
  CompanyApply = '单位申请',
  OrderApply = '订单申请',
  StoreApply = '市场申请',
  PublishApply = '上架申请',
  JoinStoreApply = '加入市场申请',
  WorkItem = 'work事',
  WorkTodo = 'todo事',
  WorkDone = 'done事',
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
