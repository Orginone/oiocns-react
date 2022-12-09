import { schema } from '../../base';
import { TargetType } from '../enum';
import Company from './company';

export default class Hospital extends Company {
  constructor(target: schema.XTarget, userId: string) {
    super(target, userId);
    this.subTeamTypes = [
      TargetType.Group,
      TargetType.JobCohort,
      TargetType.Office,
      TargetType.Working,
      TargetType.Section,
      TargetType.Laboratory,
    ];
  }
}
