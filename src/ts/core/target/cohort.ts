import { TargetType } from '../enum';
import BaseTarget from './base';
import { schema } from '../../base';
import consts from '../consts';

export default class Cohort extends BaseTarget {
  constructor(target: schema.XTarget) {
    super(target);
    this.pullTypes = [TargetType.Person, ...consts.CompanyTypes];
    this.searchTargetType = [TargetType.Person, ...consts.CompanyTypes];
  }
}
