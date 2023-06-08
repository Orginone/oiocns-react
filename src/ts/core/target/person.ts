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

/** 人员类型接口 */
export interface IPerson extends IBelong {
  /** 加入/管理的单位 */
  companys: ICompany[];
  /** 赋予人的身份(角色)实体 */
  givedIdentitys: schema.XIdProof[];
  /** 根据ID查询共享信息 */
  findShareById(id: string): model.ShareIcon;
  /** 根据Id查询共享信息 */
  findShareAsync(id: string): Promise<model.ShareIcon | undefined>;
  /** 判断是否拥有某些用户的权限 */
  authenticate(orgIds: string[], authIds: string[]): boolean;
  /** 加载赋予人的身份(角色)实体 */
  loadGivedIdentitys(reload?: boolean): Promise<schema.XIdProof[]>;
  /** 移除赋予人的身份(角色) */
  removeGivedIdentity(identityIds: string[], teamId?: string): void;
  /** 加载单位 */
  loadCompanys(reload?: boolean): Promise<ICompany[]>;
  /** 创建单位 */
  createCompany(data: model.TargetModel): Promise<ICompany | undefined>;
  /** 搜索用户 */
  searchTargets(filter: string, typeNames: string[]): Promise<schema.XTarget[]>;
}

/** 人员类型实现 */
export class Person extends Belong implements IPerson {
  constructor(_metadata: schema.XTarget) {
    super(_metadata, ['本人']);
  }
  companys: ICompany[] = [];
  private _cohortLoaded: boolean = false;
  private _companyLoaded: boolean = false;
  givedIdentitys: schema.XIdProof[] = [];
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
        typeNames: [TargetType.Cohort],
        page: PageAll,
      });
      if (res.success) {
        this._cohortLoaded = true;
        this.cohorts = (res.data.result || []).map((i) => new Cohort(i, this));
      }
    }
    return this.cohorts;
  }
  async loadCompanys(reload?: boolean | undefined): Promise<ICompany[]> {
    if (!this._companyLoaded || reload) {
      const res = await kernel.queryJoinedTargetById({
        id: this.id,
        typeNames: companyTypes,
        page: PageAll,
      });
      if (res.success) {
        this._companyLoaded = true;
        this.companys = (res.data.result || []).map((i) => createCompany(i, this));
      }
    }
    return this.companys;
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
  async createTarget(data: model.TargetModel): Promise<ITeam | undefined> {
    switch (data.typeName) {
      case TargetType.Cohort:
        return this.createCohort(data);
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
        [TargetType.Person, TargetType.Cohort, ...companyTypes].includes(
          i.typeName as TargetType,
        ) && i.id != this.id,
    );
    for (const member of members) {
      if (member.typeName === TargetType.Person) {
        await this.pullMembers([member]);
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
      page: PageAll,
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
    if (this.superAuth) {
      chats.push(...this.superAuth.chats);
    }
    return chats;
  }
  get targets(): ITarget[] {
    const targets: ITarget[] = [this];
    for (const item of this.companys) {
      targets.push(...item.targets);
    }
    for (const item of this.cohorts) {
      targets.push(...item.targets);
    }
    return targets;
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadGivedIdentitys(reload);
    await this.loadCompanys(reload);
    await this.loadCohorts(reload);
    await this.loadMembers(reload);
    await this.loadSuperAuth(reload);
    await this.loadSpecies(reload);
    for (const company of this.companys) {
      await company.deepLoad(reload);
    }
    for (const cohort of this.cohorts) {
      await cohort.deepLoad(reload);
    }
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
  async findShareAsync(id: string): Promise<model.ShareIcon | undefined> {
    const metadata = this.findMetadata<schema.XEntity>(id);
    if (metadata) {
      return {
        name: metadata.name,
        typeName: metadata.typeName,
        avatar: parseAvatar(metadata.icon),
      };
    }
    const res = await kernel.queryTargetById({
      ids: [id],
      page: PageAll,
    });
    if (res.success && res.data.result && res.data.result.length > 0) {
      const item = res.data.result[0];
      this.updateMetadata(item);
      return {
        name: item.name,
        typeName: item.typeName,
        avatar: parseAvatar(item.icon),
      };
    }
  }
  findShareById(id: string): model.ShareIcon {
    const metadata = this.findMetadata<schema.XEntity>(id);
    if (!metadata) {
      kernel
        .queryTargetById({
          ids: [id],
          page: PageAll,
        })
        .then((res) => {
          if (res.success && res.data.result) {
            res.data.result.forEach((item) => {
              this.updateMetadata(item);
            });
          }
        });
    }
    return {
      name: metadata?.name ?? '请稍后...',
      typeName: metadata?.typeName ?? '未知',
      avatar: parseAvatar(metadata?.icon),
    };
  }
}
