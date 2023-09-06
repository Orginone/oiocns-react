import { kernel, model, parseAvatar, schema } from '@/ts/base';
import { IBelong, Belong } from './base/belong';
import { ICohort, Cohort } from './outTeam/cohort';
import { createCompany } from './team';
import { PageAll, companyTypes } from '../public/consts';
import { OperateType, TargetType } from '../public/enums';
import { ICompany } from './team/company';
import { IMsgChat } from '../chat/message/msgchat';
import { ITarget } from './base/target';
import { ITeam } from './base/team';
import { IStorage, Storage } from './outTeam/storage';
import { personJoins, targetOperates } from '../public';
import { IFileInfo } from '../thing/fileinfo';

/** 人员类型接口 */
export interface IPerson extends IBelong {
  /** 加入/管理的单位 */
  companys: ICompany[];
  /** 赋予人的身份(角色)实体 */
  givedIdentitys: schema.XIdProof[];
  /** 拷贝的文件 */
  copyFiles: Map<string, IFileInfo<schema.XEntity>>;
  /** 根据ID查询共享信息 */
  findShareById(id: string): model.ShareIcon;
  /** 根据Id查询共享信息 */
  findEntityAsync(id: string): Promise<schema.XEntity | undefined>;
  /** 判断是否拥有某些用户的权限 */
  authenticate(orgIds: string[], authIds: string[]): boolean;
  /** 加载赋予人的身份(角色)实体 */
  loadGivedIdentitys(reload?: boolean): Promise<schema.XIdProof[]>;
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
    super(_metadata, ['本人']);
    this.copyFiles = new Map();
  }
  companys: ICompany[] = [];
  givedIdentitys: schema.XIdProof[] = [];
  copyFiles: Map<string, IFileInfo<schema.XEntity>>;
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
  removeGivedIdentity(identityIds: string[], teamId?: string): void {
    let idProofs = this.givedIdentitys.filter((a) => identityIds.includes(a.identityId));
    if (teamId) {
      idProofs = idProofs.filter((a) => a.teamId == teamId);
    } else {
      idProofs = idProofs.filter((a) => a.teamId == undefined);
    }
    this.givedIdentitys = this.givedIdentitys.filter((a) =>
      idProofs.every((i) => i.id !== a.identity?.id),
    );
  }
  async loadCohorts(reload?: boolean | undefined): Promise<ICohort[]> {
    if (!this._cohortLoaded || reload) {
      const res = await kernel.queryJoinedTargetById({
        id: this.id,
        typeNames: [TargetType.Cohort, TargetType.Storage, ...companyTypes],
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
              this.cohorts.push(new Cohort(i, this));
              break;
            case TargetType.Storage:
              this.storages.push(new Storage(i, this));
              break;
            default:
              this.companys.push(createCompany(i, this));
          }
        });
      }
    }
    return this.cohorts;
  }
  async createCompany(data: model.TargetModel): Promise<ICompany | undefined> {
    if (!companyTypes.includes(data.typeName as TargetType)) {
      data.typeName = TargetType.Company;
    }
    data.public = false;
    data.teamCode = data.teamCode || data.code;
    data.teamName = data.teamName || data.name;
    const res = await kernel.createTarget(data);
    if (res.success && res.data?.id) {
      const company = createCompany(res.data, this);
      await company.deepLoad();
      this.companys.push(company);
      await company.pullMembers([this.metadata]);
      return company;
    }
  }
  async createStorage(data: model.TargetModel): Promise<IStorage | undefined> {
    data.typeName = TargetType.Storage;
    const metadata = await this.create(data);
    if (metadata) {
      const storage = new Storage(metadata, this);
      await storage.deepLoad();
      this.storages.push(storage);
      await storage.pullMembers([this.user.metadata]);
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
  async pullMembers(members: schema.XTarget[]): Promise<boolean> {
    return await this.applyJoin(members);
  }
  async applyJoin(members: schema.XTarget[]): Promise<boolean> {
    members = members.filter(
      (i) =>
        [
          TargetType.Person,
          TargetType.Cohort,
          TargetType.Storage,
          ...companyTypes,
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
  override async delete(): Promise<boolean> {
    await this.createTargetMsg(OperateType.Remove, this.metadata);
    const res = await kernel.deleteTarget({
      id: this.id,
    });
    return res.success;
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
  get chats(): IMsgChat[] {
    const chats: IMsgChat[] = [this];
    chats.push(...this.cohortChats);
    chats.push(...this.memberChats);
    return chats;
  }
  get cohortChats(): IMsgChat[] {
    const chats: IMsgChat[] = [];
    const companyChatIds: string[] = [];
    this.companys.forEach((company) => {
      company.cohorts.forEach((item) => {
        companyChatIds.push(item.chatdata.fullId);
      });
    });
    for (const item of this.cohorts) {
      if (!companyChatIds.includes(item.chatdata.fullId)) {
        chats.push(...item.chats);
      }
    }
    for (const item of this.storages) {
      chats.push(...item.chats);
    }
    if (this.superAuth) {
      chats.push(...this.superAuth.chats);
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
    await this.resource.preLoad();
    await this.directory.loadSubDirectory();
    await Promise.all([
      await this.loadGivedIdentitys(reload),
      await this.loadCohorts(reload),
      await this.loadMembers(reload),
      await this.loadSuperAuth(reload),
    ]);
    await Promise.all(
      this.companys.map(async (company) => {
        await company.deepLoad(reload);
      }),
    );
    await Promise.all(
      this.cohorts.map(async (cohort) => {
        await cohort.deepLoad(reload);
      }),
    );
    await Promise.all(
      this.storages.map(async (storage) => {
        await storage.deepLoad(reload);
      }),
    );
    this.superAuth?.deepLoad(reload);
  }
  async teamChangedNotity(target: schema.XTarget): Promise<boolean> {
    switch (target.typeName) {
      case TargetType.Cohort:
        if (this.cohorts.every((i) => i.id != target.id)) {
          const cohort = new Cohort(target, this);
          await cohort.deepLoad();
          this.cohorts.push(cohort);
          return true;
        }
        break;
      case TargetType.Storage:
        if (this.storages.every((i) => i.id != target.id)) {
          const storage = new Storage(target, this);
          await storage.deepLoad();
          this.storages.push(storage);
          return true;
        }
        break;
      default:
        if (companyTypes.includes(target.typeName as TargetType)) {
          if (this.companys.every((i) => i.id != target.id)) {
            const company = createCompany(target, this);
            await company.deepLoad();
            this.companys.push(company);
            return true;
          }
        }
    }
    return false;
  }
  override operates(): model.OperateModel[] {
    const operates = super.operates();
    operates.unshift(personJoins, targetOperates.NewCompany, targetOperates.NewStorage);
    return operates;
  }
  async findEntityAsync(id: string): Promise<schema.XEntity | undefined> {
    const metadata = this.findMetadata<schema.XEntity>(id);
    if (metadata) {
      return metadata;
    }
    const res = await kernel.queryEntityById({ id: id });
    if (res.success && res.data?.id) {
      this.updateMetadata(res.data);
      return res.data;
    }
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
}
