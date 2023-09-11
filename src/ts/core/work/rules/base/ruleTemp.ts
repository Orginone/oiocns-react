import RuleBase, { IRuleBase } from './ruleBase';
export interface IRuleTemp extends IRuleBase {
  /* 模板名称 */
  name: string;
  /* 规则执行函数构造器 */
  creatFun?: (attrs: any[]) => string;
  /* 备注 */
  remark: string;
}
/* 规则基础数据模型 */
class RuleTemp extends RuleBase implements IRuleBase {
  constructor(data: any) {
    super(data);
  }
  /**
   *@desc 处理模板为规则规则
   */
  dealRule(formData: { [key: string]: any }): Promise<any> {
    throw new Error('Method not implemented.');
  }
  /**
   * @desc 加载外部规则库文件/模板规则
   */
  async loadRemoteRules(): Promise<any> {
    // await sleep(2000);
    // return {
    //   name: '测试加载外部模板',
    //   creatFun: () => '',
    //   content: '',
    //   remark: '',
    // };
  }
  /**
   *@desc 使用模板生成规则函数
   */
  generateRule(): string {
    throw new Error('Method not implemented.');
  }
}

export default RuleTemp;
