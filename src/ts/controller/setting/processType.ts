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

export type everyCondition = {
  label: string;
  value: string;
  type: string;
};

export type conditiondType = {
  pos: number;
  paramKey: string;
  paramLabel: string;
  key: string;
  label: string;
  type: dataType;
  val: string | null;
  valLabel?: string;
};

export type nodeType = {
  type: AddNodeType;
  parentId: string;
  nodeId: string;
  name: string;
  conditions: conditiondType[];
};

//审批节点默认属性
type Approvalprops = {
  [key: string]: any;
};

export const APPROVAL_PROPS: Approvalprops = {
  assignedType: 'USER',
  mode: 'AND',
  num: 1,
  assignedUser: [],
  refuse: {
    type: 'TO_END', //驳回规则 TO_END  TO_NODE  TO_BEFORE
    target: '', //驳回到指定ID的节点
  },
};

//根节点默认属性
export const ROOT_PROPS: Approvalprops = {
  assignedUser: [],
};

//条件节点默认属性
export const CONDITION_PROPS: Approvalprops = {
  groupsType: 'OR', //条件组逻辑关系 OR、AND
  groups: [
    {
      groupType: 'AND', //条件组内条件关系 OR、AND
      cids: [], //条件ID集合
      conditions: [], //组内子条件
    },
  ],
  expression: '', //自定义表达式，灵活构建逻辑关系
};

//条件节点 条件数组
export const CONDITION_CONDITIONS: Approvalprops = {
  pos: 1,
  paramKey: '',
  paramLabel: '',
  key: '',
  label: '',
  type: 'NUMERIC',
  val: null,
  valLabel: '',
};

//抄送节点默认属性
export const CC_PROPS: Approvalprops = {
  assignedUser: [],
};

//触发器节点默认属性
export const TRIGGER_PROPS: Approvalprops = {
  type: 'WEBHOOK',
  http: {
    method: 'GET', //请求方法 支持GET/POST
    url: '', //URL地址，可以直接带参数
    headers: [
      //http header
      {
        name: '',
        isField: true,
        value: '', //支持表达式 ${xxx} xxx为表单字段名称
      },
    ],
    contentType: 'FORM', //请求参数类型
    params: [
      //请求参数
      {
        name: '',
        isField: true, //是表单字段还是自定义
        value: '', //支持表达式 ${xxx} xxx为表单字段名称
      },
    ],
    retry: 1,
    handlerByScript: false,
    success: 'function handlerOk(res) {\n  return true;\n}',
    fail: 'function handlerFail(res) {\n  return true;\n}',
  },
  email: {
    subject: '',
    to: [],
    content: '',
  },
};

//延时节点默认属性
export const DELAY_PROPS = {
  type: 'FIXED', //延时类型 FIXED:到达当前节点后延时固定时长 、AUTO:延时到 dateTime设置的时间
  time: 0, //延时时间
  unit: 'M', //时间单位 D天 H小时 M分钟
  dateTime: '', //如果当天没有超过设置的此时间点，就延时到这个指定的时间，到了就直接跳过不延时
};
