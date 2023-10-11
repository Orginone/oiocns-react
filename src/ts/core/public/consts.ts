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
/** 表单弹框支持的类型 */
export const formModalType = {
  New: 'New',
  Edit: 'Edit',
  View: 'View',
};
/** 用于获取全部的分页模型 */
export const PageAll: PageModel = {
  offset: 0,
  limit: (2 << 15) - 1, //ushort.max
  filter: '',
};

/** 通用状态信息Map */
export const StatusMap = new Map([
  [
    1,
    {
      color: 'blue',
      text: '待处理',
    },
  ],
  [
    100,
    {
      color: 'green',
      text: '已同意',
    },
  ],
  [
    200,
    {
      color: 'red',
      text: '已拒绝',
    },
  ],
  [
    102,
    {
      color: 'green',
      text: '已发货',
    },
  ],
  [
    220,
    {
      color: 'gold',
      text: '买方取消订单',
    },
  ],
  [
    221,
    {
      color: 'volcano',
      text: '卖方取消订单',
    },
  ],
  [
    222,
    {
      color: 'default',
      text: '已退货',
    },
  ],
  [
    240,
    {
      color: 'red',
      text: '已取消',
    },
  ],
]);
