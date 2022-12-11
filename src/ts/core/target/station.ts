import { PageRequest } from '@/ts/base/model';
import { IStation } from './itarget';
import { kernel, schema } from '../../base';
import BaseTarget from './base';
import { TargetType } from '../enum';
import { XTarget } from '@/ts/base/schema';

/**
 * 工作组的元操作
 */
export default class Station extends BaseTarget implements IStation {
  private _onDeleted: Function;
  constructor(target: XTarget, onDeleted: Function) {
    super(target);
    this._onDeleted = onDeleted;
  }
  async delete(): Promise<boolean> {
    const res = await this.deleteTarget();
    if (res.success) {
      this._onDeleted?.apply(this, []);
    }
    return res.success;
  }
  public async searchPerson(code: string): Promise<schema.XTargetArray> {
    return await this.searchTargetByName(code, [TargetType.Person]);
  }
  /** 加载岗位下的身份 */
  public async loadIdentitys(page: PageRequest): Promise<schema.XIdentityArray> {
    const res = await kernel.queryTeamIdentitys({
      page: page,
      id: this.id,
    });
    return res.data;
  }
  public async pullIdentitys(ids: string[]): Promise<boolean> {
    return (
      await kernel.PullIdentityToTeam({
        id: this.id,
        targetIds: ids,
        targetType: '',
        teamTypes: [this.target.typeName],
      })
    ).success;
  }
  public async removeIdentitys(ids: string[]): Promise<boolean> {
    return (
      await kernel.removeTeamIdentity({
        id: this.target.id,
        targetIds: ids,
      })
    ).success;
  }
}
