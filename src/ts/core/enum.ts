/** 组织对象类型 */
export enum TargetType {
  Group = '集团',
  Person = '人员',
  Cohort = '群组',
  Company = '单位',
  College = '学院',
  Section = '科室',
  Office = '办事处',
  Hospital = '医院',
  Working = '工作组',
  University = '大学',
  Department = '部门',
  Research = '研究所',
  JobCohort = '工作群',
  Laboratory = '实验室',
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
