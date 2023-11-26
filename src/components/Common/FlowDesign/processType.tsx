import { WorkNodeModel } from '@/ts/base/model';
import message from '@/utils/message';
import { getUuid } from '@/utils/tools';

export const getNodeCode = () => {
  return `node_${getUuid()}`;
};

export const isBranchNode = (type: AddNodeType) => {
  return [
    AddNodeType.CONDITION,
    AddNodeType.CONCURRENTS,
    AddNodeType.ORGANIZATIONA,
  ].includes(type);
};

export const getNodeName = (type: AddNodeType) => {
  switch (type) {
    case AddNodeType.APPROVAL:
      return '审批对象';
    case AddNodeType.CC:
      return '抄送对象';
    case AddNodeType.CHILDWORK:
      return '其他办事';
    case AddNodeType.CONDITION:
      return '条件分支';
    case AddNodeType.CONCURRENTS:
      return '并行分支';
    case AddNodeType.ORGANIZATIONA:
      return '组织分支';
    case AddNodeType.GATEWAY:
      return '分流网关';
    default:
      return '';
  }
};

export const getNewBranchNode = (node: NodeModel, index: number, conditions?: any) => {
  return {
    code: getNodeCode(),
    parentCode: node.code,
    name: getNodeName(node.type) + index,
    conditions: conditions || [],
    type: node.type,
    children: {},
  };
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
  'GATEWAY' = '网关',
  'END' = '结束',
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

export const loadResource = (resource: any, parentCode: string): any => {
  let obj: any;
  if (resource) {
    let code = getNodeCode();
    obj = {
      id: resource.id,
      code: resource.code,
      parentCode: parentCode,
      type: resource.type as AddNodeType,
      name: resource.name,
      destId: resource.destId,
      destType: resource.destType,
      destName: resource.destName,
      num: resource.num || 1,
      forms: resource.forms,
      primaryForms: resource.primaryForms,
      detailForms: resource.detailForms,
      belongId: resource.belongId,
      branches:
        resource.branches?.map((item: any) => {
          return loadBranch(item, resource.code, resource.type);
        }) || [],
      children: isBranchNode(resource.type)
        ? {
            code: code,
            parentCode: parentCode,
            type: AddNodeType.EMPTY,
            children: loadResource(resource.children, code),
          }
        : loadResource(resource.children, resource.code),
    };
    return obj;
  }
};

const loadBranch = (resource: any, parentCode: string, parentType: string) => {
  if (resource) {
    let code = getNodeCode();
    return {
      id: getNodeCode(),
      code: code,
      parentCode: parentCode,
      name: resource.name,
      type: parentType as AddNodeType,
      conditions: resource.conditions
        ? resource.conditions.map((item: any, index: number) => {
            return {
              paramKey: item.paramKey,
              key: item.key,
              type: item.type,
              val: item.val != undefined ? String(item.val) : undefined,
              pos: index,
              display: item.display,
            };
          })
        : [],
      children: loadResource(resource.children, code),
    };
  }
};

export type ValidationInfo = {
  isPass: boolean;
  hasGateway: boolean;
};

export const convertNode = (
  resource: NodeModel | undefined,
  validation: ValidationInfo,
): any => {
  if (resource && resource.code) {
    if (resource.type == AddNodeType.EMPTY) {
      return convertNode(resource.children, validation);
    }
    const bandingForms = [
      ...(resource.primaryForms || []).map((a) => {
        return { id: a.id, typeName: '主表' };
      }),
      ...(resource.detailForms || []).map((a) => {
        return { id: a.id, typeName: '子表' };
      }),
    ];
    switch (resource.type) {
      case AddNodeType.ROOT:
        if (bandingForms.length == 0) {
          message.warn('ROOT节点未绑定表单');
          validation.isPass = false;
        }
        break;
      case AddNodeType.GATEWAY:
        validation.hasGateway = true;
        break;
      case AddNodeType.CC:
      case AddNodeType.CHILDWORK:
      case AddNodeType.APPROVAL:
        if (!resource.destId || resource.destId == '') {
          message.warn(`${resource.name}节点缺少审批对象`);
          validation.isPass = false;
        }
        break;
      case AddNodeType.CONDITION:
      case AddNodeType.CONCURRENTS:
      case AddNodeType.ORGANIZATIONA:
        if (
          resource.branches == undefined ||
          resource.branches.length == 0 ||
          resource.branches.some(
            (a) => a.children == undefined || a.children.code == undefined,
          )
        ) {
          message.warn(`${resource.name}节点缺少分支信息`);
          validation.isPass = false;
        } else if (
          resource.type == AddNodeType.CONDITION &&
          resource.branches.some(
            (a) =>
              a.conditions == undefined ||
              a.conditions.length == 0 ||
              a.conditions.find((a) => a.val == undefined || a.val == ''),
          )
        ) {
          message.warn(`${resource.name}条件不可为空`);
          validation.isPass = false;
        }
    }
    return {
      id: resource.id,
      forms: bandingForms,
      code: resource.code,
      type: resource.type,
      name: resource.name,
      num: resource.num || 1,
      destType: resource.destType || '身份',
      primaryForms: resource.primaryForms,
      detailForms: resource.detailForms,
      destId: resource.destId,
      destName: resource.destName,
      children: convertNode(resource.children, validation),
      branches: resource.branches?.map((a) => convertBranch(a, validation)),
    };
  }
};

const convertBranch = (resource: any, validation: ValidationInfo) => {
  return {
    conditions: resource.conditions
      ? resource.conditions.map((item: any) => {
          return {
            paramKey: item.paramKey,
            key: item.key,
            type: item.type,
            val: item.val != undefined ? String(item.val) : undefined,
            display: item.display,
          };
        })
      : [],
    children: convertNode(resource.children, validation),
  };
};
