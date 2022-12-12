// 类型 枚举
export enum dataType {
  'STRING' = 'STRING',
  'NUMERIC' = 'NUMERIC',
  'DICT' = 'DICT',
  'DATE' = 'DATE',
}

export const dataTypeTitleMaps: Record<dataType, string> = {
  [dataType.STRING]: '字符串',
  [dataType.NUMERIC]: '数字',
  [dataType.DICT]: '枚举',
  [dataType.DATE]: '日期',
};

export const optionType = [
  { label: dataTypeTitleMaps[dataType.STRING], value: dataType.STRING },
  { label: dataTypeTitleMaps[dataType.NUMERIC], value: dataType.NUMERIC },
  { label: dataTypeTitleMaps[dataType.DICT], value: dataType.DICT },
  { label: dataTypeTitleMaps[dataType.DATE], value: dataType.DATE },
];

export enum AddNodeType {
  'APPROVAL' = 'APPROVAL',
  'CC' = 'CC',
  'CONDITION' = 'CONDITION',
  'ROOT' = 'ROOT',
  'CONCURRENTS' = 'CONCURRENTS',
}

export const AddNodeTypeAndNameMaps: Record<AddNodeType, string> = {
  [AddNodeType.ROOT]: '根节点',
  [AddNodeType.APPROVAL]: '审批节点',
  [AddNodeType.CC]: '抄送节点',
  [AddNodeType.CONDITION]: '条件节点',
  [AddNodeType.CONCURRENTS]: '同时审核节点',
};

export type conditionDataType = {
  name: string;
  fields: string;
  labels: everyCondition[];
};

type everyCondition = {
  label: string;
  value: string;
  type: string;
};
