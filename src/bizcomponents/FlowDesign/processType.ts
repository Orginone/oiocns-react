import { WorkNodeModel } from '@/ts/base/model';

// 类型 枚举
export enum dataType {
  'STRING' = 'STRING',
  'NUMERIC' = 'NUMERIC',
  'DICT' = 'DICT',
  'DATE' = 'DATE',
  'BELONG' = 'BELONG',
}

export enum AddNodeType {
  'CC' = '抄送',
  'ROOT' = '起始',
  'EMPTY' = '空节点',
  'APPROVAL' = '审批',
  'CONDITION' = '条件',
  'CONCURRENTS' = '全部',
  'ORGANIZATIONA' = '组织',
  'CHILDWORK' = '子流程',
}

export type FieldCondition = {
  label: string;
  value: string;
  type: dataType;
  dict?: {
    label: string;
    value: string;
  }[];
};

export type conditiondType = {
  pos: number;
  paramKey: string;
  paramLabel: string;
  key: string;
  label: string;
  type: dataType;
  val: string | undefined;
  valLabel?: string;
  display: string;
  dict?: any[];
};

export type NodeModel = {
  task?: any;
  nodeId: string;
  parentId: string;
  type: AddNodeType;
  conditions: conditiondType[];
  branches: NodeModel[];
  children: NodeModel | undefined;
} & WorkNodeModel;

export const getConditionKeys: (type: string) => any[] = (type: string) => {
  var keys: any[] = [];
  switch (type) {
    case 'NUMERIC':
      keys = [
        { value: 'EQ', label: '=' },
        { value: 'GT', label: '>' },
        { value: 'GTE', label: '≥' },
        { value: 'LT', label: '<' },
        { value: 'LTE', label: '≤' },
        { value: 'NEQ', label: '≠' },
      ];
      break;
    case 'STRING':
    case 'DICT':
      keys = [
        { value: 'EQ', label: '=' },
        { value: 'NEQ', label: '≠' },
      ];
      break;
  }
  return keys;
};
