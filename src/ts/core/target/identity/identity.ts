import { kernel, model, schema } from '../../../base';
import { Entity, IEntity, OperateType, entityOperates, fileOperates } from '../../public';
import { PageAll } from '../../public/consts';
import { IDirectory } from '../../thing/directory';
import { IFile } from '../../thing/fileinfo';
import { ITarget } from '../base/target';

/** 身份（角色）接口 */
export interface IIdentity extends IEntity<schema.XIdentity> {
  /** 设置身份（角色）的用户 */
  current: ITarget;
  /** 赋予身份（角色）的成员用户 */
  members: schema.XTarget[];
  /** 加载成员用户实体 */
  loadMembers(reload?: boolean): Promise<schema.XTarget[]>;
  /** 身份（角色）拉入新成员 */
  pullMembers(members: schema.XTarget[], notity?: boolean): Promise<boolean>;
  /** 身份（角色）移除成员 */
  removeMembers(members: schema.XTarget[], notity?: boolean): Promise<boolean>;
  /** 更新身份（角色）信息 */
  update(data: model.IdentityModel): Promise<boolean>;
  /** 删除身份（角色） */
  delete(notity?: boolean): Promise<boolean>;
}

/** 身份（角色）实现类 */
export class Identity extends Entity<schema.XIdentity> implements IIdentity {
  constructor(_metadata: schema.XIdentity, current: ITarget) {
    super(
      {
        ..._metadata,
        typeName: '角色',
      },
      [],
    );
    this.current = current;
    this.directory = current.directory;
  }
  directory: IDirectory;
  async rename(name: string): Promise<boolean> {
    return await this.update({ ...this.metadata, name: name });
  }
  copy(_destination: IDirectory): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  move(_destination: IDirectory): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  current: ITarget;
  members: schema.XTarget[] = [];
  private _memberLoaded: boolean = false;
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
  async pullMembers(
    members: schema.XTarget[],
    notity: boolean = false,
  ): Promise<boolean> {
    members = members.filter((i) => this.members.every((m) => m.id !== i.id));
    if (members.length > 0) {
      if (!notity) {
        const res = await kernel.giveIdentity({
          id: this.id,
          subIds: members.map((i) => i.id),
        });
        if (!res.success) return false;
        members.forEach((a) => this._sendIdentityChangeMsg(OperateType.Add, a));
      }
      this.members.push(...members);
      if (members.find((a) => a.id === this.userId)) {
        this.current.user.giveIdentity([this.metadata]);
      }
    }
    return true;
  }
  async removeMembers(
    members: schema.XTarget[],
    notity: boolean = false,
  ): Promise<boolean> {
    members = members.filter((i) => this.members.some((m) => m.id === i.id));
    if (members.length > 0) {
      if (!notity) {
        const res = await kernel.removeIdentity({
          id: this.id,
          subIds: members.map((i) => i.id),
        });
        if (!res.success) return false;
        members.forEach((a) => this._sendIdentityChangeMsg(OperateType.Remove, a));
      }
      if (members.some((a) => a.id === this.userId)) {
        this.current.user.removeGivedIdentity([this.id]);
      }
      this.members = this.members.filter((i) => members.every((s) => s.id !== i.id));
    }
    return true;
  }
  async update(data: model.IdentityModel): Promise<boolean> {
    data.id = this.id;
    data.shareId = this.metadata.shareId;
    data.name = data.name || this.name;
    data.code = data.code || this.code;
    data.authId = data.authId || this.metadata.authId;
    data.remark = data.remark || this.remark;
    const res = await kernel.updateIdentity(data);
    if (res.success && res.data?.id) {
      res.data.typeName = '角色';
      this.setMetadata(res.data);
      this._sendIdentityChangeMsg(OperateType.Update);
    }
    return res.success;
  }
  async delete(notity: boolean = false): Promise<boolean> {
    if (!notity) {
      if (this.current.hasRelationAuth()) {
        this._sendIdentityChangeMsg(OperateType.Delete);
      }
      const res = await kernel.deleteIdentity({
        id: this.id,
      });
      if (!res.success) return false;
    }
    this.current.user.removeGivedIdentity([this.metadata.id]);
    this.current.identitys = this.current.identitys.filter((i) => i.key != this.key);
    return true;
  }
  override operates(mode: number = 0): model.OperateModel[] {
    const operates: model.OperateModel[] = [];
    if (mode % 2 === 0 && this.current.hasRelationAuth()) {
      operates.push(entityOperates.Update, fileOperates.Rename);
    }
    operates.push(...super.operates(1));
    return operates.sort((a, b) => (a.menus ? -10 : b.menus ? 10 : 0));
  }
  content(_mode?: number | undefined): IFile[] {
    return [];
  }
  async _sendIdentityChangeMsg(
    operate: OperateType,
    subTarget?: schema.XTarget,
  ): Promise<void> {
    await this.current.sendIdentityChangeMsg({
      operate,
      subTarget,
      identity: this.metadata,
      operater: this.current.user.metadata,
    });
  }
}
