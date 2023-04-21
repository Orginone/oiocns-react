import Cohort from './cohort';
import consts from '../consts';
import Company from './company';
import Hospital from './hospital';
import MarketTarget from './mbase';
import { companyTypes, TargetType } from '../enum';
import University from './university';
import { CommonStatus } from './../enum';
import { validIsSocialCreditCode } from '@/utils/tools';
import { ICompany, IPerson, ICohort, SpaceType, ITarget } from './itarget';
import { schema, model, kernel, common } from '@/ts/base';
import { PageRequest, TargetModel } from '@/ts/base/model';
import { logger, sleep } from '@/ts/base/common';
import { IProduct } from '../market';
import { IAuthority } from './authority/iauthority';
import Authority from './authority/authority';
import { Dict } from './thing/dict';
import { Property } from './thing/property';
import { IFileSystemItem, IObjectItem } from './store/ifilesys';
import { getFileSysItemRoot } from './store/filesys';
import { IChat } from './chat/ichat';
import { CreateChat } from './chat/chat';

export default class Person extends MarketTarget implements IPerson {
  cohorts: ICohort[] = [];
  joinedCompany: ICompany[] = [];
  spaceAuthorityTree: IAuthority | undefined;
  property: Property;
  dict: Dict;
  root: IFileSystemItem;
  home: IObjectItem;
  members: schema.XTarget[] = [];
  memberChats: IChat[] = [];
  constructor(target: schema.XTarget) {
    super(target, undefined, target.id);
    this.root = getFileSysItemRoot(target.id);
    this.dict = new Dict(target.id);
    this.property = new Property(target.id);
    this.searchTargetType = [TargetType.Cohort, TargetType.Person, ...companyTypes];
    this.subTeamTypes = [];
    this.joinTargetType = [TargetType.Person, TargetType.Cohort, ...companyTypes];
    this.createTargetType = [TargetType.Cohort, ...companyTypes];
    this.extendTargetType = [TargetType.Cohort, TargetType.Person];
    setTimeout(async () => {
      this.home = await this.root.create('主目录');
    }, 200);
  }
  async loadSpaceAuthorityTree(reload: boolean = false): Promise<IAuthority | undefined> {
    if (!reload && this.spaceAuthorityTree != undefined) {
      return this.spaceAuthorityTree;
    }
    const res = await kernel.queryAuthorityTree({
      id: '0',
      spaceId: this.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success) {
      this.spaceAuthorityTree = new Authority(res.data, this, this.id);
    }
    return this.spaceAuthorityTree;
  }
  async loadSubTeam(_: boolean): Promise<ITarget[]> {
    await sleep(0);
    return [];
  }
  public get spaceData(): SpaceType {
    return {
      id: this.id,
      name: '个人空间',
      share: this.shareInfo,
      typeName: this.target.typeName as TargetType,
    };
  }

  public async create(data: TargetModel): Promise<ITarget | undefined> {
    switch (data.typeName as TargetType) {
      case TargetType.University:
      case TargetType.Hospital:
      case TargetType.Company:
        return this.createCompany(data);
      case TargetType.Cohort:
        return this.createCohort(data.avatar, data.name, data.code, data.teamRemark);
    }
  }
  public async searchCohort(code: string): Promise<schema.XTargetArray> {
    return await this.searchTargetByName(code, [TargetType.Cohort]);
  }
  public async searchPerson(code: string): Promise<schema.XTargetArray> {
    return await this.searchTargetByName(code, [TargetType.Person]);
  }
  public async searchCompany(code: string): Promise<schema.XTargetArray> {
    return await this.searchTargetByName(code, companyTypes);
  }
  public getCohorts = async (reload?: boolean): Promise<ICohort[]> => {
    if (!reload && this.cohorts.length > 0) {
      return this.cohorts;
    }
    const res = await this.getjoinedTargets([TargetType.Cohort], this.id);
    if (res && res.result) {
      this.cohorts = res.result.map((a) => {
        return new Cohort(a, this, this.id, () => {
          this.cohorts = this.cohorts.filter((i) => i.id != a.id);
        });
      });
    }
    return this.cohorts;
  };
  public async getJoinedCompanys(reload: boolean = false): Promise<ICompany[]> {
    if (!reload && this.joinedCompany.length > 0) {
      return this.joinedCompany;
    }
    const res = await this.getjoinedTargets(companyTypes, this.id);
    if (res && res.result) {
      this.joinedCompany = [];
      for (const a of res.result) {
        let company;
        switch (a.typeName) {
          case TargetType.University:
            company = new University(a, this.id);
            break;
          case TargetType.Hospital:
            company = new Hospital(a, this.id);
            break;
          default:
            company = new Company(a, this.id);
            break;
        }
        this.joinedCompany.push(company);
      }
    }
    return this.joinedCompany;
  }
  private async createCohort(
    avatar: string,
    name: string,
    code: string,
    remark: string,
  ): Promise<ICohort | undefined> {
    const res = await this.createTarget({
      code,
      name,
      avatar,
      teamCode: code,
      teamName: name,
      belongId: this.id,
      typeName: TargetType.Cohort,
      teamRemark: remark,
    });
    if (res.success && res.data != undefined) {
      const cohort = new Cohort(res.data, this, this.id, () => {
        this.cohorts = this.cohorts.filter((i) => i.id != res.data.id);
      });
      this.cohorts.push(cohort);
      cohort.pullMember(this.target);
      return cohort;
    }
  }
  private async createCompany(
    data: Omit<TargetModel, 'id'>,
  ): Promise<ICompany | undefined> {
    data.belongId = this.id;
    if (!companyTypes.includes(<TargetType>data.typeName)) {
      logger.warn('您无法创建该类型单位!');
      return;
    }
    if (!validIsSocialCreditCode(data.code)) {
      logger.warn('请填写正确的代码!');
      return;
    }
    const tres = await this.searchTargetByName(data.code, companyTypes);
    if (!tres.result) {
      const res = await this.createTarget(data);
      if (res.success && res.data != undefined) {
        let company;
        if (res.success) {
          switch (<TargetType>data.typeName) {
            case TargetType.University:
              company = new University(res.data, this.id);
              break;
            case TargetType.Hospital:
              company = new Hospital(res.data, this.id);
              break;
            default:
              company = new Company(res.data, this.id);
              break;
          }
          this.joinedCompany.push(company);
          company.pullMember(this.target);
          return company;
        }
      }
    } else {
      logger.warn(consts.IsExistError);
    }
  }
  public async createProduct(
    data: Omit<model.ProductModel, 'id' | 'belongId'>,
  ): Promise<IProduct | undefined> {
    const prod = await super.createProduct(data);
    if (prod) {
      this.usefulProduct.push(prod.prod);
      if (prod.prod.resource) {
        this.usefulResource.set(prod.prod.id, prod.prod.resource);
      }
    }
    return prod;
  }
  public async deleteCohort(id: string): Promise<boolean> {
    let res = await kernel.deleteTarget({
      id: id,
      typeName: TargetType.Cohort,
      belongId: this.id,
    });
    if (res.success) {
      this.cohorts = this.cohorts.filter((a) => a.id != id);
    }
    return res.success;
  }
  public async deleteCompany(id: string): Promise<boolean> {
    let res = await kernel.deleteTarget({
      id: id,
      typeName: TargetType.Company,
      belongId: this.id,
    });
    if (res.success) {
      this.joinedCompany = this.joinedCompany.filter((a) => a.id != id);
    }
    return res.success;
  }
  public async applyJoinCohort(id: string): Promise<boolean> {
    const cohort = this.cohorts.find((cohort) => {
      return cohort.id == id;
    });
    if (!cohort) {
      return await this.applyJoin(id, TargetType.Cohort);
    }
    logger.warn(consts.IsJoinedError);
    return false;
  }
  public async applyJoinCompany(id: string, typeName: TargetType): Promise<boolean> {
    const company = this.joinedCompany.find((company) => {
      return company.id == id;
    });
    if (!company) {
      return await this.applyJoin(id, typeName);
    }
    logger.warn(consts.IsJoinedError);
    return false;
  }
  public async quitCohorts(id: string): Promise<boolean> {
    const res = await this.cancelJoinTeam(id);
    if (res.success) {
      this.cohorts = this.cohorts.filter((cohort) => {
        return cohort.id != id;
      });
    }
    return res.success;
  }
  public async quitCompany(id: string): Promise<boolean> {
    const res = await kernel.exitAnyOfTeamAndBelong({
      id,
      teamTypes: [
        TargetType.JobCohort,
        TargetType.Department,
        TargetType.Cohort,
        ...companyTypes,
      ],
      targetId: this.id,
      targetType: TargetType.Person,
    });
    if (res.success) {
      this.joinedCompany = this.joinedCompany.filter((company) => {
        return company.id != id;
      });
    }
    return res.success;
  }
  public async loadMembers(page: PageRequest): Promise<schema.XTargetArray> {
    if (this.members.length == 0) {
      let data = await super.loadMembers({
        offset: page.offset,
        limit: page.limit,
        filter: page.filter,
      });
      if (data.result) {
        this.members = [];
        this.memberChats = [];
        for (const item of data.result) {
          this.members.push(item);
          this.memberChats.push(CreateChat(this.userId, this.id, item, ['好友']));
        }
      }
    }
    return {
      offset: page.offset,
      limit: page.limit,
      result: this.members
        .filter((a) => a.code.includes(page.filter) || a.name.includes(page.filter))
        .splice(page.offset, page.limit),
      total: this.members.length,
    };
  }
  public async applyFriend(target: schema.XTarget): Promise<boolean> {
    const joinedTarget = this.members.find((a) => {
      return a.id == target.id;
    });
    if (joinedTarget == undefined) {
      if (await this.pullMember(target)) {
        return await this.applyJoin(target.id, TargetType.Person);
      }
    }
    logger.warn(consts.IsExistError);
    return false;
  }
  public async removeMembers(ids: string[]): Promise<boolean> {
    if (await super.removeMembers(ids, TargetType.Person)) {
      ids.forEach(async (id) => {
        await kernel.exitAnyOfTeam({
          id,
          teamTypes: [TargetType.Person],
          targetId: this.id,
          targetType: TargetType.Person,
        });
      });
      this.members = this.members.filter((item) => {
        return !ids.includes(item.id);
      });
      this.memberChats = this.memberChats.filter((item) => {
        return !ids.includes(item.target.id);
      });
      return true;
    }
    return false;
  }
  public async approvalFriendApply(
    relation: schema.XRelation,
    status: number,
  ): Promise<boolean> {
    const res = await this.approvalJoinApply(relation.id, status);
    if (
      status >= CommonStatus.ApproveStartStatus &&
      status < CommonStatus.RejectStartStatus &&
      res.success &&
      relation.target != undefined
    ) {
      this.members.push(relation.target);
      this.memberChats.push(CreateChat(this.userId, this.id, relation.target, ['好友']));
    }
    return false;
  }
  public async queryJoinApply(): Promise<schema.XRelationArray> {
    const res = await kernel.queryJoinTeamApply({
      id: this.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    return res.data;
  }
  public async queryJoinApproval(): Promise<schema.XRelationArray> {
    const res = await kernel.queryTeamJoinApproval({
      id: this.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    return res.data;
  }
  public async cancelJoinApply(id: string): Promise<boolean> {
    const res = await kernel.cancelJoinTeam({
      id,
      typeName: TargetType.Person,
      belongId: this.id,
    });
    return res.success;
  }
  public async resetPassword(password: string, privateKey: string): Promise<boolean> {
    const res = await kernel.resetPassword(this.target.code, password, privateKey);
    return res.success;
  }

  public async createThing(data: any): Promise<boolean> {
    let res = await kernel.anystore.createThing(this.id, 1);
    if (res.success) {
      return (
        await kernel.perfectThing({
          id: (res.data as [{ Id: string }])[0].Id,
          data: JSON.stringify(data),
          belongId: this.id,
        })
      ).success;
    } else {
      logger.error(res.msg);
      return false;
    }
  }

  public async perfectThing(id: string, data: any): Promise<boolean> {
    return (
      await kernel.perfectThing({
        id,
        data: JSON.stringify(data),
        belongId: this.id,
      })
    ).success;
  }
}
