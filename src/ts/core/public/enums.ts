/** 用户对象类型 */
export enum TargetType {
  /** 外部用户 */
  'Group' = '组织群',
  'Cohort' = '群组',
  /** 内部用户 */
  'College' = '学院',
  'Department' = '部门',
  'Office' = '办事处',
  'Section' = '科室',
  'Major' = '专业',
  'Working' = '工作组',
  'Research' = '研究所',
  'Laboratory' = '实验室',
  /** 岗位 */
  'Station' = '岗位',
  /** 自归属用户 */
  'Person' = '人员',
  'Company' = '单位',
  'University' = '大学',
  'Hospital' = '医院',
}

/** 分类基础类型 */
export enum SpeciesType {
  /** 类别目录 */
  'Store' = '属性类',
  'Dict' = '字典类',
  'Market' = '流通类',
  'Application' = '应用类',
  /** 类别类目 */
  'Flow' = '流程类',
  'Work' = '事项类',
  'Thing' = '实体类',
  'Data' = '数据类',
}

/** 消息类型 */
export enum MessageType {
  File = '文件',
  Text = '文本',
  Image = '图片',
  Video = '视频',
  Voice = '语音',
  Recall = '撤回',
}

/** 任务状态 */
export enum TaskStatus {
  ApplyStart = 0,
  ApprovalStart = 100,
  RefuseStart = 200,
}

/** 变更操作 */
export enum OperateType {
  'Add' = '新增',
  'Create' = '创建',
  'Remove' = '移除',
  'Update' = '更新',
  'Delete' = '删除',
}

/** 值类型 */
export enum ValueType {
  'Number' = '数值型',
  'Remark' = '描述型',
  'Select' = '选择型',
  'Species' = '分类型',
  'File' = '附件型',
  'Time' = '时间型',
  'Date' = '日期型',
  'Target' = '用户型',
}
