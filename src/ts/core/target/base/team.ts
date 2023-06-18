import { schema, kernel, model } from '../../../base';
import { OperateType, TargetType } from '../../public/enums';
import { PageAll, orgAuth } from '../../public/consts';
import { IBelong } from './belong';
import { IMsgChatT, IMsgChat, MsgChat } from '../../chat/message/msgchat';
import { IFileInfo } from '../../thing/fileinfo';
import { IDirectory } from '../../thing/directory';
import { entityOperates, teamOperates } from '../../public';

/** 团队抽象接口类 */
export interface ITeam extends IMsgChatT<schema.XTarget>, IFileInfo<schema.XTarget> {
  /** 用户的目录 */
  directory: IDirectory;
  /** 限定成员类型 */
  memberTypes: TargetType[];
  /** 用户相关的所有会话 */
  chats: IMsgChat[];
  /** 深加载 */
  deepLoad(reload?: boolean): Promise<void>;
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
  /** 接收相关用户增加变更 */
  teamChangedNotity(target: schema.XTarget): Promise<boolean>;
}

/** 团队基类实现 */
export abstract class Team extends MsgChat<schema.XTarget> implements ITeam {
  constructor(
    _metadata: schema.XTarget,
    _labels: string[],
    _space?: IBelong,
    _memberTypes: TargetType[] = [TargetType.Person],
  ) {
    super(_metadata, _labels, _space, _metadata.belong);
    this.memberTypes = _memberTypes;
  }
  abstract directory: IDirectory;
  memberTypes: TargetType[];
  private _memberLoaded: boolean = false;
  get isInherited(): boolean {
    return this.metadata.belongId != this.space.id;
  }
  async rename(name: string): Promise<boolean> {
    return this.update({
      ...this.metadata,
      name: name,
      teamCode: this.metadata.team?.code ?? this.code,
      teamName: this.metadata.team?.name ?? this.name,
    });
  }
  copy(destination: IDirectory): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  move(destination: IDirectory): Promise<boolean> {
    throw new Error('暂不支持.');
  }
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
        if (res.success) {
          members.forEach((a) => {
            this.createTargetMsg(OperateType.Add, a);
          });
        }
        notity = res.success;
      }
      if (notity) {
        this.members.push(...members);
        this.loadMemberChats(members, true);
      }
      return notity;
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
          if (member.id === this.userId || this.hasRelationAuth()) {
            await this.createTargetMsg(OperateType.Remove, member);
          }
          const res = await kernel.removeOrExitOfTeam({
            id: this.id,
            subId: member.id,
          });
          if (!res.success) return false;
          notity = res.success;
        }
        if (notity) {
          this.members = this.members.filter((i) => i.id != member.id);
          this.loadMemberChats([member], false);
        }
      }
    }
    return true;
  }
  protected async create(data: model.TargetModel): Promise<schema.XTarget | undefined> {
    data.belongId = this.space.id;
    data.teamCode = data.teamCode || data.code;
    data.teamName = data.teamName || data.name;
    const res = await kernel.createTarget(data);
    if (res.success && res.data?.id) {
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
      this.createTargetMsg(OperateType.Update);
    }
    return res.success;
  }
  async delete(notity: boolean = false): Promise<boolean> {
    if (!notity) {
      if (this.hasRelationAuth()) {
        await this.createTargetMsg(OperateType.Delete);
      }
      const res = await kernel.deleteTarget({
        id: this.id,
      });
      notity = res.success;
    }
    return notity;
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.directory.loadContent(reload);
    return true;
  }
  operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.hasRelationAuth()) {
      operates.unshift(entityOperates.Update, teamOperates.Pull);
    }
    return operates;
  }
  abstract get chats(): IMsgChat[];
  abstract deepLoad(reload?: boolean): Promise<void>;
  abstract createTarget(data: model.TargetModel): Promise<ITeam | undefined>;
  abstract teamChangedNotity(target: schema.XTarget): Promise<boolean>;
  loadMemberChats(_newMembers: schema.XTarget[], _isAdd: boolean): void {
    this.memberChats = [];
  }
  hasRelationAuth(): boolean {
    return this.hasAuthoritys([orgAuth.RelationAuthId]);
  }
  hasAuthoritys(authIds: string[]): boolean {
    authIds = this.space.superAuth?.loadParentAuthIds(authIds) ?? authIds;
    const orgIds = [this.metadata.belongId, this.id];
    return this.space.user.authenticate(orgIds, authIds);
  }
  async createTargetMsg(operate: OperateType, sub?: schema.XTarget): Promise<void> {
    await kernel.createTargetMsg({
      targetId: sub && this.userId === this.id ? sub.id : this.id,
      excludeOperater: false,
      group: this.typeName === TargetType.Group,
      data: JSON.stringify({
        operate,
        target: this.metadata,
        subTarget: sub,
        operater: this.space.user.metadata,
      }),
    });
  }
}
