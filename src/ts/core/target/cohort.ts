import { TargetType } from '../enum';
import BaseTarget from './base';
import { schema } from '../../base';
import { ICohort } from './itarget';

export default class Cohort extends BaseTarget implements ICohort {
  constructor(target: schema.XTarget) {
    super(target);
    this.searchTargetType = [TargetType.Person];
  }
  public async searchPerson(code: string): Promise<schema.XTargetArray> {
    return await this.searchTargetByName(code, [TargetType.Person]);
  }
}
