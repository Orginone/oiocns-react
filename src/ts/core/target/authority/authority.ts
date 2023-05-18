import { kernel, model, parseAvatar, schema } from '../../../base';
import { IMsgChat, MsgChat } from '../../chat/message/msgchat';
import { PageAll } from '../../public/consts';
import { IBelong } from '../base/belong';

/** 权限接口 */
export interface IAuthority extends IMsgChat {
  /** 唯一标识 */
  id: string;
  /** 数据实体 */
  metadata: schema.XAuthority;
  /** 拥有该权限的成员 */
  members: schema.XTarget[];
  /** 父级权限 */
  parent: IAuthority | undefined;
  /** 子级权限 */
  children: IAuthority[];
  /** 用户相关的所有会话 */
  chats: IMsgChat[];
  /** 深加载 */
  deepLoad(reload?: boolean): Promise<void>;
  /** 加载成员用户实体 */
  loadMembers(reload?: boolean): Promise<schema.XTarget[]>;
  /** 创建权限 */
  create(data: model.AuthorityModel): Promise<IAuthority | undefined>;
  /** 更新权限 */
  update(data: model.AuthorityModel): Promise<boolean>;
  /** 删除权限 */
  delete(): Promise<boolean>;
  /** 根据权限id查找权限实例 */
  findAuthById(authId: string, auth?: IAuthority): IAuthority | undefined;
  /** 根据权限获取所有父级权限Id */
  loadParentAuthIds(authIds: string[]): string[];
  /** 判断是否拥有某些权限 */
  hasAuthoritys(authIds: string[]): boolean;
}

/** 权限实现类 */
export class Authority extends MsgChat implements IAuthority {
  constructor(_metadata: schema.XAuthority, _space: IBelong, _parent?: IAuthority) {
    super(
      _space.id,
      _metadata.id,
      {
        name: _metadata.name,
        typeName: '权限',
        avatar: parseAvatar(_metadata.icon),
      },
      [_space.metadata.name ?? '', '角色群'],
      _metadata.remark,
      _space,
    );
    this.space = _space;
    this.parent = _parent;
    this.metadata = _metadata;
    for (const node of _metadata.nodes || []) {
      this.children.push(new Authority(node, _space, this));
    }
  }
  space: IBelong;
  metadata: schema.XAuthority;
  members: schema.XTarget[] = [];
  parent: IAuthority | undefined;
  children: IAuthority[] = [];
  private _memberLoaded: boolean = false;
  get id(): string {
    return this.metadata.id;
  }
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
  async create(data: model.AuthorityModel): Promise<IAuthority | undefined> {
    data.parentId = this.id;
    const res = await kernel.createAuthority(data);
    if (res.success && res.data?.id) {
      const authority = new Authority(res.data, this.space, this);
      this.children.push(authority);
      return authority;
    }
  }
  async update(data: model.AuthorityModel): Promise<boolean> {
    data.id = this.id;
    data.shareId = this.metadata.shareId;
    data.parentId = this.metadata.parentId;
    data.name = data.name || this.metadata.name;
    data.code = data.code || this.metadata.code;
    data.icon = data.icon || this.metadata.icon;
    data.remark = data.remark || this.metadata.remark;
    const res = await kernel.updateAuthority(data);
    if (res.success && res.data?.id) {
      this.metadata = res.data;
      this.share = {
        name: this.metadata.name,
        typeName: '权限',
        avatar: parseAvatar(this.metadata.icon),
      };
    }
    return res.success;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteAuthority({
      id: this.id,
      page: PageAll,
    });
    if (res.success && this.parent) {
      this.parent.children = this.parent.children.filter((i) => i.key != this.key);
    }
    return res.success;
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
    for (const item of this.children) {
      await item.deepLoad(reload);
    }
  }
  get chats(): IMsgChat[] {
    const chats: IMsgChat[] = [this];
    for (const item of this.children) {
      chats.push(...item.chats);
    }
    return chats;
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
}
