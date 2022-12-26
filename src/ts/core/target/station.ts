import { IStation } from './itarget';
import { common, kernel, schema } from '../../base';
import BaseTarget from './base';
import { TargetType } from '../enum';
import { XIdentity, XTarget } from '@/ts/base/schema';

/**
 * 岗位的元操作
 */
export default class Station extends BaseTarget implements IStation {
  private _onDeleted: Function;
  private _identitys: XIdentity[] = [];
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
  public async loadIdentitys(reload: boolean = false): Promise<XIdentity[]> {
    if (!reload && this._identitys) {
      return this._identitys;
    }
    const res = await kernel.queryTeamIdentitys({
      id: this.id,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success && res.data.result) {
      this._identitys = res.data.result;
    }
    return this._identitys;
  }
  public async pullIdentitys(identitys: XIdentity[]): Promise<boolean> {
    identitys = identitys.filter((a) => !this._identitys.includes(a));
    if (identitys.length > 0) {
      const res = await kernel.PullIdentityToTeam({
        id: this.id,
        targetIds: identitys.map((a) => a.id),
        targetType: '',
        teamTypes: [this.target.typeName],
      });
      if (res.success) {
        this._identitys.push(...identitys);
        return true;
      }
    }
    return false;
  }
  public async removeIdentitys(ids: string[]): Promise<boolean> {
    const res = await kernel.removeTeamIdentity({
      id: this.target.team!.id,
      targetIds: ids,
    });
    if (res.success) {
      this._identitys = this._identitys.filter((a) => !ids.includes(a.id));
      return true;
    }
    return false;
  }
}
