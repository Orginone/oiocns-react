import { logger } from '@/ts/base/common';
import { kernel, model, schema } from '../../../base';
import { Entity, IEntity, OperateType } from '../../public';
import { IDirectory } from '../../thing/directory';
import { IBelong } from '../base/belong';

/** 权限接口 */
export interface IAuthority extends IEntity<schema.XAuthority> {
  /** 加载归属组织 */
  space: IBelong;
  /** 拥有该权限的成员 */
  members: schema.XTarget[];
  /** 父级权限 */
  parent: IAuthority | undefined;
  /** 子级权限 */
  children: IAuthority[];
  /** 深加载 */
  deepLoad(reload?: boolean): Promise<void>;
  /** 加载成员用户实体 */
  loadMembers(reload?: boolean): Promise<schema.XTarget[]>;
  /** 创建权限 */
  create(data: schema.XAuthority, notity?: boolean): Promise<IAuthority | undefined>;
  /** 更新权限 */
  update(data: schema.XAuthority): Promise<boolean>;
  /** 删除权限 */
  delete(notity?: boolean): Promise<boolean>;
  /** 根据权限id查找权限实例 */
  findAuthById(authId: string, auth?: IAuthority): IAuthority | undefined;
  /** 根据权限获取所有父级权限Id */
  loadParentAuthIds(authIds: string[]): string[];
  /** 判断是否拥有某些权限 */
  hasAuthoritys(authIds: string[]): boolean;
  /** 接受职权变更消息 */
  receiveAuthority(data: model.AuthorityOperateModel): Promise<boolean>;
}

/** 权限实现类 */
export class Authority extends Entity<schema.XAuthority> implements IAuthority {
  constructor(_metadata: schema.XAuthority, _space: IBelong, _parent?: IAuthority) {
    super({ ..._metadata, typeName: '权限' }, []);
    this.space = _space;
    this.parent = _parent;
    for (const node of _metadata.nodes || []) {
      this.children.push(new Authority(node, _space, this));
    }
    this.directory = _space.directory;
  }
  space: IBelong;
  members: schema.XTarget[] = [];
  parent: IAuthority | undefined;
  children: IAuthority[] = [];
  directory: IDirectory;
  private _memberLoaded: boolean = false;
  async loadMembers(reload: boolean = false): Promise<schema.XTarget[]> {
    if (!this._memberLoaded || reload) {
      const res = await kernel.queryAuthorityTargets({
        id: this.id,
        subId: this.space.metadata.belongId,
      });
      if (res.success) {
        this._memberLoaded = true;
        this.members = res.data.result || [];
      }
    }
    return this.members;
  }
  async create(
    data: schema.XAuthority,
    notity: boolean = false,
  ): Promise<IAuthority | undefined> {
    if (!notity) {
      const res = await kernel.createAuthority({ ...data, parentId: this.id });
      if (!res.success) return;
      data = res.data;
      await this.space.sendAuthorityChangeMsg(OperateType.Create, res.data);
    }
    const authority = new Authority(data, this.space, this);
    this.children.push(authority);
    return authority;
  }
  async update(data: schema.XAuthority): Promise<boolean> {
    data.id = this.id;
    data.shareId = this.metadata.shareId;
    data.parentId = this.metadata.parentId;
    data.name = data.name || this.name;
    data.code = data.code || this.code;
    data.icon = data.icon || this.metadata.icon;
    data.remark = data.remark || this.remark;
    const res = await kernel.updateAuthority(data);
    if (res.success && res.data?.id) {
      res.data.typeName = '权限';
      this.setMetadata(res.data);
      await this.space.sendAuthorityChangeMsg(OperateType.Update, res.data);
    }
    return res.success;
  }
  async delete(notity: boolean = false): Promise<boolean> {
    if (!notity) {
      const res = await kernel.deleteAuthority({
        id: this.id,
      });
      if (!res.success) return false;
      await this.space.sendAuthorityChangeMsg(OperateType.Delete, this.metadata);
    }
    if (this.parent) {
      this.parent.children = this.parent.children.filter((i) => i.key != this.key);
    }
    return true;
  }
  loadParentAuthIds(authIds: string[]): string[] {
    const result: string[] = [];
    for (const authId of authIds) {
      const auth = this.findAuthById(authId);
      if (auth) {
        this._appendParentId(auth, result);
      }
    }
    return result;
  }
  findAuthById(authId: string, auth?: IAuthority): IAuthority | undefined {
    auth = auth || this.space.superAuth!;
    if (auth.id === authId) {
      return auth;
    } else {
      for (const item of auth.children) {
        const find = this.findAuthById(authId, item);
        if (find) {
          return find;
        }
      }
    }
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadMembers(reload);
    await Promise.all(
      this.children.map(async (item) => {
        await item.deepLoad(reload);
      }),
    );
  }
  hasAuthoritys(authIds: string[]): boolean {
    authIds = this.loadParentAuthIds(authIds);
    const orgIds = [this.metadata.belongId];
    if (this.metadata.shareId && this.metadata.shareId.length > 0) {
      orgIds.push(this.metadata.shareId);
    }
    return this.space.user.authenticate(orgIds, authIds);
  }
  private _appendParentId(auth: IAuthority, authIds: string[]) {
    if (!authIds.includes(auth.id)) {
      authIds.push(auth.id);
    }
    if (auth.parent) {
      this._appendParentId(auth.parent, authIds);
    }
  }
  async receiveAuthority(data: model.AuthorityOperateModel): Promise<boolean> {
    let message = '';
    if (this.id == data.authority.parentId && data.operate == OperateType.Create) {
      message = `${data.operater?.name}新增权限【${data.authority.name}】.`;
      await this.create(data.authority, true);
    } else if (this.id == data.authority.id) {
      switch (data.operate) {
        case OperateType.Delete:
          message = `${data.operater?.name}将权限【${data.authority.name}】删除.`;
          await this.delete(true);
          break;
        case OperateType.Update:
          message = `${data.operater?.name}将权限【${data.authority.name}】信息更新.`;
          this.updateMetadata(data.authority);
          break;
        default:
          break;
      }
    } else {
      for (const child of this.children) {
        if (await child.receiveAuthority(data)) {
          return true;
        }
      }
    }
    if (message.length > 0) {
      if (data.operater?.id != this.space.user.id) {
        logger.info(message);
      }
      return true;
    }
    return false;
  }
}
