import { schema, kernel, model } from '../../../base';
import { OperateType, TargetType } from '../../public/enums';
import { PageAll, orgAuth } from '../../public/consts';
import { IBelong } from './belong';
import { Entity, IEntity, entityOperates } from '../../public';
import { IDirectory } from '../../thing/directory';
import { ISession } from '../../chat/session';
import { IPerson } from '../person';

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
  /** 接收相关用户增加变更 */
  teamChangedNotity(target: schema.XTarget): Promise<boolean>;
  createTargetMsg(operate: OperateType, sub?: schema.XTarget): Promise<void>;
}

/** 团队基类实现 */
export abstract class Team extends Entity<schema.XTarget> implements ITeam {
  constructor(
    _metadata: schema.XTarget,
    _memberTypes: TargetType[] = [TargetType.Person],
  ) {
    super(_metadata);
    this.memberTypes = _memberTypes;
  }
  memberTypes: TargetType[];
  members: schema.XTarget[] = [];
  memberChats: ISession[] = [];
  abstract directory: IDirectory;
  private _memberLoaded: boolean = false;
  get isInherited(): boolean {
    return this.metadata.belongId != this.space.id;
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
    return this.user.authenticate(orgIds, authIds);
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
        operater: this.user.metadata,
      }),
    });
  }
}
