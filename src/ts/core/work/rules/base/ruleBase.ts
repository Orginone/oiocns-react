type AcceptedAttrType =
  | '数值型'
  | '描述型'
  | '选择型'
  | '分类型'
  | '附件型'
  | '时间型'
  | '日期型'
  | '用户型';
type triggerType = 'Start' | 'Running' | 'Submit';

export type ruleResultType = {
  /* 规则运行是否异常 */
  success: boolean;
  /* 规则运行结果 */
  data: { [key: string]: any };
  /* 规则运行错误提示 */
  errMsg: string;
};
export interface IRuleBaseType {
  /* 规则主键 */
  id: string;
  /* 规则名称 */
  name: string;
  /* 规则类型 */
  ruleType: 'method' | 'formula';
  /* 触发方式 初始化-修改时-提交时 */
  trigger: triggerType;
  /* 规则支持的数据类型 */
  accept?: AcceptedAttrType[];
  /* 方法作用目标对象的id */
  targetId: string;
  /* 规则关联特性 */
  linkAttrs: { name: string; id: string; code: string }[];
  /* 关联项最大数量 */
  max?: number;
  /* 规则是否可扩展关联项 即增加关联数量*/
  isExtend?: boolean;
  /* 规则错误提示 */
  errorMsg: string;
  /* 规则执行函数构造器 */
  creatFun?: (attrs: any[]) => string;
  /* 规则执行函数 */
  content: string;
  /* 备注 */
  remark: string;
}
/* 规则基础数据模型 */
abstract class RuleBase {
  /* 规则主键 */
  id: string;
  /* 规则名称 */
  name: string;
  /* 规则类型 方法-公式*/
  ruleType: 'method' | 'formula';
  targetId: string;
  /* 触发方式 初始化-修改时-提交时 */
  trigger: triggerType;
  /* 规则支持的数据类型 */
  accept: AcceptedAttrType[];
  /* 规则关联特性 */
  linkAttrs: any[];
  /* 关联项最大数量 */
  max: number = 2;
  /* 规则是否可扩展关联项 */
  isExtend: boolean = false;
  /* 错误提示 */
  errorMsg: string = '规则错误！';
  /* 规则执行函数构造器 ：通过模板函数生成 执行函数*/
  creatFun?: (attrs: any[]) => string;
  /* 规则执行函数 */
  content: string;
  /* 备注 */
  remark: string;

  constructor(data: IRuleBaseType) {
    this.id = data.id;
    this.name = data.name;
    this.trigger = data.trigger;
    this.ruleType = data.ruleType;
    this.linkAttrs = data.linkAttrs;
    this.targetId = data.targetId;
    this.errorMsg = data.errorMsg;
    this.content = data.content;
    this.remark = data.remark;
    this.accept = data.accept ?? [];
    this.max = data.max ?? 10;
    this.isExtend = data.isExtend ?? false;
    this.creatFun = data.creatFun;
  }
  /**
   *@desc 处理规则
   *{'Start' | 'Running' | 'Submit'} trigger 触发时机
   *@param {Object} formData 当前表单数据
   *@return {} 返回处理结果 {【表单key】：value}
   */
  abstract dealRule(formData: { [key: string]: any }): Promise<any>;
  /**
   * @desc 加载外部规则库文件/模板规则
   */
  abstract loadRemoteRules(): void;
  /**
   *@desc 使用模板生成规则函数
   */
  abstract generateRule(): void;
}

export default RuleBase;
