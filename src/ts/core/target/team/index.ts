import { schema } from '../../../base';
import { TargetType } from '../../public/enums';
import { IPerson } from '../person';
import { Company } from './company';
import { Hospital } from './hospital';
import { University } from './university';

/** 创建单位实现 */
export const createCompany = (_metadata: schema.XTarget, _user: IPerson) => {
  switch (_metadata.typeName as TargetType) {
    case TargetType.Hospital:
      return new Hospital(_metadata, _user);
    case TargetType.University:
      return new University(_metadata, _user);
    default:
      return new Company(_metadata, _user);
  }
};
