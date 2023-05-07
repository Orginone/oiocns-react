import { kernel, model, parseAvatar, schema } from '@/ts/base';
import { IBelong, Belong } from './base/belong';
import { ICohort, Cohort } from './outTeam/cohort';
import { createCompany } from './team';
import { PageAll, ShareIdSet, companyTypes } from '../public/consts';
import { TargetType } from '../public/enums';
import { ICompany } from './team/company';
import { IMsgChat, PersonMsgChat } from '../chat/message/msgchat';
import { IFileSystem, FileSystem } from '../thing/filesys/filesystem';
import { ITarget } from './base/target';
import { ITeam } from './base/team';

/** 人员类型接口 */
export interface IPerson extends IBelong {
  /** 文件系统 */
  filesys: IFileSystem;
  /** 加入/管理的单位 */
  companys: ICompany[];
  /** 赋予人的身份(角色)实体 */
  givedIdentitys: schema.XIdentity[];
  /** 根据ID查询共享信息 */
  findShareById(id: string): model.ShareIcon;
  /** 判断是否拥有某些用户的权限 */
  authenticate(orgIds: string[], authIds: string[]): boolean;
  /** 加载赋予人的身份(角色)实体 */
  loadGivedIdentitys(reload?: boolean): Promise<schema.XIdentity[]>;
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
    this.filesys = new FileSystem(
      {
        id: this.metadata.id,
      } as schema.XSpecies,
      this,
    );
  }
  filesys: IFileSystem;
  companys: ICompany[] = [];
  private _cohortLoaded: boolean = false;
  private _companyLoaded: boolean = false;
  givedIdentitys: schema.XIdentity[] = [];
  private _givedIdentityLoaded: boolean = false;
  async loadGivedIdentitys(reload: boolean = false): Promise<schema.XIdentity[]> {
    if (!this._givedIdentityLoaded || reload) {
      const res = await kernel.queryGivedIdentitys();
      if (res.success) {
        this._givedIdentityLoaded = true;
        this.givedIdentitys = res.data?.result || [];
      }
    }
    return this.givedIdentitys;
  }
  async loadCohorts(reload?: boolean | undefined): Promise<ICohort[]> {
    if (!this._cohortLoaded || reload) {
      const res = await kernel.queryJoinedTargetById({
        id: this.metadata.id,
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
        id: this.metadata.id,
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
        .filter((i) => orgIds.includes(i.shareId))
        .filter((i) => authIds.includes(i.authId)).length > 0
    );
  }
  async applyJoin(members: schema.XTarget[]): Promise<boolean> {
    members = members.filter((i) =>
      [TargetType.Person, TargetType.Cohort, ...companyTypes].includes(
        i.typeName as TargetType,
      ),
    );
    for (const member of members) {
      if (member.typeName === TargetType.Person) {
        await this.pullMembers([member]);
      }
      await kernel.applyJoinTeam({
        id: member.id,
        subId: this.metadata.id,
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
  async delete(): Promise<boolean> {
    const res = await kernel.deleteTarget({
      id: this.metadata.id,
      page: PageAll,
    });
    return res.success;
  }
  get subTarget(): ITarget[] {
    return [];
  }
  get parentTarget(): ITarget[] {
    return [this, ...this.cohorts];
  }
  get chats(): IMsgChat[] {
    const chats: IMsgChat[] = [this];
    for (const item of this.companys) {
      chats.push(...item.chats);
    }
    chats.push(...this.cohortChats);
    chats.push(...this.memberChats);
    return chats;
  }
  get cohortChats(): IMsgChat[] {
    const chats: IMsgChat[] = [];
    for (const item of this.cohorts) {
      chats.push(...item.chats);
    }
    if (this.superAuth) {
      chats.push(...this.superAuth.chats);
    }
    return chats;
  }
  override loadMemberChats(_newMembers: schema.XTarget[], _isAdd: boolean): void {
    _newMembers.forEach((i) => {
      if (_isAdd) {
        this.memberChats.push(
          new PersonMsgChat(
            this.metadata.id,
            this.metadata.id,
            i.id,
            {
              name: i.name,
              typeName: i.typeName,
              avatar: parseAvatar(i.icon),
            },
            ['好友'],
            i.remark,
          ),
        );
      } else {
        this.memberChats = this.memberChats.filter(
          (a) => !(a.belongId === i.id && a.chatId === i.id),
        );
      }
    });
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadGivedIdentitys(reload);
    await this.loadCompanys(reload);
    await this.loadCohorts(reload);
    await this.loadMembers(reload);
    await this.loadSuperAuth(reload);
    await this.loadDicts(reload);
    await this.loadSpecies(reload);
    for (const company of this.companys) {
      await company.deepLoad(reload);
    }
    for (const cohort of this.cohorts) {
      await cohort.deepLoad(reload);
    }
    this.superAuth?.deepLoad(reload);
  }
  findShareById(id: string): model.ShareIcon {
    const share = ShareIdSet.get(id) || {
      name: '未知',
      typeName: '未知',
    };
    if (!share.avatar) {
      kernel
        .queryTargetById({
          ids: [id],
          page: PageAll,
        })
        .then((res) => {
          if (res.success && res.data.result) {
            res.data.result.forEach((item) => {
              ShareIdSet.set(item.id, {
                name: item.name,
                typeName: item.typeName,
                avatar: parseAvatar(item.icon),
              });
            });
          }
        });
    }
    return share;
  }
}
