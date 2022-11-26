import Group from './group';
import Cohort from './cohort';
import consts from '../consts';
import MarketTarget from './mbase';
import { TargetType } from '../enum';
import { ResultType, TargetModel } from '@/ts/base/model';
import Department from './department';
import { validIsSocialCreditCode } from '@/utils/tools';
import { faildResult, schema, kernel, common } from '@/ts/base';
import { IGroup, ICompany, ICohort, IDepartment, IWorking } from './itarget';
/**
 * 公司的元操作
 */
export default class Company extends MarketTarget implements ICompany {
  person: schema.XTarget[];
  departments: IDepartment[];
  workings: IWorking[];
  joinedGroup: IGroup[];
  joinedCohort: ICohort[];

  constructor(target: schema.XTarget) {
    super(target);

    this.person = [];
    this.departments = [];
    this.workings = [];
    this.joinedGroup = [];
    this.joinedCohort = [];

    this.subTypes = [
      TargetType.JobCohort,
      TargetType.Working,
      TargetType.Department,
      TargetType.Group,
      TargetType.Section,
    ];
    this.pullTypes = [TargetType.Person];
    this.joinTargetType = [TargetType.Group, TargetType.Cohort];
    this.createTargetType = [TargetType.Cohort, TargetType.Group];
    this.searchTargetType = [TargetType.Person, TargetType.Cohort, TargetType.Group];
  }
  public async createGroup(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<ResultType<any>> {
    const tres = await this.searchTargetByName(data.code, TargetType.Group);
    if (!tres.data) {
      const res = await this.createTarget(data);
      if (res.success) {
        const group = new Group(res.data);
        this.joinedGroup.push(group);
        return await group.pullMember([this.target]);
      }
      return res;
    } else {
      return faildResult('该集团已存在!');
    }
  }
  public async createCohort(
    data: Omit<TargetModel, 'id' | 'belongId' | 'teamName' | 'teamCode'>,
  ): Promise<ResultType<any>> {
    const res = await this.createTarget({
      ...data,
      teamCode: data.code,
      teamName: data.name,
    });
    if (res.success && res.data != undefined) {
      const cohort = new Cohort(res.data);
      this.joinedCohort.push(cohort);
      return cohort.pullMember([this.target]);
    }
    return res;
  }
  public async deleteDepartment(id: string): Promise<ResultType<any>> {
    const department = this.departments.find((department) => {
      return department.target.id == id;
    });
    if (department != undefined) {
      let res = await this.deleteSubTarget(id, TargetType.Department);
      if (res.success) {
        this.departments = this.departments.filter((department) => {
          return department.target.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }
  public async deleteWorking(id: string): Promise<ResultType<any>> {
    const working = this.workings.find((working) => {
      return working.target.id == id;
    });
    if (working != undefined) {
      let res = await this.deleteSubTarget(id, TargetType.Working);
      if (res.success) {
        this.workings = this.workings.filter((working) => {
          return working.target.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }
  public async deleteGroup(id: string): Promise<ResultType<any>> {
    const group = this.joinedGroup.find((group) => {
      return group.target.id == id;
    });
    if (group != undefined) {
      let res = await kernel.recursiveDeleteTarget({
        id: id,
        typeName: TargetType.Group,
        subNodeTypeNames: [TargetType.Group],
      });
      if (res.success) {
        this.joinedGroup = this.joinedGroup.filter((group) => {
          return group.target.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }
  public async deleteCohort(id: string): Promise<ResultType<any>> {
    let res = await kernel.deleteTarget({
      id: id,
      typeName: TargetType.Cohort,
      belongId: this.target.id,
    });
    if (res.success) {
      this.joinedCohort = this.joinedCohort.filter((obj) => obj.target.id != id);
    }
    return res;
  }
  public async quitCohorts(id: string): Promise<ResultType<any>> {
    const res = await this.cancelJoinTeam(id);
    if (res.success) {
      this.joinedCohort = this.joinedCohort.filter((cohort) => {
        return cohort.target.id != id;
      });
    }
    return res;
  }
  public async quitGroup(id: string): Promise<ResultType<any>> {
    const group = await this.joinedGroup.find((a) => {
      return a.target.id == id;
    });
    if (group != undefined) {
      const res = await kernel.recursiveExitAnyOfTeam({
        id,
        teamTypes: [TargetType.Group],
        targetId: this.target.id,
        targetType: this.target.typeName,
      });
      if (res.success) {
        this.joinedGroup = this.joinedGroup.filter((a) => {
          return a.target.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }
  public async getPersons(): Promise<schema.XTarget[]> {
    if (this.person.length > 0) {
      return this.person;
    }

    const res = await this.getSubTargets([TargetType.Person]);
    if (res.success && res.data.result != undefined) {
      this.person = res.data.result;
    }
    return this.person;
  }
  public async getDepartments(): Promise<IDepartment[]> {
    if (this.departments.length > 0) {
      return this.departments;
    }
    const res = await this.getSubTargets([TargetType.Department]);
    if (res.success) {
      res.data.result?.forEach((a) => {
        this.departments.push(new Department(a));
      });
    }
    return this.departments;
  }
  public async getWorkings(): Promise<IWorking[]> {
    if (this.workings.length > 0) {
      return this.workings;
    }
    const res = await this.getSubTargets([TargetType.Working]);
    if (res.success) {
      res.data.result?.forEach((a) => {
        this.workings.push(new Department(a));
      });
    }
    return this.workings;
  }
  public async getJoinedCohorts(): Promise<ICohort[]> {
    if (this.joinedCohort.length > 0) {
      return this.joinedCohort;
    }
    const res = await this.getjoinedTargets([TargetType.Cohort]);
    if (res.success) {
      res.data.result?.forEach((a) => {
        this.joinedCohort.push(new Cohort(a));
      });
    }
    return this.joinedCohort;
  }
  public async getJoinedGroups(): Promise<IGroup[]> {
    if (this.joinedGroup.length > 0) {
      return this.joinedGroup;
    }
    const res = await this.getjoinedTargets([TargetType.Group]);
    if (res.success) {
      res.data.result?.forEach((a) => {
        this.joinedGroup.push(new Group(a));
      });
    }
    return this.joinedGroup;
  }
  public async update(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<ResultType<schema.XTarget>> {
    if (!validIsSocialCreditCode(data.code)) {
      return faildResult('请填写正确的代码!');
    }
    return await super.updateTarget(data);
  }
  public async applyJoinCohort(id: string): Promise<ResultType<any>> {
    const cohort = this.joinedCohort.find((cohort) => {
      return cohort.target.id == id;
    });
    if (cohort == undefined) {
      return await this.applyJoin(id, TargetType.Cohort);
    }
    return faildResult(consts.IsJoinedError);
  }
  public async applyJoinGroup(id: string): Promise<ResultType<any>> {
    const group = this.joinedGroup.find((group) => {
      return group.target.id == id;
    });
    if (group == undefined) {
      return await this.applyJoin(id, TargetType.Group);
    }
    return faildResult(consts.IsJoinedError);
  }
  public async queryJoinApply(): Promise<ResultType<schema.XRelationArray>> {
    return await kernel.queryJoinTeamApply({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  }
  public async queryJoinApproval(): Promise<ResultType<schema.XRelationArray>> {
    return await kernel.queryTeamJoinApproval({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  }
  public async cancelJoinApply(id: string): Promise<ResultType<any>> {
    return await kernel.cancelJoinTeam({
      id,
      typeName: TargetType.Company,
      belongId: this.target.id,
    });
  }
}
