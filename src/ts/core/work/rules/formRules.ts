import OrgCtrl from '@/ts/controller/index';
import FormulaRule from './formulaRule';
import MethodRule from './methodRule';
enum RuleType {
  'formula' = 'formula',
  'method' = 'method',
}
enum triggerType {
  'start' = 'Start',
  'running' = 'Running',
  'submit' = 'Submit',
}
interface DataType {
  [key: string]: any;
}
class FormRules {
  constructor(RuleInfo: any[], beloneId: string) {
    this._beloneId = beloneId;
    this.queryAllFormRules(RuleInfo);
  }
  _beloneId: string;
  _AllRules: any[] = [];
  /* 所有初始化规则 */
  _StartRules: any[] = [];
  /* 所有运行中规则 */
  _RunningRules: any[] = [];
  /* 所有提交时 规则 */
  _SubmitRules: any[] = [];

  /* 获取表单关联规则 */
  queryAllFormRules(frs: any[]) {
    console.log('获取表单关联规则', frs);
    this._StartRules = [];
    this._RunningRules = [];
    this._SubmitRules = [];
    frs.forEach((_r) => {
      switch (_r.ruleType) {
        case RuleType.formula:
          this._AllRules.push(new FormulaRule(_r));
          break;
        case RuleType.method:
          this._AllRules.push(new MethodRule(_r));
          break;

          break;
        default:
          break;
      }
    });
    /* 处理规则分组 */
  }
  /**
   * @desc 触发规则处理  处理完一类规则，返回所有要回显至表单的数据，通过回调页面方法操作表单 {attrId1：value1，attrId2：value2}
   * @param trigger 触发方式
   * @param formData 当前表单数据  用于处理 运行中，及提交时 读取表单数据
   * @param callBack 处理完成的回调
   */
  async renderRules(
    trigger: 'Start' | 'Running' | 'Submit',
    formData: DataType,
    attrs: DataType,
    callBack: any,
  ) {
    /* 最终输出结果 */
    let resultObj = {};
    let _Rules: any[] = this._AllRules.filter((item) => item.trigger === trigger);
    console.log('打印', attrs, _Rules);
    for (let i = 0; i < _Rules.length; i++) {
      const _R = _Rules[i];
      try {
        let res = await _R.dealRule({
          $formData: formData,
          $attrs: attrs,
          $company:
            OrgCtrl.user.companys.find((v) => v.id === this._beloneId)?.metadata ?? {},
          $user: OrgCtrl.user.metadata,
        });
        console.log(_R.name, res);
        if (res.success) {
          resultObj = { ...resultObj, ...res.data };
        }
      } catch (error) {
        throw new Error('规则解析错误：' + _R.name);
      }
    }

    console.log('最终数据结果', resultObj);
    callBack && callBack(resultObj);
  }
}

export default FormRules;
