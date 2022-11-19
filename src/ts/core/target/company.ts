import { model, schema } from '../../base';
import { TargetType } from '../enum';
import BaseTarget from './base';

/**
 * 公司的元操作
 */
export default class Company extends BaseTarget {
  constructor(target: schema.XTarget) {
    super(target);
  }
  
  /** 可以创建的子类型 enum.ts */
  public get subTypes(): TargetType[] {
    return [
      // 工作群
      TargetType.JobCohort,
      // 工作组
      TargetType.Working,
      // 部门
      TargetType.Department,
      // 集团
      TargetType.Group,
      // 科室
      TargetType.Section,
    ];
  }

  /**
   * 拉人进入单位
   * @param personIds 人员id数组
   * @returns 是否成功
   */
  public async pullPersons(personIds: string[]): Promise<model.ResultType<any>> {
    return await this.pull({
      targetType: TargetType.Person,
      targetIds: personIds,
    });
  }
}
