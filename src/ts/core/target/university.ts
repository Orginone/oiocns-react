import { schema } from '../../base';
import { TargetType } from '../enum';
import Company from './company';

export default class University extends Company {
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
      TargetType.College,
      TargetType.Laboratory,
    ];
  }
}
