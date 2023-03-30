import { TargetType } from '../enum';
import BaseTarget from './base';
import { kernel, schema } from '../../base';
import { ICohort } from './itarget';
import { XTarget } from '@/ts/base/schema';

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
  public async queryBelong(): Promise<XTarget | undefined> {
    const res = await kernel.queryTargetById({ ids: [this.target.belongId] });
    if (res?.data?.result?.length ?? 0 > 0) {
      this.target.belong = res!.data!.result![0];
    }
    return this.target.belong;
  }
  async delete(): Promise<boolean> {
    const res = await this.deleteTarget();
    if (res.success) {
      this._onDeleted?.apply(this, []);
    }
    return res.success;
  }
}
