import { kernel, model, schema } from '../../../base';
import { IMsgChat } from '../../chat/message/msgchat';
import { PageAll } from '../../public/consts';
import { ITeam, Team } from '../base/team';
import { IIdentity, Identity } from '../identity/identity';
import { ICompany } from '../team/company';

/** 岗位接口 */
export interface IStation extends ITeam {
  /** 设立岗位的单位 */
  company: ICompany;
  /** 岗位下的角色 */
  identitys: IIdentity[];
  /** 加载用户设立的身份(角色)对象 */
  loadIdentitys(reload?: boolean): Promise<IIdentity[]>;
  /** 用户拉入新身份(角色) */
  pullIdentitys(identitys: IIdentity[]): Promise<boolean>;
  /** 用户移除身份(角色) */
  removeIdentitys(identitys: IIdentity[]): Promise<boolean>;
}

export class Station extends Team implements IStation {
  constructor(_metadata: schema.XTarget, _space: ICompany) {
    super(_metadata, [_metadata.belong?.name ?? '', _metadata.typeName + '群'], _space);
    this.company = _space;
  }
  company: ICompany;
  identitys: IIdentity[] = [];
  private _identityLoaded: boolean = false;
  async loadIdentitys(reload?: boolean | undefined): Promise<IIdentity[]> {
    if (!this._identityLoaded || reload) {
      const res = await kernel.queryTeamIdentitys({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this._identityLoaded = true;
        this.identitys = (res.data.result || []).map((item) => {
          return new Identity(item, this.space);
        });
      }
    }
    return this.identitys;
  }
  async pullIdentitys(identitys: IIdentity[]): Promise<boolean> {
    identitys = identitys.filter((i) => {
      return this.identitys.filter((m) => m.id === i.id).length < 1;
    });
    if (identitys.length > 0) {
      const res = await kernel.pullAnyToTeam({
        id: this.id,
        subIds: identitys.map((i) => i.id),
      });
      if (res.success) {
        this.identitys.push(...identitys);
      }
      return res.success;
    }
    return true;
  }
  async removeIdentitys(identitys: IIdentity[]): Promise<boolean> {
    for (const identity of identitys) {
      const res = await kernel.removeOrExitOfTeam({
        id: this.id,
        subId: identity.id,
      });
      if (res.success) {
        this.identitys = this.identitys.filter((i) => i.key != identity.key);
      }
    }
    return true;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteTarget({
      id: this.id,
      page: PageAll,
    });
    if (res.success) {
      this.company.stations = this.company.stations.filter((i) => i.key != this.key);
    }
    return res.success;
  }
  get chats(): IMsgChat[] {
    return [this];
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadMembers(reload);
  }
  createTarget(_data: model.TargetModel): Promise<ITeam | undefined> {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
}
