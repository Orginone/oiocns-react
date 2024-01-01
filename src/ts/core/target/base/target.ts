import { schema, model, kernel } from '../../../base';
import { IIdentity, Identity } from '../identity/identity';
import { MessageType, OperateType, TargetType } from '../../public/enums';
import { PageAll } from '../../public/consts';
import { ITeam, Team } from './team';
import { targetOperates } from '../../public';
import { Directory, IDirectory } from '../../thing/directory';
import { IFile, IFileInfo } from '../../thing/fileinfo';
import { DataResource } from '../../thing/resource';
import { ISession, Session } from '../../chat/session';
import { IPerson } from '../person';
import { logger, sleep } from '@/ts/base/common';
import { IBelong } from './belong';
import { MemberDirectory } from './member';

/** 用户抽象接口类 */
export interface ITarget extends ITeam, IFileInfo<schema.XTarget> {
  /** 会话 */
  session: ISession;
  /** 用户资源 */
  resource: DataResource;
  /** 用户设立的身份(角色) */
  identitys: IIdentity[];
  /** 子用户 */
  subTarget: ITarget[];
  /** 所有相关用户 */
  targets: ITarget[];
  /** 用户相关的所有会话 */
  chats: ISession[];
  /** 当前目录 */
  directory: IDirectory;
  /** 成员目录 */
  memberDirectory: IDirectory;
  /** 退出用户群 */
  exit(): Promise<boolean>;
  /** 加载用户设立的身份(角色)对象 */
  loadIdentitys(reload?: boolean): Promise<IIdentity[]>;
  /** 为用户设立身份 */
  createIdentity(data: model.IdentityModel): Promise<IIdentity | undefined>;
  /** 发送身份变更通知 */
  sendIdentityChangeMsg(data: any): Promise<boolean>;
}

/** 用户基类实现 */
export abstract class Target extends Team implements ITarget {
  constructor(
    _keys: string[],
    _metadata: schema.XTarget,
    _relations: string[],
    _space?: IBelong,
    _user?: IPerson,
    _memberTypes: TargetType[] = [TargetType.Person],
  ) {
    super(_keys, _metadata, _relations, _memberTypes);
    if (_space) {
      this.space = _space;
    } else {
      this.space = this as unknown as IBelong;
    }
    if (_user) {
      this.user = _user;
    } else {
      this.user = this as unknown as IPerson;
    }
    this.cache = { fullId: `${_metadata.belongId}_${_metadata.id}` };
    this.resource = new DataResource(_metadata, _relations, [this.key]);
    this.directory = new Directory(
      {
        ..._metadata,
        shareId: _metadata.id,
        id: _metadata.id + '_',
        typeName: '目录',
      } as unknown as schema.XDirectory,
      this,
    );
    this.memberDirectory = new MemberDirectory(this);
    this.session = new Session(this.id, this, _metadata);
    setTimeout(
      async () => {
        await this.loadUserData(_keys, _metadata);
      },
      this.id === this.userId ? 100 : 0,
    );
  }
  user: IPerson;
  space: IBelong;
  session: ISession;
  directory: IDirectory;
  resource: DataResource;
  cache: schema.XCache;
  identitys: IIdentity[] = [];
  memberDirectory: IDirectory;
  canDesign: boolean = false;
  get spaceId(): string {
    return this.space.id;
  }
  get locationKey(): string {
    return this.id;
  }
  get cachePath(): string {
    return `targets.${this.cache.fullId}`;
  }
  get isInherited(): boolean {
    return this.metadata.belongId !== this.spaceId;
  }
  get isContainer(): boolean {
    return true;
  }
  get superior(): IFile {
    return this.space;
  }
  private _identityLoaded: boolean = false;
  async restore(): Promise<boolean> {
    await sleep(0);
    return true;
  }
  async loadUserData(keys: string[], _metadata: schema.XTarget): Promise<void> {
    kernel.subscribe(
      `${_metadata.belongId}-${_metadata.id}-identity`,
      keys,
      (data: any) => this._receiveIdentity(data),
    );
    const data = await this.user.cacheObj.get<schema.XCache>(this.cachePath);
    if (data && data.fullId === this.cache.fullId) {
      this.cache = data;
    }
    this.user.cacheObj.subscribe(this.cachePath, (data: schema.XCache) => {
      if (data && data.fullId === this.cache.fullId) {
        this.cache = data;
        this.user.cacheObj.setValue(this.cachePath, data);
        this.directory.changCallback();
      }
    });
  }

  async cacheUserData(notify: boolean = true): Promise<boolean> {
    const success = await this.user.cacheObj.set(this.cachePath, this.cache);
    if (success && notify) {
      await this.user.cacheObj.notity(this.cachePath, this.cache, true, true);
    }
    return success;
  }

  async loadIdentitys(reload?: boolean | undefined): Promise<IIdentity[]> {
    if (!this._identityLoaded || reload) {
      const res = await kernel.queryTargetIdentitys({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this._identityLoaded = true;
        this.identitys = (res.data.result || []).map((item) => {
          return new Identity(item, this);
        });
      }
    }
    return this.identitys;
  }
  async createIdentity(data: model.IdentityModel): Promise<IIdentity | undefined> {
    data.shareId = this.id;
    const res = await kernel.createIdentity(data);
    if (res.success && res.data?.id) {
      const identity = new Identity(res.data, this);
      this.identitys.push(identity);
      identity._sendIdentityChangeMsg(OperateType.Create, this.metadata);
      return identity;
    }
  }
  override operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.session.isMyChat) {
      operates.unshift(targetOperates.Chat);
    }
    if (this.members.some((i) => i.id === this.userId)) {
      // operates.unshift(memberOperates.Exit);
    }
    return operates;
  }
  protected async pullSubTarget(team: ITeam): Promise<boolean> {
    const res = await kernel.pullAnyToTeam({
      id: this.id,
      subIds: [team.id],
    });
    if (res.success) {
      await this.sendTargetNotity(OperateType.Add, team.metadata);
    }
    return res.success;
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await super.loadContent(reload);
    await this.loadIdentitys(reload);
    return true;
  }
  async rename(name: string): Promise<boolean> {
    return this.update({
      ...this.metadata,
      name: name,
      teamCode: this.code,
      teamName: this.name,
    });
  }
  copy(_destination: IDirectory): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  move(_destination: IDirectory): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  abstract exit(): Promise<boolean>;
  abstract get chats(): ISession[];
  abstract get targets(): ITarget[];
  abstract get subTarget(): ITarget[];
  content(): IFile[] {
    return [];
  }
  createTarget(_data: model.TargetModel): Promise<ITeam | undefined> {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
  override async notifySession(pull: boolean, members: schema.XTarget[]): Promise<void> {
    if (this.id != this.userId && this.typeName !== '存储资源') {
      for (const member of members) {
        if (member.typeName === TargetType.Person) {
          if (pull) {
            await this.session.sendMessage(
              MessageType.Notify,
              `${this.user.name} 邀请 ${member.name} 加入群聊`,
              [],
            );
          } else {
            await this.session.sendMessage(
              MessageType.Notify,
              `${this.user.name} 将 ${member.name} 移出群聊`,
              [],
            );
          }
        }
      }
    }
  }
  async sendIdentityChangeMsg(data: any): Promise<boolean> {
    const res = await kernel.dataNotify({
      data: data,
      flag: 'identity',
      onlineOnly: true,
      belongId: this.metadata.belongId,
      relations: this.relations,
      onlyTarget: false,
      ignoreSelf: true,
      targetId: this.metadata.id,
    });
    return res.success;
  }
  private async _receiveIdentity(data: model.IdentityOperateModel) {
    let message = '';
    switch (data.operate) {
      case OperateType.Create:
        message = `${data.operater.name}新增身份【${data.identity.name}】.`;
        if (this.identitys.every((q) => q.id !== data.identity.id)) {
          this.identitys.push(new Identity(data.identity, this));
        }
        break;
      case OperateType.Delete:
        message = `${data.operater.name}将身份【${data.identity.name}】删除.`;
        await this.identitys.find((a) => a.id == data.identity.id)?.delete(true);
        break;
      case OperateType.Update:
        message = `${data.operater.name}将身份【${data.identity.name}】信息更新.`;
        this.updateMetadata(data.identity);
        break;
      case OperateType.Remove:
        if (data.subTarget) {
          message = `${data.operater.name}移除赋予【${data.subTarget!.name}】的身份【${
            data.identity.name
          }】.`;
          await this.identitys
            .find((a) => a.id == data.identity.id)
            ?.removeMembers([data.subTarget], true);
        }
        break;
      case OperateType.Add:
        if (data.subTarget) {
          message = `${data.operater.name}赋予{${data.subTarget!.name}身份【${
            data.identity.name
          }】.`;
          await this.identitys
            .find((a) => a.id == data.identity.id)
            ?.pullMembers([data.subTarget], true);
        }
        break;
    }
    if (message.length > 0) {
      if (data.operater?.id != this.user.id) {
        logger.info(message);
      }
      this.changCallback();
      this.directory.changCallback();
    }
  }
}
