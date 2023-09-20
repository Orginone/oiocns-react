import { logger } from '@/ts/base/common';
import { kernel, model, schema } from '../../../base';
import { OperateType, teamOperates } from '../../public';
import { PageAll } from '../../public/consts';
import { IDirectory } from '../../thing/directory';
import { ITeam, Team } from '../base/team';
import { IPerson } from '../person';
import { ICompany } from '../team/company';

/** 岗位接口 */
export interface IStation extends ITeam {
  /** 设立岗位的单位 */
  space: ICompany;
  /** 岗位下的角色 */
  identitys: schema.XIdentity[];
  /** 加载用户设立的身份(角色)对象 */
  loadIdentitys(reload?: boolean): Promise<schema.XIdentity[]>;
  /** 用户拉入新身份(角色) */
  pullIdentitys(identitys: schema.XIdentity[]): Promise<boolean>;
  /** 用户移除身份(角色) */
  removeIdentitys(identitys: schema.XIdentity[], notity?: boolean): Promise<boolean>;
}

export class Station extends Team implements IStation {
  constructor(_metadata: schema.XTarget, _space: ICompany) {
    super(_metadata, [_space.id]);
    this.space = _space;
    this.user = _space.user;
    this.directory = _space.directory;
    kernel.on(`${_metadata.belongId}-${_metadata.id}-identity`, (data: any) =>
      this._receiveIdentity(data),
    );
  }
  user: IPerson;
  space: ICompany;
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
  async pullIdentitys(identitys: schema.XIdentity[]): Promise<boolean> {
    identitys = identitys.filter((i) => this.identitys.every((a) => a.id !== i.id));
    if (identitys.length > 0) {
      const res = await kernel.pullAnyToTeam({
        id: this.id,
        subIds: identitys.map((i) => i.id),
      });
      if (!res.success) return false;
      identitys.forEach((a) => this._sendTargetNotity(OperateType.Add, a));
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
          this._sendTargetNotity(OperateType.Remove, identity);
        } else {
          this.space.user.removeGivedIdentity(
            identitys.map((a) => a.id),
            this.id,
          );
          this.identitys = this.identitys.filter((i) => i.id != identity.id);
        }
      }
    }
    return true;
  }
  override async delete(notity: boolean = false): Promise<boolean> {
    const success = await super.delete(notity);
    if (notity) {
      this.space.stations = this.space.stations.filter((i) => i.key != this.key);
    }
    this.space.user.removeGivedIdentity(
      this.identitys.map((a) => a.id),
      this.id,
    );
    return success;
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

  private async _sendTargetNotity(
    operate: OperateType,
    identity: schema.XIdentity,
    targetId?: string,
    ignoreSelf?: boolean,
    onlyTarget?: boolean,
    onlineOnly: boolean = true,
  ): Promise<boolean> {
    const res = await kernel.dataNotify({
      data: {
        operate: operate as string,
        station: this.metadata,
        identity: identity,
        operater: this.user.metadata,
      },
      flag: 'identity',
      onlineOnly: onlineOnly,
      belongId: this.belongId,
      relations: this.relations,
      onlyTarget: onlyTarget === true,
      ignoreSelf: ignoreSelf === true,
      targetId: targetId ?? this.id,
    });
    return res.success;
  }
  private async _receiveIdentity(data: model.IdentityOperateModel) {
    let message = '';
    switch (data.operate) {
      case OperateType.Delete:
        message = `${data.operater?.name}将身份【${data.identity.name}】删除.`;
        this.removeIdentitys([data.identity], true);
        break;
      case OperateType.Update:
        message = `${data.operater?.name}将身份【${data.identity.name}】信息更新.`;
        const index = this.identitys.findIndex((a) => a.id == data.identity.id);
        this.identitys[index] = data.identity;
        break;
      case OperateType.Remove:
        message = `${data.operater?.name}移除岗位【${this.name}】中的身份【${data.identity.name}】.`;
        this.removeIdentitys([data.identity], true);
        break;
      case OperateType.Add:
        if (this.identitys.every((a) => a.id == data.identity.id)) {
          message = `${data.operater?.name}向岗位【${this.name}】添加身份【${data.identity.name}】.`;
          this.identitys.push(data.identity);
        }
        break;
      default:
        return;
    }
    if (message.length > 0) {
      if (data.operater?.id != this.user.id) {
        logger.info(message);
      }
      this.directory.structCallback();
    }
  }
}
