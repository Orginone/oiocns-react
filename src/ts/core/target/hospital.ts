import { schema, model } from '../../base';
import { TargetType } from '../enum';
import Company from './company';

export default class Hospital extends Company {
  constructor(target: schema.XTarget) {
    super(target);
  }

  /** 可以创建的子类型 */
  public override get subTypes(): TargetType[] {
    return [
      TargetType.Group,
      TargetType.JobCohort,
      TargetType.Office,
      TargetType.Working,
      TargetType.Section,
      TargetType.Laboratory,
    ];
  }
  /**
   * 查询加入医院申请
   * @param id
   * @returns
   */
  public async queryJoinCompanyApply(): Promise<model.ResultType<any>> {
    const res = await this.queryJoinApplyBase();
    return res;
  }
  
  
  
}
