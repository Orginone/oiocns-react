import { TTarget } from '../entity';
import { TargetType } from '../enum';
import Company from './company';

export default class Hospital extends Company {
  constructor(target: TTarget) {
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
}
