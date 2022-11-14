import { schema } from '../../base';
import { TargetType } from '../enum';
import BaseTarget from './base';

export default class Company extends BaseTarget {
  constructor(target: schema.XTarget) {
    super(target);
  }
  /** 可以创建的子类型 */
  public get subTypes(): TargetType[] {
    return [
      TargetType.JobCohort,
      TargetType.Department,
      TargetType.Working,
      TargetType.Section,
      TargetType.Group,
    ];
  }
  /**
   * 拉人进入单位
   * @param personIds 人员id数组
   * @returns 是否成功
   */
  public async pullPersons(personIds: string[]): Promise<boolean> {
    let res = await this.pull({
      targetType: TargetType.Person,
      targetIds: personIds,
    });
    return res.success;
  }
}
