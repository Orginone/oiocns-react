import { PageModel } from '../../base/model';
import { TargetType, ValueType } from './enums';

/** 资产共享云模块权限Id */
export const orgAuth = {
  // 超管权限
  SuperAuthId: '361356410044420096',
  // 关系管理权限
  RelationAuthId: '361356410623234048',
  // 物，标准等管理权限
  ThingAuthId: '361356410698731520',
  // 办事管理权限
  WorkAuthId: '361356410774228992',
};
/** 数据存储集合名称 */
export const storeCollName = {
  WorkTask: 'work-task',
  WorkInstance: 'work-instances',
  ChatMessage: 'chat-message',
};
/** 支持的单位类型 */
export const companyTypes = [
  TargetType.Company,
  TargetType.Hospital,
  TargetType.University,
];
/** 支持的单位类型 */
export const departmentTypes = [
  TargetType.College,
  TargetType.Department,
  TargetType.Office,
  TargetType.Section,
  TargetType.Major,
  TargetType.Working,
  TargetType.Research,
  TargetType.Laboratory,
];
/** 支持的值类型 */
export const valueTypes = [
  ValueType.Number,
  ValueType.Remark,
  ValueType.Select,
  ValueType.Species,
  ValueType.Time,
  ValueType.Target,
  ValueType.Date,
  ValueType.File,
];
/** 用于获取全部的分页模型 */
export const PageAll: PageModel = {
  offset: 0,
  limit: (2 << 15) - 1, //ushort.max
  filter: '',
};
