import { command, kernel, model, parseAvatar, schema } from '@/ts/base';
import { IBelong, Belong } from './base/belong';
import { ICohort, Cohort } from './outTeam/cohort';
import { PageAll } from '../public/consts';
import { OperateType, TargetType } from '../public/enums';
import { Company, ICompany } from './team/company';
import { ITarget } from './base/target';
import { ITeam } from './base/team';
import { IStorage, Storage } from './outTeam/storage';
import { personJoins, targetOperates } from '../public';
import { IFile } from '../thing/fileinfo';
import { ISession } from '../chat/session';
import { XObject } from '../public/object';

/** 人员类型接口 */
export interface IPerson extends IBelong {
  /** 加入/管理的单位 */
  companys: ICompany[];
  /** 赋予人的身份(角色)实体 */
  givedIdentitys: schema.XIdProof[];
  /** 用户缓存对象 */
  cacheObj: XObject<schema.Xbase>;
  /** 个人常用文件 */
  commons: schema.XCommon[];
  /** 拷贝的文件 */
  copyFiles: Map<string, IFile>;
  /** 更新常用 */
  updateCommons(datas: schema.XCommon[]): Promise<boolean>;
  /** 常用设置 */
  toggleCommon(data: schema.XCommon, set: boolean): Promise<boolean>;
  /** 根据ID查询共享信息 */
  findShareById(id: string): model.ShareIcon;
  /** 根据Id查询共享信息 */
  findEntityAsync(id: string): Promise<schema.XEntity | undefined>;
  /** 判断是否拥有某些用户的权限 */
  authenticate(orgIds: string[], authIds: string[]): boolean;
  /** 加载赋予人的身份(角色)实体 */
  loadGivedIdentitys(reload?: boolean): Promise<schema.XIdProof[]>;
  /** 赋予身份 */
  giveIdentity(identitys: schema.XIdentity[], teamId?: string): void;
  /** 移除赋予人的身份(角色) */
  removeGivedIdentity(identityIds: string[], teamId?: string): void;
  /** 创建单位 */
  createCompany(data: model.TargetModel): Promise<ICompany | undefined>;
  /** 搜索用户 */
  searchTargets(filter: string, typeNames: string[]): Promise<schema.XTarget[]>;
}

/** 人员类型实现 */
export class Person extends Belong implements IPerson {
  constructor(_metadata: schema.XTarget) {
    super(_metadata, []);
    this.copyFiles = new Map();
    this.cacheObj = new XObject(_metadata, 'target-cache', [], [this.key]);
  }

  companys: ICompany[] = [];
  commons: schema.XCommon[] = [];
  cacheObj: XObject<schema.Xbase>;
  givedIdentitys: schema.XIdProof[] = [];
  copyFiles: Map<string, IFile>;
  private _cohortLoaded: boolean = false;
  private _givedIdentityLoaded: boolean = false;

  async loadGivedIdentitys(reload: boolean = false): Promise<schema.XIdProof[]> {
    if (!this._givedIdentityLoaded || reload) {
      const res = await kernel.queryGivedIdentitys();
      if (res.success) {
        this._givedIdentityLoaded = true;
        this.givedIdentitys = res.data?.result || [];
      }
    }
    return this.givedIdentitys;
  }

  giveIdentity(identitys: schema.XIdentity[], teamId: string = ''): void {
    for (const identity of identitys) {
      if (
        !this.givedIdentitys.some(
          (a) => a.identityId == identity.id && a.teamId == teamId,
        )
      ) {
        this.givedIdentitys.push({
          ...identity,
          identity: identity,
          teamId: teamId || '',
          identityId: identity.id,
          targetId: this.id,
          target: this.metadata,
        });
      }
    }
  }

  removeGivedIdentity(identityIds: string[], teamId?: string): void {
    let idProofs = this.givedIdentitys.filter((a) => identityIds.includes(a.identityId));
    if (teamId) {
      idProofs = idProofs.filter((a) => a.teamId == teamId);
    } else {
      idProofs = idProofs.filter((a) => (a.teamId?.length ?? 0) < 10);
    }
    this.givedIdentitys = this.givedIdentitys.filter((a) =>
      idProofs.every((i) => i.identityId !== a.identityId),
    );
  }
  async loadTeams(reload?: boolean | undefined): Promise<ICohort[]> {
    if (!this._cohortLoaded || reload) {
      const res = await kernel.queryJoinedTargetById({
        id: this.id,
        typeNames: [TargetType.Cohort, TargetType.Storage, TargetType.Company],
        page: PageAll,
      });
      if (res.success) {
        this._cohortLoaded = true;
        this.cohorts = [];
        this.storages = [];
        this.companys = [];
        (res.data.result || []).forEach((i) => {
          switch (i.typeName) {
            case TargetType.Cohort:
              this.cohorts.push(new Cohort(i, this, i.id));
              break;
            case TargetType.Storage:
              this.storages.push(new Storage(i, [], this));
              break;
            default:
              this.companys.push(new Company(i, this));
          }
        });
      }
    }
    return this.cohorts;
  }

  async createCompany(data: model.TargetModel): Promise<ICompany | undefined> {
    data.public = false;
    data.typeName = TargetType.Company;
    data.teamCode = data.teamCode || data.code;
    data.teamName = data.teamName || data.name;
    const res = await this.create(data, true);
    if (res && res.id) {
      const company = new Company(res, this);
      this.companys.push(company);
      await company.pullMembers([this.metadata]);
      await company.deepLoad();
      return company;
    }
  }

  async createStorage(data: model.TargetModel): Promise<IStorage | undefined> {
    data.typeName = TargetType.Storage;
    const metadata = await this.create(data);
    if (metadata) {
      const storage = new Storage(metadata, [], this);
      this.storages.push(storage);
      await storage.pullMembers([this.user.metadata]);
      await storage.deepLoad();
      return storage;
    }
  }

  async createTarget(data: model.TargetModel): Promise<ITeam | undefined> {
    switch (data.typeName) {
      case TargetType.Cohort:
        return this.createCohort(data);
      case TargetType.Storage:
        return this.createStorage(data);
      default:
        return this.createCompany(data);
    }
  }

  authenticate(orgIds: string[], authIds: string[]): boolean {
    return (
      this.givedIdentitys
        .filter((i) => i.identity)
        .filter((i) => orgIds.includes(i.identity!.shareId))
        .filter((i) => authIds.includes(i.identity!.authId)).length > 0
    );
  }

  async applyJoin(members: schema.XTarget[]): Promise<boolean> {
    members = members.filter(
      (i) =>
        [
          TargetType.Person,
          TargetType.Cohort,
          TargetType.Storage,
          TargetType.Company,
        ].includes(i.typeName as TargetType) && i.id != this.id,
    );
    for (const member of members) {
      if (member.typeName === TargetType.Person) {
        await super.pullMembers([member]);
      }
      await kernel.applyJoinTeam({
        id: member.id,
        subId: this.id,
      });
    }
    return true;
  }

  async searchTargets(filter: string, typeNames: string[]): Promise<schema.XTarget[]> {
    const res = await kernel.searchTargets({
      name: filter,
      typeNames: typeNames,
      page: PageAll,
    });
    if (res.success) {
      return res.data.result || [];
    }
    return [];
  }

  async exit(): Promise<boolean> {
    return false;
  }

  override async delete(notity: boolean = false): Promise<boolean> {
    if (notity) {
      // TODO 退出
    } else {
      await this.sendTargetNotity(OperateType.Remove, this.metadata, this.id);
      const res = await kernel.deleteTarget({
        id: this.id,
      });
      return res.success;
    }
    return true;
  }

  get subTarget(): ITarget[] {
    return [];
  }

  get shareTarget(): ITarget[] {
    return [this, ...this.cohorts];
  }

  get parentTarget(): ITarget[] {
    return [...this.cohorts, ...this.companys];
  }

  get chats(): ISession[] {
    const chats: ISession[] = [this.session];
    chats.push(...this.cohortChats);
    chats.push(...this.memberChats);
    return chats;
  }

  get cohortChats(): ISession[] {
    const chats: ISession[] = [];
    const companyChatIds: string[] = [];
    this.companys.forEach((company) => {
      company.cohorts.forEach((item) => {
        companyChatIds.push(item.session.chatdata.fullId);
      });
    });
    for (const item of this.cohorts) {
      if (!companyChatIds.includes(item.session.chatdata.fullId)) {
        chats.push(...item.chats);
      }
    }
    return chats;
  }

  get targets(): ITarget[] {
    const targets: ITarget[] = [this, ...this.storages];
    for (const item of this.cohorts) {
      targets.push(...item.targets);
    }
    return targets;
  }

  async deepLoad(reload: boolean = false): Promise<void> {
    await this.cacheObj.all();
    await this._loadCommons();
    await Promise.all([
      this.loadTeams(reload),
      this.loadMembers(reload),
      this.loadSuperAuth(reload),
      this.loadIdentitys(reload),
      this.loadGivedIdentitys(reload),
    ]);
    await Promise.all(this.companys.map((company) => company.deepLoad(reload)));
    await Promise.all(this.cohorts.map((cohort) => cohort.deepLoad(reload)));
    await Promise.all(this.storages.map((storage) => storage.deepLoad(reload)));
    this.superAuth?.deepLoad(reload);
    this.directory.loadDirectoryResource(reload);
  }

  override operates(): model.OperateModel[] {
    const operates = super.operates().filter((i) => i.cmd != 'hardDelete');
    operates.unshift(
      ...personJoins.menus,
      targetOperates.JoinStorage,
      targetOperates.NewCompany,
      targetOperates.NewStorage,
    );
    return operates;
  }

  content(): IFile[] {
    return [...this.cohorts, ...this.storages];
  }
  findShareById(id: string): model.ShareIcon {
    const metadata = this.findMetadata<schema.XEntity>(id);
    if (metadata === undefined) {
      this.findEntityAsync(id);
    }
    return {
      name: metadata?.name ?? '请稍后...',
      typeName: metadata?.typeName ?? '未知',
      avatar: parseAvatar(metadata?.icon),
    };
  }

  async toggleCommon(data: schema.XCommon, set: boolean): Promise<boolean> {
    if (set) {
      this.commons.unshift(data);
    } else {
      this.commons = this.commons.filter(
        (i) => !(i.id === data.id && i.spaceId === data.spaceId),
      );
    }
    if (await this.cacheObj.set('commons', this.commons)) {
      await this.cacheObj.notity('commons', this.commons, true, false);
      return true;
    }
    return false;
  }

  async updateCommons(datas: schema.XCommon[]): Promise<boolean> {
    if (this.commons.length < 1) return false;
    this.commons = datas;
    if (await this.cacheObj.set('commons', this.commons)) {
      await this.cacheObj.notity('commons', this.commons, true, false);
      return true;
    }
    return false;
  }

  override async _removeJoinTarget(target: schema.XTarget): Promise<string> {
    var find = [...this.cohorts, ...this.companys, ...this.storages].find(
      (i) => i.id === target.id,
    );
    if (find) {
      await find.delete(true);
      return `您已被从${target.name}移除.`;
    }
    return '';
  }

  override async _addJoinTarget(target: schema.XTarget): Promise<string> {
    switch (target.typeName) {
      case TargetType.Cohort:
        if (this.cohorts.every((i) => i.id != target.id)) {
          const cohort = new Cohort(target, this, target.id);
          await cohort.deepLoad();
          this.cohorts.push(cohort);
          return `您已成功加入到${target.name}.`;
        }
        break;
      case TargetType.Storage:
        if (this.storages.every((i) => i.id != target.id)) {
          const storage = new Storage(target, [], this);
          await storage.deepLoad();
          this.storages.push(storage);
          return `您已成功加入到${target.name}.`;
        }
        break;
      case TargetType.Company:
        if (this.companys.every((i) => i.id != target.id)) {
          const company = new Company(target, this);
          await company.deepLoad();
          this.companys.push(company);
          return `您已成功加入到${target.name}.`;
        }
        break;
    }
    return '';
  }

  async _loadCommons(): Promise<void> {
    const data = await this.cacheObj.get<schema.XCommon[]>('commons');
    if (data && Array.isArray(data) && data.length > 0) {
      this.commons = data;
    }
    this.cacheObj.subscribe('commons', (res: schema.XCommon[]) => {
      if (res && Array.isArray(res)) {
        this.commons = res;
        command.emitterFlag('commons', true);
      }
    });
  }
}
