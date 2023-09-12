import { RuleTypes } from '../type.d';
import { EffectEnum } from './enum';
/* 基础规则数据类型 */
export interface IRuleBase {
  /* 规则主键 */
  id: string;
  /* 规则名称 */
  name: string;
  /* 规则类型 */
  ruleType: RuleTypes.RuleType;
  /* 触发方式 初始化-修改时-提交时-子表变动后 */
  trigger: RuleTypes.TriggerType;
  /* 规则支持的数据类型 */
  accept?: RuleTypes.AcceptedType[];
  /* 规则关联特性 */
  linkAttrs: RuleTypes.AttrType[];
  /** 规则执行结果的使用方式 */
  effect?: keyof typeof EffectEnum;
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
  id: string = '';
  /* 规则名称 */
  name: string = '';
  /* 规则类型 方法-公式*/
  ruleType: 'method' | 'formula' = 'method';
  /* 触发方式 初始化-修改时-提交时 */
  trigger: RuleTypes.TriggerType = 'Start';
  /* 规则支持的数据类型 */
  accept: RuleTypes.AcceptedType[] = [];
  /* 返回值效果 */
  effect?: keyof typeof EffectEnum;
  /* 规则关联特性 */
  linkAttrs: any[] = [];
  /* 关联项最大数量 */
  max = 5;
  /* 规则是否可扩展关联项 */
  isExtend = false;
  /* 错误提示 */
  errorMsg = '规则错误！';
  /* 规则执行函数 */
  content: string = '';
  /* 备注 */
  remark: string = '';

  constructor(data: IRuleBase) {
    /* 对象属性赋值 */
    Object.assign(this, data);
  }

  /**
   * @desc 处理规则
   * @param {'Start' | 'Running' | 'Submit'} trigger 触发时机
   * @param {Object} formData 当前表单数据
   * @return {} 返回处理结果 {【表单key】：value}
   */
  abstract dealRule(formData: { [key: string]: any }): Promise<any>;
}

export default RuleBase;
