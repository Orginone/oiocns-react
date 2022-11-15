import { schema } from '../../base';
import { TargetType } from '../enum';
import BaseTarget from './base';

export default class Cohort extends BaseTarget {
  constructor(target: schema.XTarget) {
    super(target);
  }
  /**
   * 拉人进入群组
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
