import { common, kernel, model, schema } from '../../../base';
import { PageAll } from '../../public/consts';
import { IBelong } from '../base/belong';

/** 身份（角色）接口 */
export interface IIdentity extends common.IEntity {
  /** 唯一标识 */
  id: string;
  /** 设置身份（角色）的用户 */
  space: IBelong;
  /** 数据实体 */
  metadata: schema.XIdentity;
  /** 赋予身份（角色）的成员用户 */
  members: schema.XTarget[];
  /** 加载成员用户实体 */
  loadMembers(reload?: boolean): Promise<schema.XTarget[]>;
  /** 身份（角色）拉入新成员 */
  pullMembers(members: schema.XTarget[]): Promise<boolean>;
  /** 身份（角色）移除成员 */
  removeMembers(members: schema.XTarget[]): Promise<boolean>;
  /** 更新身份（角色）信息 */
  update(data: model.IdentityModel): Promise<boolean>;
  /** 删除身份（角色） */
  delete(): Promise<boolean>;
}

/** 身份（角色）实现类 */
export class Identity extends common.Entity implements IIdentity {
  constructor(_metadata: schema.XIdentity, _space: IBelong) {
    super();
    this.space = _space;
    this.metadata = _metadata;
  }
  space: IBelong;
  metadata: schema.XIdentity;
  members: schema.XTarget[] = [];
  private _memberLoaded: boolean = false;
  get id(): string {
    return this.metadata.id;
  }
  async loadMembers(reload?: boolean | undefined): Promise<schema.XTarget[]> {
    if (!this._memberLoaded || reload) {
      const res = await kernel.queryIdentityTargets({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this._memberLoaded = true;
        this.members = res.data.result || [];
      }
    }
    return this.members;
  }
  async pullMembers(members: schema.XTarget[]): Promise<boolean> {
    members = members.filter((i) => {
      return this.members.filter((m) => m.id === i.id).length < 1;
    });
    if (members.length > 0) {
      const res = await kernel.giveIdentity({
        id: this.id,
        subIds: members.map((i) => i.id),
      });
      if (res.success) {
        this.members.push(...members);
      }
      return res.success;
    }
    return true;
  }
  async removeMembers(members: schema.XTarget[]): Promise<boolean> {
    const res = await kernel.removeIdentity({
      id: this.id,
      subIds: members.map((i) => i.id),
    });
    if (res.success) {
      for (const member of members) {
        this.members = this.members.filter((i) => i.id != member.id);
      }
    }
    return true;
  }
  async update(data: model.IdentityModel): Promise<boolean> {
    data.id = this.id;
    data.shareId = this.metadata.shareId;
    data.name = data.name || this.metadata.name;
    data.code = data.code || this.metadata.code;
    data.authId = data.authId || this.metadata.authId;
    data.remark = data.remark || this.metadata.remark;
    const res = await kernel.updateIdentity(data);
    if (res.success && res.data?.id) {
      this.metadata = res.data;
    }
    return res.success;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteAuthority({
      id: this.id,
      page: PageAll,
    });
    if (res.success) {
      this.space.identitys = this.space.identitys.filter((i) => i.key != this.key);
    }
    return res.success;
  }
}
