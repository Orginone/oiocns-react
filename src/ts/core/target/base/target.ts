import { schema, model, kernel } from '../../../base';
import { IIdentity, Identity } from '../identity/identity';
import { OperateType, TargetType } from '../../public/enums';
import { PageAll } from '../../public/consts';
import { ITeam, Team } from './team';
import { IBelong } from './belong';
import { targetOperates } from '../../public';
import { Directory, IDirectory } from '../../thing/directory';
import { IFileInfo } from '../../thing/fileinfo';
import { DataResource } from '../../thing/resource';

/** 用户抽象接口类 */
export interface ITarget extends ITeam, IFileInfo<schema.XTarget> {
  /** 用户设立的身份(角色) */
  identitys: IIdentity[];
  /** 用户资源 */
  resource: DataResource;
  /** 子用户 */
  subTarget: ITarget[];
  /** 所有相关用户 */
  targets: ITarget[];
  /** 成员目录 */
  memberDirectory: IDirectory;
  /** 退出用户群 */
  exit(): Promise<boolean>;
  /** 加载用户设立的身份(角色)对象 */
  loadIdentitys(reload?: boolean): Promise<IIdentity[]>;
  /** 为用户设立身份 */
  createIdentity(data: model.IdentityModel): Promise<IIdentity | undefined>;
}

/** 用户基类实现 */
export abstract class Target extends Team implements ITarget {
  constructor(
    _metadata: schema.XTarget,
    _labels: string[],
    _space?: IBelong,
    _memberTypes: TargetType[] = [TargetType.Person],
  ) {
    super(_metadata, _labels, _space, _memberTypes);
    this.resource = new DataResource(_metadata.belongId, _metadata.id);
    this.directory = new Directory(
      {
        ..._metadata,
        shareId: _metadata.id,
        id: _metadata.id + '_',
        typeName: '目录',
      } as unknown as schema.XDirectory,
      this,
    );
    this.memberDirectory = new Directory(
      {
        ...this.directory.metadata,
        typeName: '成员目录',
        id: _metadata.id + '__',
        name:
          _metadata.typeName === TargetType.Person
            ? '我的好友'
            : `${_metadata.typeName}成员`,
      },
      this,
      this.directory,
    );
  }
  resource: DataResource;
  directory: IDirectory;
  identitys: IIdentity[] = [];
  memberDirectory: IDirectory;
  get spaceId(): string {
    return this.space.id;
  }
  get locationKey(): string {
    return this.id;
  }
  private _identityLoaded: boolean = false;
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
      identity.createIdentityMsg(OperateType.Create, this.metadata);
      return identity;
    }
  }
  override operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.isMyChat) {
      operates.unshift(targetOperates.Chat);
    }
    return operates;
  }
  protected async pullSubTarget(team: ITeam): Promise<boolean> {
    const res = await kernel.pullAnyToTeam({
      id: this.id,
      subIds: [team.id],
    });
    if (res.success) {
      this.createTargetMsg(OperateType.Add, team.metadata);
    }
    return res.success;
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await super.loadContent(reload);
    await this.loadIdentitys(reload);
    return true;
  }
  content(_mode?: number | undefined): IFileInfo<schema.XEntity>[] {
    return [];
  }
  async rename(name: string): Promise<boolean> {
    return this.update({
      ...this.metadata,
      name: name,
      teamCode: this.metadata.team?.code ?? this.code,
      teamName: this.metadata.team?.name ?? this.name,
    });
  }
  copy(_destination: IDirectory): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  move(_destination: IDirectory): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  abstract exit(): Promise<boolean>;
  abstract get targets(): ITarget[];
  abstract get subTarget(): ITarget[];
  createTarget(_data: model.TargetModel): Promise<ITeam | undefined> {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
}
