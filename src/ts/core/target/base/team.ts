import { schema, kernel, model, command } from '../../../base';
import { OperateType, TargetType } from '../../public/enums';
import { PageAll, orgAuth } from '../../public/consts';
import { IBelong } from './belong';
import { Entity, IEntity, entityOperates } from '../../public';
import { IDirectory } from '../../thing/directory';
import { ISession } from '../../chat/session';
import { IPerson } from '../person';
import { logger, sleep } from '@/ts/base/common';

/** 团队抽象接口类 */
export interface ITeam extends IEntity<schema.XTarget> {
  /** 当前用户 */
  user: IPerson;
  /** 加载归属组织 */
  space: IBelong;
  /** 当前目录 */
  directory: IDirectory;
  /** 成员 */
  members: schema.XTarget[];
  /** 限定成员类型 */
  memberTypes: TargetType[];
  /** 成员会话 */
  memberChats: ISession[];
  /** 深加载 */
  deepLoad(reload?: boolean): Promise<void>;
  /** 加载成员 */
  loadMembers(reload?: boolean): Promise<schema.XTarget[]>;
  /** 创建用户 */
  createTarget(data: model.TargetModel): Promise<ITeam | undefined>;
  /** 更新团队信息 */
  update(data: model.TargetModel): Promise<boolean>;
  /** 删除(注销)团队 */
  delete(notity?: boolean): Promise<boolean>;
  /** 用户拉入新成员 */
  pullMembers(members: schema.XTarget[], notity?: boolean): Promise<boolean>;
  /** 用户移除成员 */
  removeMembers(members: schema.XTarget[], notity?: boolean): Promise<boolean>;
  /** 是否有管理关系的权限 */
  hasRelationAuth(): boolean;
  /** 判断是否拥有某些权限 */
  hasAuthoritys(authIds: string[]): boolean;
  /** 发送组织变更消息 */
  sendTargetNotity(
    operate: OperateType,
    sub?: schema.XTarget,
    subTargetId?: string,
  ): Promise<boolean>;
}

/** 团队基类实现 */
export abstract class Team extends Entity<schema.XTarget> implements ITeam {
  constructor(
    _keys: string[],
    _metadata: schema.XTarget,
    _relations: string[],
    _memberTypes: TargetType[] = [TargetType.Person],
  ) {
    super(_metadata, [_metadata.typeName]);
    this.memberTypes = _memberTypes;
    this.relations = _relations;
    kernel.subscribe(
      `${_metadata.belongId}-${_metadata.id}-target`,
      [..._keys, this.key],
      (data) => this._receiveTarget(data),
    );
  }
  memberTypes: TargetType[];
  members: schema.XTarget[] = [];
  memberChats: ISession[] = [];
  relations: string[];
  abstract directory: IDirectory;
  private _memberLoaded: boolean = false;
  async loadMembers(reload: boolean = false): Promise<schema.XTarget[]> {
    if (!this._memberLoaded || reload) {
      const res = await kernel.querySubTargetById({
        id: this.id,
        subTypeNames: this.memberTypes,
        page: PageAll,
      });
      if (res.success) {
        this._memberLoaded = true;
        this.members = res.data.result || [];
        this.members.forEach((i) => this.updateMetadata(i));
        this.loadMemberChats(this.members, true);
      }
    }
    return this.members;
  }
  async pullMembers(
    members: schema.XTarget[],
    notity: boolean = false,
  ): Promise<boolean> {
    members = members
      .filter((i) => this.memberTypes.includes(i.typeName as TargetType))
      .filter((i) => this.members.every((a) => a.id != i.id));
    if (members.length > 0) {
      if (!notity) {
        const res = await kernel.pullAnyToTeam({
          id: this.id,
          subIds: members.map((i) => i.id),
        });
        if (!res.success) return false;
        members.forEach((a) => {
          this.sendTargetNotity(OperateType.Add, a, a.id);
        });
        this.notifySession(true, members);
      }
      this.members.push(...members);
      this.loadMemberChats(members, true);
    }
    return true;
  }
  async removeMembers(
    members: schema.XTarget[],
    notity: boolean = false,
  ): Promise<boolean> {
    members = members
      .filter((i) => this.memberTypes.includes(i.typeName as TargetType))
      .filter((i) => this.members.some((a) => a.id == i.id));
    for (const member of members) {
      if (this.memberTypes.includes(member.typeName as TargetType)) {
        if (!notity) {
          const res = await kernel.removeOrExitOfTeam({
            id: this.id,
            subId: member.id,
          });
          if (!res.success) return false;
          this.sendTargetNotity(OperateType.Remove, member, member.id);
          this.notifySession(false, [member]);
        }
        this.members = this.members.filter((i) => i.id != member.id);
        this.loadMemberChats([member], false);
      }
    }
    return true;
  }
  protected async create(
    data: model.TargetModel,
    belong: boolean = false,
  ): Promise<schema.XTarget | undefined> {
    if (belong === false) {
      data.belongId = this.space.id;
    }
    data.teamCode = data.teamCode || data.code;
    data.teamName = data.teamName || data.name;
    const res = await kernel.createTarget(data);
    if (res.success && res.data?.id) {
      this.space.user.loadGivedIdentitys(true);
      return res.data;
    }
  }
  async update(data: model.TargetModel): Promise<boolean> {
    data.id = this.id;
    data.typeName = this.typeName;
    data.belongId = this.metadata.belongId;
    data.name = data.name || this.name;
    data.code = data.code || this.code;
    data.icon = data.icon || this.metadata.icon;
    data.teamName = data.teamName || data.name;
    data.teamCode = data.teamCode || data.code;
    data.remark = data.remark || this.remark;
    const res = await kernel.updateTarget(data);
    if (res.success && res.data?.id) {
      this.setMetadata(res.data);
      this.sendTargetNotity(OperateType.Update);
    }
    return res.success;
  }
  async delete(notity: boolean = false): Promise<boolean> {
    if (!notity) {
      if (this.hasRelationAuth() && this.id != this.belongId) {
        await this.sendTargetNotity(OperateType.Delete);
      }
      const res = await kernel.deleteTarget({
        id: this.id,
      });
      notity = res.success;
    }
    if (notity) {
      kernel.unSubscribe(this.key);
    }
    return notity;
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadMembers(reload);
    return true;
  }
  operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.hasRelationAuth()) {
      operates.unshift(entityOperates.Update, entityOperates.Delete);
    }
    return operates;
  }
  abstract space: IBelong;
  abstract user: IPerson;
  abstract deepLoad(reload?: boolean): Promise<void>;
  abstract createTarget(data: model.TargetModel): Promise<ITeam | undefined>;
  loadMemberChats(_newMembers: schema.XTarget[], _isAdd: boolean): void {
    this.memberChats = [];
  }
  hasRelationAuth(): boolean {
    return this.hasAuthoritys([orgAuth.RelationAuthId]);
  }
  hasAuthoritys(authIds: string[]): boolean {
    authIds = this.space.superAuth?.loadParentAuthIds(authIds) ?? authIds;
    const orgIds = [this.metadata.belongId, this.id];
    return this.user.authenticate(orgIds, authIds);
  }
  async sendTargetNotity(
    operate: OperateType,
    sub?: schema.XTarget,
    subTargetId?: string,
  ): Promise<boolean> {
    const res = await kernel.dataNotify({
      data: {
        operate,
        target: this.metadata,
        subTarget: sub,
        operater: this.user.metadata,
      },
      flag: 'target',
      onlineOnly: true,
      belongId: this.belongId,
      relations: this.relations,
      onlyTarget: false,
      ignoreSelf: false,
      subTargetId: subTargetId,
      targetId: this.id,
    });
    return res.success;
  }

  async _receiveTarget(data: model.TargetOperateModel) {
    let message = '';
    switch (data.operate) {
      case OperateType.Delete:
        message = `${data.operater.name}将${data.target.name}删除.`;
        this.delete(true);
        break;
      case OperateType.Update:
        message = `${data.operater.name}将${data.target.name}信息更新.`;
        this.setMetadata(data.target);
        break;
      case OperateType.Remove:
        if (data.subTarget) {
          if (this.id == data.target.id && data.subTarget.id != this.space.id) {
            if (this.memberTypes.includes(data.subTarget.typeName as TargetType)) {
              message = `${data.operater.name}把${data.subTarget.name}从${data.target.name}移除.`;
              await this.removeMembers([data.subTarget], true);
            }
          } else {
            message = await this._removeJoinTarget(data.target);
          }
        }
        break;
      case OperateType.Add:
        if (data.subTarget) {
          if (this.id == data.target.id) {
            if (this.memberTypes.includes(data.subTarget.typeName as TargetType)) {
              message = `${data.operater.name}把${data.subTarget.name}与${data.target.name}建立关系.`;
              await this.pullMembers([data.subTarget], true);
            } else {
              message = await this._addSubTarget(data.subTarget);
            }
          } else {
            message = await this._addJoinTarget(data.target);
          }
        }
    }
    if (message.length > 0) {
      if (data.operater.id != this.user.id) {
        logger.info(message);
      }
      this.space.directory.structCallback();
      command.emitterFlag();
    }
  }
  async _removeJoinTarget(_: schema.XTarget): Promise<string> {
    await sleep(0);
    return '';
  }
  async _addSubTarget(_: schema.XTarget): Promise<string> {
    await sleep(0);
    return '';
  }
  async _addJoinTarget(_: schema.XTarget): Promise<string> {
    await sleep(0);
    return '';
  }
  async notifySession(_: boolean, __: schema.XTarget[]): Promise<void> {
    await sleep(0);
  }
}
