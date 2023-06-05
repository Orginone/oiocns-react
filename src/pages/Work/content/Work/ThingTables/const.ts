import { ReactNode } from 'react';

export const ColTypes: Map<string, string> = new Map([
  ['描述型', 'text'],
  ['用户型', 'select'],
  ['选择型', 'select'],
  ['数值型', 'digit'],
  ['时间型', 'dateTime'],
  ['日期型', 'date'],
  // ['金额', 'money'],
  // ['文本域', 'textarea'],
  // ['周', 'dateWeek'],
  // ['月', 'dateMonth'],
  // ['季度', 'dateQuarter'],
  // ['年份', 'dateYear'],
  // ['日期区间', 'dateRange'],
  // ['日期时间区间', 'dateTimeRange'],
  // ['时间', 'time'],
  // ['时间区间', 'timeRange'],
  // ['树形下拉框', 'treeSelect'],
  // ['多选框', 'checkbox'],
  // ['星级组件', 'rate'],
  // ['单选框', 'radio	'],
  // ['进度条', 'progress'],
  // ['秒格式化', 'second'],
  // ['代码框', 'code'],
  // ['图片', 'image'],
  // ['颜色', 'color'],
]);
export const defaultCol = [
  { id: 'Id', name: '标识', valueType: '描述型' },
  { id: 'Creater', name: '创建者', valueType: '用户型' },
  {
    id: 'Status',
    name: '状态',
    valueType: '选择型',
    valueEnum: {
      正常: { text: '正常', status: 'Success' },
      已销毁: {
        text: '已销毁',
        status: 'Default',
      },
    },
  },
  { id: 'CreateTime', name: '创建时间', valueType: '时间型' },
  { id: 'ModifiedTime', name: '修改时间', valueType: '时间型' },
];
export type toolBtnsType = (
  | 'Add'
  | 'Edit'
  | 'EditMore'
  | 'Select'
  | Omit<ReactNode, 'string'>
)[];
export enum OperateType {
  'Add' = '新增',
  'Edit' = '变更',
  'Select' = '选择',
  'EditMore' = '变更',
}
export const ModalNames = new Map([
  ['Add', '新增'],
  ['Edit', '变更'],
  ['EditMore', '变更'],
  ['Select', '选择'],
]);
export const defaultData: any[] = [
  {
    Id: '624748504',
    title: '活动名称一',
    decs: '这个活动真好玩',
    state: 'open',
    created_at: '1590486176000',
    update_at: '1590486176000',
  },
  {
    Id: '624691229',
    title: '活动名称二',
    decs: '这个活动真好玩',
    state: 'closed',
    created_at: '1590481162000',
    update_at: '1590481162000',
  },
];
export const defaultColumnStateMap: any = {
  ModifiedTime: {
    width: 100,
    show: false,
  },
  CreateTime: {
    show: false,
  },
};
