import Group from './group';
import Cohort from './cohort';
import consts from '../consts';
import MarketTarget from './mbase';
import { TargetType } from '../enum';
import { ResultType, TargetModel } from '@/ts/base/model';
import Department from './department';
import { validIsSocialCreditCode } from '@/utils/tools';
import { schema, kernel, common, model } from '@/ts/base';
import { IGroup, ICompany, ICohort, IDepartment, IWorking, SpaceType } from './itarget';
import Working from './working';
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

    this.extendTargetType = [
      TargetType.Department,
      TargetType.Working,
      ...this.companyTypes,
    ];
    this.joinTargetType = [TargetType.Group, TargetType.Cohort];
    this.createTargetType = [
      TargetType.Department,
      TargetType.Working,
      TargetType.Cohort,
      TargetType.Group,
    ];
    this.searchTargetType = [TargetType.Person, TargetType.Cohort, TargetType.Group];
  }
  public async searchCohort(code: string): Promise<ResultType<schema.XTargetArray>> {
    return await this.searchTargetByName(code, [TargetType.Cohort]);
  }
  public async searchGroup(code: string): Promise<ResultType<schema.XTargetArray>> {
    return await this.searchTargetByName(code, [TargetType.Group]);
  }
  public get spaceData(): SpaceType {
    return {
      id: this.target.id,
      name: this.target.team!.name,
      icon: this.target.avatar,
      typeName: this.target.typeName as TargetType,
    };
  }
  public async createGroup(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<ResultType<any>> {
    const tres = await this.searchTargetByName(data.code, [TargetType.Group]);
    if (!tres.data.result) {
      const res = await this.createTarget({ ...data, belongId: this.target.id });
      if (res.success) {
        const group = new Group(res.data);
        this.joinedGroup.push(group);
        return await group.pullMember([this.target]);
      }
      return res;
    } else {
      return model.badRequest('该集团已存在!');
    }
  }
  public async createDepartment(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<ResultType<any>> {
    data.teamCode = data.teamCode == '' ? data.code : data.teamCode;
    data.teamName = data.teamName == '' ? data.name : data.teamName;
    data.typeName = TargetType.Department;
    const res = await this.createSubTarget({ ...data, belongId: this.target.id });
    if (res.success) {
      this.departments.push(new Department(res.data));
    }
    return res;
  }
  public async createWorking(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<ResultType<any>> {
    data.teamCode = data.teamCode == '' ? data.code : data.teamCode;
    data.teamName = data.teamName == '' ? data.name : data.teamName;
    data.typeName = TargetType.Working;
    const res = await this.createSubTarget({ ...data, belongId: this.target.id });
    if (res.success) {
      this.workings.push(new Working(res.data));
    }
    return res;
  }
  public async createCohort(
    data: Omit<TargetModel, 'id' | 'belongId' | 'teamName' | 'teamCode'>,
  ): Promise<ResultType<any>> {
    const res = await this.createTarget({
      ...data,
      belongId: this.target.id,
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
  public async pullPerson(targets: schema.XTarget[]): Promise<ResultType<any>> {
    const res = await super.pullMember(targets);
    if (res.success) {
      res.data.result?.forEach((a) => {
        if (a.target != undefined) {
          this.person.push(a.target);
        }
      });
    }
    return res;
  }
  public async removePerson(ids: string[]): Promise<ResultType<any>> {
    const res = await kernel.removeAnyOfTeamAndBelong({
      id: this.target.id,
      teamTypes: [...this.companyTypes, ...this.subTypes],
      targetIds: ids,
      targetType: TargetType.Person,
    });
    if (res.success) {
      this.person = this.person.filter((a) => {
        return !ids.includes(a.id);
      });
      this.workings.forEach((a) => {
        a.person = a.person.filter((a) => {
          return !ids.includes(a.id);
        });
      });
      this.departments.forEach((a) => {
        a.person = a.person.filter((a) => {
          return !ids.includes(a.id);
        });
      });
    }
    return res;
  }
  public async deleteDepartment(id: string): Promise<ResultType<any>> {
    const department = this.departments.find((department) => {
      return department.target.id == id;
    });
    if (department != undefined) {
      let res = await this.deleteSubTarget(id, TargetType.Department, this.target.id);
      if (res.success) {
        this.departments = this.departments.filter((department) => {
          return department.target.id != id;
        });
      }
      return res;
    }
    return model.badRequest(consts.UnauthorizedError);
  }
  public async deleteWorking(id: string): Promise<ResultType<any>> {
    const working = this.workings.find((working) => {
      return working.target.id == id;
    });
    if (working != undefined) {
      let res = await this.deleteSubTarget(id, TargetType.Working, this.target.id);
      if (res.success) {
        this.workings = this.workings.filter((working) => {
          return working.target.id != id;
        });
      }
      return res;
    }
    return model.badRequest(consts.UnauthorizedError);
  }
  public async deleteGroup(id: string): Promise<ResultType<any>> {
    const group = this.joinedGroup.find((group) => {
      return group.target.id == id;
    });
    if (group) {
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
    return model.badRequest(consts.UnauthorizedError);
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
    return model.badRequest(consts.UnauthorizedError);
  }
  public async getPersons(reload: boolean = false): Promise<schema.XTarget[]> {
    if (!reload && this.person.length > 0) {
      return this.person;
    }
    const res = await this.getSubTargets([TargetType.Person]);
    if (res.success && res.data.result) {
      this.person = res.data.result;
    }
    return this.person;
  }
  public getDepartments = async (reload: boolean = false): Promise<IDepartment[]> => {
    if (!reload && this.departments.length > 0) {
      return this.departments;
    }
    const res = await this.getSubTargets([TargetType.Department]);
    if (res.success && res.data.result) {
      this.departments = res.data.result.map((a) => {
        return new Department(a);
      });
    }
    return this.departments;
  };
  public async getWorkings(reload: boolean = false): Promise<IWorking[]> {
    if (!reload && this.workings.length > 0) {
      return this.workings;
    }
    const res = await this.getSubTargets([TargetType.Working]);
    if (res.success && res.data.result) {
      this.workings = res.data.result?.map((a) => {
        return new Working(a);
      });
    }
    return this.workings;
  }
  public async getJoinedCohorts(reload: boolean = false): Promise<ICohort[]> {
    if (!reload && this.joinedCohort.length > 0) {
      return this.joinedCohort;
    }
    const res = await this.getjoinedTargets([TargetType.Cohort]);
    if (res.success && res.data.result) {
      this.joinedCohort = res.data.result.map((a) => {
        return new Cohort(a);
      });
    }
    return this.joinedCohort;
  }
  public getJoinedGroups = async (reload: boolean = false): Promise<IGroup[]> => {
    if (!reload && this.joinedGroup.length > 0) {
      return this.joinedGroup;
    }
    const res = await this.getjoinedTargets([TargetType.Group]);
    if (res.success && res.data.result) {
      this.joinedGroup = res.data.result.map((a) => {
        return new Group(a);
      });
    }
    return this.joinedGroup;
  };
  public async update(
    data: Omit<TargetModel, 'id'>,
  ): Promise<ResultType<schema.XTarget>> {
    if (!validIsSocialCreditCode(data.code)) {
      return model.badRequest('请填写正确的代码!');
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
    return model.badRequest(consts.IsJoinedError);
  }
  public async applyJoinGroup(id: string): Promise<ResultType<any>> {
    const group = this.joinedGroup.find((group) => {
      return group.target.id == id;
    });
    if (group == undefined) {
      return await this.applyJoin(id, TargetType.Group);
    }
    return model.badRequest(consts.IsJoinedError);
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
