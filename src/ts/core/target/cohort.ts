import { TargetType } from '../enum';
import BaseTarget from './base';
import { schema } from '../../base';
import { ICohort } from './itarget';

export default class Cohort extends BaseTarget implements ICohort {
  private _onDeleted: Function;
  constructor(target: schema.XTarget, onDeleted: Function) {
    super(target);
    this._onDeleted = onDeleted;
    this.searchTargetType = [TargetType.Person];
  }
  public async searchPerson(code: string): Promise<schema.XTargetArray> {
    return await this.searchTargetByName(code, [TargetType.Person]);
  }
  async delete(): Promise<boolean> {
    const res = await this.deleteTarget();
    if (res.success) {
      this._onDeleted?.apply(this, []);
    }
    return res.success;
  }
}
