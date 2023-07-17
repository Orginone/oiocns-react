import OrgCtrl from '@/ts/controller/index';

class FormRules {
  constructor(fromRuleInfo, beloneId) {
    this._beloneId = beloneId;
  }
  /* 所有初始化规则 */
  _StartRules: any[];
  /* 所有运行中规则 */
  _RunningRules: any[];
  /* 所有提交时 规则 */
  _SubmitRules: any[];
  /* 获取表单关联规则 */
  queryAllFormRules() {
    /* 处理规则分组 */
  }
  _beloneId: string;
  /**
   * @desc 触发规则处理  处理完一类规则，返回所有要回显至表单的数据，通过回调页面方法操作表单 {attrId1：value1，attrId2：value2}
   * @param trigger 触发方式
   * @param formData_Now 当前表单数据  用于处理 运行中，及提交时 读取表单数据
   * @param callBack 处理完成的回调
   */
  async renderRules(trigger: 'Start' | 'Running' | 'Submit', formData_Now, callBack) {
    const USER_INFO = OrgCtrl.user.metadata;
    const COMPANY_INFO = OrgCtrl.user.companys.find(
      (v) => v.id === this._beloneId,
    )?.metadata;
    /* 最终输出结果 */
    let resultObj = {};
    let _Rules: any[] = [];
    switch (trigger) {
      case 'Start':
        _Rules = this._StartRules;
        break;
      case 'Running':
        _Rules = this._RunningRules;
        break;
      case 'Submit':
        _Rules = this._SubmitRules;
        break;
      default:
        break;
    }
    for (let i = 0; i < _Rules.length; i++) {
      const _R = _Rules[i];
      try {
        let res = await _R.dealRule({
          $user: USER_INFO,
          $fromData: formData_Now,
          $company: COMPANY_INFO,
          $system: {}, //系统内置函数
        });
        if (res.success) {
          console.log('打印输出结果', _R, res);

          resultObj = { ...resultObj, ...res.data };
        }
      } catch (error) {
        throw new Error('规则解析错误：' + _R.name);
      }
    }

    console.log('最终数据', resultObj);
    callBack && callBack(resultObj);
  }
}

export default FormRules;
