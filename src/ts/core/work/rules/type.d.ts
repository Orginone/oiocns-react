import { IRuleBase } from './base/ruleBase';

export namespace RuleTypes {
  /* 规则类型 */
  type RuleType = 'method' | 'formula';
  /* 关联特性 */
  type AttrType = { name: string; id: string; code?: string };
  // 定义表单规则的键值对类型
  type MapType = {
    rules: IRuleBase[];
    attrs: any[];
    callback?: (data: DataType) => void;
  };
  /* 规则支持的数据类型 */
  type AcceptedType =
    | '数值型'
    | '描述型'
    | '选择型'
    | '分类型'
    | '附件型'
    | '时间型'
    | '日期型'
    | '用户型';
  /* 规则触发方式 初始化-运行中-提交时-子表变动时*/
  type TriggerType = 'Start' | 'Running' | 'Submit' | 'ThingsChanged';

  /* 规则运行返回结果类型 */
  type ResultType = {
    /* 规则运行是否异常 */
    success: boolean;
    /* 规则运行结果 */
    data: any;
    /* 规则运行错误提示 */
    errMsg: string;
  };
  type DataType = {
    [key: string]: any;
  };
/* 表单变化时，返回类型 */
  type callBackType = {
    formId: string;
    callback: (data: any) => void;
  };
}
