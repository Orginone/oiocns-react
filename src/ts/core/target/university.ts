import { schema } from '../../base';
import { companyTypes, departmentTypes, TargetType } from '../enum';
import Company from './company';

export default class University extends Company {
  constructor(target: schema.XTarget, userId: string) {
    super(target, userId);
    this.departmentTypes = [TargetType.College, ...departmentTypes];
    this.subTeamTypes = [...this.departmentTypes, TargetType.Working];
    this.extendTargetType = [...this.subTeamTypes, ...companyTypes];
    this.joinTargetType = [TargetType.Group];
    this.createTargetType = [
      ...this.subTeamTypes,
      TargetType.Station,
      TargetType.Group,
      TargetType.Cohort,
    ];
    this.searchTargetType = [TargetType.Person, TargetType.Group];
  }
}
