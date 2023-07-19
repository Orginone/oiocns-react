import { schema } from '../../../base';
import { TargetType } from '../../public/enums';
import { IPerson } from '../person';
import { Company, ICompany } from './company';

export default interface IHospital extends ICompany {}

export class Hospital extends Company implements IHospital {
  constructor(_metadata: schema.XTarget, _user: IPerson) {
    super(_metadata, _user);
    this.departmentTypes = [
      TargetType.Section,
      TargetType.Office,
      TargetType.Working,
      TargetType.Research,
      TargetType.Laboratory,
      TargetType.Department,
    ];
  }
}
