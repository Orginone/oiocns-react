import { kernel, model, schema } from '../../../base';
import { IMsgChat } from '../../chat/message/msgchat';
import { OperateType, teamOperates } from '../../public';
import { PageAll } from '../../public/consts';
import { IDirectory } from '../../thing/directory';
import { ITeam, Team } from '../base/team';
import { ICompany } from '../team/company';

/** 岗位接口 */
export interface IStation extends ITeam {
  /** 设立岗位的单位 */
  company: ICompany;
  /** 岗位下的角色 */
  identitys: schema.XIdentity[];
  /** 加载用户设立的身份(角色)对象 */
  loadIdentitys(reload?: boolean): Promise<schema.XIdentity[]>;
  /** 用户拉入新身份(角色) */
  pullIdentitys(identitys: schema.XIdentity[], notity?: boolean): Promise<boolean>;
  /** 用户移除身份(角色) */
  removeIdentitys(identitys: schema.XIdentity[], notity?: boolean): Promise<boolean>;
}

export class Station extends Team implements IStation {
  constructor(_metadata: schema.XTarget, _space: ICompany) {
    super(_metadata, [_metadata.belong?.name ?? '', _metadata.typeName + '群'], _space);
    this.company = _space;
    this.directory = _space.directory;
  }
  company: ICompany;
  directory: IDirectory;
  identitys: schema.XIdentity[] = [];
  private _identityLoaded: boolean = false;
  async loadIdentitys(reload?: boolean | undefined): Promise<schema.XIdentity[]> {
    if (!this._identityLoaded || reload) {
      const res = await kernel.queryTeamIdentitys({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this._identityLoaded = true;
        this.identitys = res.data.result || [];
      }
    }
    return this.identitys;
  }
  async pullIdentitys(
    identitys: schema.XIdentity[],
    notity: boolean = false,
  ): Promise<boolean> {
    identitys = identitys.filter((i) => this.identitys.every((a) => a.id !== i.id));
    if (identitys.length > 0) {
      if (!notity) {
        const res = await kernel.pullAnyToTeam({
          id: this.id,
          subIds: identitys.map((i) => i.id),
        });
        if (!res.success) return false;
        identitys.forEach((a) => this.createIdentityMsg(OperateType.Add, a));
      }
      this.identitys.push(...identitys);
    }
    return true;
  }
  async removeIdentitys(
    identitys: schema.XIdentity[],
    notity: boolean = false,
  ): Promise<boolean> {
    identitys = identitys.filter((i) => this.identitys.some((a) => a.id === i.id));
    if (identitys.length > 0) {
      for (const identity of identitys) {
        if (!notity) {
          const res = await kernel.removeOrExitOfTeam({
            id: this.id,
            subId: identity.id,
          });
          if (!res.success) return false;
          this.createIdentityMsg(OperateType.Remove, identity);
        }
        this.company.user.removeGivedIdentity(
          identitys.map((a) => a.id),
          this.id,
        );
        this.identitys = this.identitys.filter((i) => i.id != identity.id);
      }
    }
    return true;
  }
  override async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadMembers(reload);
    await this.loadIdentitys(reload);
    return true;
  }
  override async delete(notity: boolean = false): Promise<boolean> {
    notity = await super.delete(notity);
    if (notity) {
      this.company.stations = this.company.stations.filter((i) => i.key != this.key);
    }
    this.company.user.removeGivedIdentity(
      this.identitys.map((a) => a.id),
      this.id,
    );
    return notity;
  }
  get chats(): IMsgChat[] {
    return [this];
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadIdentitys(reload);
    await this.loadMembers(reload);
  }
  createTarget(_data: model.TargetModel): Promise<ITeam | undefined> {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
  async teamChangedNotity(target: schema.XTarget): Promise<boolean> {
    return await this.pullMembers([target], true);
  }
  override operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.hasRelationAuth()) {
      operates.unshift(teamOperates.pullIdentity);
    }
    return operates;
  }
  async createIdentityMsg(
    operate: OperateType,
    identity: schema.XIdentity,
  ): Promise<void> {
    await kernel.createIdentityMsg({
      group: false,
      stationId: this.id,
      identityId: identity.id,
      excludeOperater: true,
      data: JSON.stringify({
        operate,
        station: this.metadata,
        identity: identity,
        operater: this.space.user.metadata,
      }),
    });
  }
}
