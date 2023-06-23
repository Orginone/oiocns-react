import { create } from 'zustand';
import { WorkNodeModel } from '@/ts/base/model';
import { getUuid } from '@/utils/tools';

export const useAppwfConfig = create((setItem) => ({
  nodeMap: new Map(),
  addNodeMap: (data: any) => {
    return setItem((prev: any) => {
      return { nodeMap: prev.nodeMap.set(data.code, data.node) };
    });
  },
}));

export const getNodeCode = () => {
  return `node_${getUuid()}`;
};

//判断是否为主要业务节点
export const isPrimaryNode = (node: any) => {
  return [
    AddNodeType.ROOT,
    AddNodeType.APPROVAL,
    AddNodeType.CHILDWORK,
    AddNodeType.CC,
  ].includes(node.type);
};

export const isBranchNode = (type: AddNodeType) => {
  return [
    AddNodeType.CONDITION,
    AddNodeType.CONCURRENTS,
    AddNodeType.ORGANIZATIONA,
  ].includes(type);
};

export const getConditionNodeName = (node: any) => {
  switch (node.type) {
    case AddNodeType.CONDITION:
      return '条件分支';
    case AddNodeType.CONCURRENTS:
      return '并行分支';
    case AddNodeType.ORGANIZATIONA:
      return '组织分支';
    default:
      return '';
  }
};

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
  parentCode: string;
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
