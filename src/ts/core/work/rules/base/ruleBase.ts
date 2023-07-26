import { RuleTypes } from '../type.d';

/* 基础规则数据类型 */
export interface IRuleBase {
  /* 规则主键 */
  id: string;
  /* 规则名称 */
  name: string;
  /* 规则类型 */
  ruleType: RuleTypes.RuleType;
  /* 触发方式 初始化-修改时-提交时 */
  trigger: RuleTypes.TriggerType;
  /* 规则支持的数据类型 */
  accept?: RuleTypes.AcceptedType[];
  /* 规则关联特性 */
  linkAttrs: RuleTypes.AttrType[];
  /* 关联项最大数量 */
  max?: number;
  /* 规则是否可扩展关联项 即增加关联数量*/
  isExtend?: boolean;
  /* 规则错误提示 */
  errorMsg: string;
  /* 规则内容 */
  content: string;
  /* 备注 */
  remark: string;
  /* 处理规则生成结果 */
  dealRule: (formData: { [key: string]: any }) => Promise<any>;
}
/* 规则基础数据模型 */
abstract class RuleBase implements IRuleBase {
  /* 规则主键 */
  id: string;
  /* 规则名称 */
  name: string;
  /* 规则类型 方法-公式*/
  ruleType: 'method' | 'formula';
  /* 触发方式 初始化-修改时-提交时 */
  trigger: RuleTypes.TriggerType;
  /* 规则支持的数据类型 */
  accept: RuleTypes.AcceptedType[];
  /* 规则关联特性 */
  linkAttrs: any[];
  /* 关联项最大数量 */
  max: number = 5;
  /* 规则是否可扩展关联项 */
  isExtend: boolean = false;
  /* 错误提示 */
  errorMsg: string = '规则错误！';
  /* 规则执行函数 */
  content: string;
  /* 备注 */
  remark: string;

  constructor(data: IRuleBase) {
    this.id = data.id;
    this.name = data.name;
    this.trigger = data.trigger;
    this.ruleType = data.ruleType;
    this.linkAttrs = data.linkAttrs;
    this.errorMsg = data.errorMsg;
    this.content = data.content;
    this.remark = data.remark;
    this.accept = data.accept ?? [];
    this.max = data.max ?? 5;
    this.isExtend = data.isExtend ?? false;
  }
  /**
   *@desc 处理规则
   *@param {'Start' | 'Running' | 'Submit'} trigger 触发时机
   *@param {Object} formData 当前表单数据
   *@return {} 返回处理结果 {【表单key】：value}
   */
  abstract dealRule(formData: { [key: string]: any }): Promise<any>;
  // /**
  //  * @desc 加载外部规则库文件/模板规则
  //  */
  // abstract loadRemoteRules(): void;
}

export default RuleBase;
