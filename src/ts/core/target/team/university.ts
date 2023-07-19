import { schema } from '../../../base';
import { TargetType } from '../../public/enums';
import { IPerson } from '../person';
import { Company, ICompany } from './company';

export default interface IUniversity extends ICompany {}

export class University extends Company implements IUniversity {
  constructor(_metadata: schema.XTarget, _user: IPerson) {
    super(_metadata, _user);
    this.departmentTypes = [
      TargetType.College,
      TargetType.Office,
      TargetType.Working,
      TargetType.Research,
      TargetType.Laboratory,
      TargetType.Department,
    ];
  }
}
