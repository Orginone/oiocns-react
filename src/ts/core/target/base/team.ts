import { schema, kernel, model, parseAvatar } from '../../../base';
import { TargetType } from '../../public/enums';
import { PageAll } from '../../public/consts';
import { IBelong } from './belong';
import { IMsgChat, MsgChat } from '../../chat/message/msgchat';
import { IWorkItem } from '../../thing/app/work/workitem';

/** 团队抽象接口类 */
export interface ITeam extends IMsgChat {
  /** 加载用户的自归属用户 */
  space: IBelong;
  /** 数据实体 */
  metadata: schema.XTarget;
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
  delete(): Promise<boolean>;
  /** 用户拉入新成员 */
  pullMembers(members: schema.XTarget[]): Promise<boolean>;
  /** 用户移除成员 */
  removeMembers(members: schema.XTarget[]): Promise<boolean>;
  /** 加载成员会话 */
  loadMemberChats(newMembers: schema.XTarget[], _isAdd: boolean): void;
  /** 判断是否拥有某些权限 */
  hasAuthoritys(authIds: string[]): boolean;
}

/** 团队基类实现 */
export abstract class Team extends MsgChat implements ITeam {
  constructor(
    _metadata: schema.XTarget,
    _labels: string[],
    _space?: IBelong,
    _memberTypes: TargetType[] = [TargetType.Person],
  ) {
    super(
      _metadata.belongId,
      _metadata.id,
      {
        name: _metadata.name,
        typeName: _metadata.typeName,
        avatar: parseAvatar(_metadata.icon),
      },
      _labels,
      _metadata.remark,
    );
    this.metadata = _metadata;
    this.memberTypes = _memberTypes;
    this.space = _space || (this as unknown as IBelong);
  }
  space: IBelong;
  metadata: schema.XTarget;
  memberTypes: TargetType[];
  private _memberLoaded: boolean = false;
  async loadMembers(reload: boolean = false): Promise<schema.XTarget[]> {
    if (!this._memberLoaded || reload) {
      const res = await kernel.querySubTargetById({
        id: this.metadata.id,
        subTypeNames: this.memberTypes,
        page: PageAll,
      });
      if (res.success) {
        this._memberLoaded = true;
        this.members = res.data.result || [];
        this.loadMemberChats(this.members, true);
      }
    }
    return this.members;
  }
  async pullMembers(members: schema.XTarget[]): Promise<boolean> {
    members = members
      .filter((i) => this.memberTypes.includes(i.typeName as TargetType))
      .filter((i) => {
        return this.members.filter((m) => m.id === i.id).length < 1;
      });
    if (members.length > 0) {
      const res = await kernel.pullAnyToTeam({
        id: this.metadata.id,
        subIds: members.map((i) => i.id),
      });
      if (res.success) {
        this.members.push(...members);
        this.loadMemberChats(members, true);
      }
      return res.success;
    }
    return true;
  }
  async removeMembers(members: schema.XTarget[]): Promise<boolean> {
    for (const member of members) {
      if (this.memberTypes.includes(member.typeName as TargetType)) {
        const res = await kernel.removeOrExitOfTeam({
          id: this.metadata.id,
          subId: member.id,
        });
        if (res.success) {
          this.members = this.members.filter((i) => i.id != member.id);
          this.loadMemberChats([member], false);
        }
      }
    }
    return true;
  }
  protected async create(data: model.TargetModel): Promise<schema.XTarget | undefined> {
    data.belongId = this.space.metadata.id;
    data.teamCode = data.teamCode || data.code;
    data.teamName = data.teamName || data.name;
    const res = await kernel.createTarget(data);
    if (res.success && res.data?.id) {
      return res.data;
    }
  }
  async update(data: model.TargetModel): Promise<boolean> {
    data.id = this.metadata.id;
    data.typeName = this.metadata.typeName;
    data.belongId = this.metadata.belongId;
    data.name = data.name || this.metadata.name;
    data.code = data.code || this.metadata.code;
    data.icon = data.icon || this.metadata.icon;
    data.teamName = data.teamName || data.name;
    data.teamCode = data.teamCode || data.code;
    data.remark = data.remark || this.metadata.remark;
    const res = await kernel.updateTarget(data);
    if (res.success && res.data?.id) {
      this.metadata = res.data;
      this.share = {
        name: this.metadata.name,
        typeName: this.metadata.typeName,
        avatar: parseAvatar(this.metadata.icon),
      };
    }
    return res.success;
  }
  abstract get chats(): IMsgChat[];
  abstract delete(): Promise<boolean>;
  abstract deepLoad(reload?: boolean): Promise<void>;
  abstract createTarget(data: model.TargetModel): Promise<ITeam | undefined>;
  loadMemberChats(_newMembers: schema.XTarget[], _isAdd: boolean): void {
    this.memberChats = [];
  }
  hasAuthoritys(authIds: string[]): boolean {
    authIds = this.space.superAuth?.loadParentAuthIds(authIds) ?? authIds;
    const orgIds = [this.metadata.belongId, this.metadata.id];
    return this.space.user.authenticate(orgIds, authIds);
  }
}
