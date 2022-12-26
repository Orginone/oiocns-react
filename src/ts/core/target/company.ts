import Group from './group';
import consts from '../consts';
import MarketTarget from './mbase';
import { companyTypes, departmentTypes, TargetType } from '../enum';
import { TargetModel } from '@/ts/base/model';
import Department from './department';
import { validIsSocialCreditCode } from '@/utils/tools';
import { schema, kernel, common } from '@/ts/base';
import {
  IGroup,
  ICompany,
  IDepartment,
  IWorking,
  SpaceType,
  ITarget,
  TargetParam,
  ICohort,
  IStation,
} from './itarget';
import Working from './working';
import Station from './station';
import { logger } from '@/ts/base/common';
import Cohort from './cohort';
/**
 * 公司的元操作
 */
export default class Company extends MarketTarget implements ICompany {
  stations: IStation[] = [];
  departments: IDepartment[] = [];
  joinedGroup: IGroup[] = [];
  userId: string;
  cohorts: ICohort[] = [];
  workings: IWorking[] = [];
  departmentTypes: TargetType[] = [];

  constructor(target: schema.XTarget, userId: string) {
    super(target);
    this.userId = userId;
    this.departmentTypes = departmentTypes;
    this.subTeamTypes = [...this.departmentTypes, TargetType.Working];
    this.extendTargetType = [...this.subTeamTypes, ...companyTypes];
    this.joinTargetType = [TargetType.Group];
    this.createTargetType = [
      ...this.subTeamTypes,
      TargetType.Station,
      TargetType.Group,
      TargetType.Cohort,
    ];
    this.searchTargetType = [TargetType.Person, TargetType.Group];
  }
  public get subTeam(): ITarget[] {
    return [...this.departments, ...this.workings];
  }
  public getCohorts = async (reload?: boolean): Promise<ICohort[]> => {
    if (!reload && this.cohorts.length > 0) {
      return this.cohorts;
    }
    const res = await kernel.queryJoinedTargetById({
      id: this.userId,
      typeName: TargetType.Person,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
      spaceId: this.id,
      JoinTypeNames: [TargetType.Cohort],
    });
    if (res.success && res.data.result) {
      this.cohorts = res.data.result.map((a) => {
        return new Cohort(a, () => {
          this.cohorts = this.cohorts.filter((i) => i.id != a.id);
        });
      });
    }
    return this.cohorts;
  };
  public async create(data: TargetModel): Promise<ITarget | undefined> {
    switch (data.typeName as TargetType) {
      case TargetType.Group:
        return this.createGroup(data);
      case TargetType.Working:
        return this.createWorking(data);
      case TargetType.Station:
        return this.createStation(data);
      case TargetType.Cohort:
        return this.createCohort(data);
      default:
        return this.createDepartment(data);
    }
  }
  public async loadSubTeam(reload?: boolean): Promise<ITarget[]> {
    await this.getWorkings(reload);
    await this.getDepartments(reload);
    return [...this.departments, ...this.workings];
  }
  public async searchGroup(code: string): Promise<schema.XTargetArray> {
    return await this.searchTargetByName(code, [TargetType.Group]);
  }
  public get spaceData(): SpaceType {
    return {
      id: this.target.id,
      name: this.target.team!.name,
      share: this.shareInfo,
      typeName: this.target.typeName as TargetType,
    };
  }
  private async createGroup(data: TargetParam): Promise<IGroup | undefined> {
    const tres = await this.searchTargetByName(data.code, [TargetType.Group]);
    if (!tres.result) {
      const res = await this.createTarget({ ...data, belongId: this.target.id });
      if (res.success) {
        const group = new Group(res.data, () => {
          this.joinedGroup = this.joinedGroup.filter((item) => {
            return item.id != group.id;
          });
        });
        this.joinedGroup.push(group);
        await group.pullMember(this.target);
        return group;
      }
    } else {
      logger.warn('该集团已存在!');
    }
  }
  private async createDepartment(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<IDepartment | undefined> {
    data.teamCode = data.teamCode == '' ? data.code : data.teamCode;
    data.teamName = data.teamName == '' ? data.name : data.teamName;
    if (!this.departmentTypes.includes(data.typeName as TargetType)) {
      logger.warn('不支持该机构');
      return;
    }
    const res = await this.createSubTarget({ ...data, belongId: this.target.id });
    if (res.success) {
      const department = new Department(res.data, () => {
        this.departments = this.departments.filter((item) => {
          return item.id != department.id;
        });
      });
      this.departments.push(department);
      return department;
    }
  }
  private async createStation(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<IStation | undefined> {
    data.teamCode = data.teamCode == '' ? data.code : data.teamCode;
    data.teamName = data.teamName == '' ? data.name : data.teamName;
    data.typeName = TargetType.Station;
    const res = await this.createSubTarget({ ...data, belongId: this.target.id });
    if (res.success) {
      const station = new Station(res.data, () => {
        this.stations = this.stations.filter((item) => {
          return item.id != station.id;
        });
      });
      this.stations.push(station);
      return station;
    }
  }
  private async createWorking(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<IWorking | undefined> {
    data.teamCode = data.teamCode == '' ? data.code : data.teamCode;
    data.teamName = data.teamName == '' ? data.name : data.teamName;
    data.typeName = TargetType.Working;
    const res = await this.createSubTarget({ ...data, belongId: this.target.id });
    if (res.success) {
      const working = new Working(res.data, () => {
        this.workings = this.workings.filter((item) => {
          return item.id != working.id;
        });
      });
      this.workings.push(working);
      return working;
    }
  }
  private async createCohort(data: TargetModel): Promise<ICohort | undefined> {
    const res = await this.createTarget({
      code: data.code,
      name: data.name,
      avatar: data.avatar,
      teamCode: data.code,
      teamName: data.name,
      belongId: this.id,
      typeName: TargetType.Cohort,
      teamRemark: data.teamRemark,
    });
    if (res.success && res.data != undefined) {
      const cohort = new Cohort(res.data, () => {
        this.cohorts = this.cohorts.filter((i) => i.id != res.data.id);
      });
      this.cohorts.push(cohort);
      cohort.pullMembers([this.userId], TargetType.Person);
      return cohort;
    }
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
  public async deleteDepartment(id: string): Promise<boolean> {
    const department = this.departments.find((department) => {
      return department.id == id;
    });
    if (department) {
      let res = await this.deleteSubTarget(id, department.target.typeName, this.id);
      if (res.success) {
        this.departments = this.departments.filter((department) => {
          return department.id != id;
        });
      }
      return res.success;
    }
    logger.warn(consts.UnauthorizedError);
    return false;
  }
  public async deleteStation(id: string): Promise<boolean> {
    const station = this.stations.find((department) => {
      return department.id == id;
    });
    if (station) {
      let res = await this.deleteSubTarget(id, station.target.typeName, this.id);
      if (res.success) {
        this.stations = this.stations.filter((station) => {
          return station.id != id;
        });
      }
      return res.success;
    }
    logger.warn(consts.UnauthorizedError);
    return false;
  }
  public async deleteWorking(id: string): Promise<boolean> {
    const working = this.workings.find((working) => {
      return working.id == id;
    });
    if (working) {
      let res = await this.deleteSubTarget(id, TargetType.Working, this.id);
      if (res.success) {
        this.workings = this.workings.filter((working) => {
          return working.id != id;
        });
      }
      return res.success;
    }
    logger.warn(consts.UnauthorizedError);
    return false;
  }
  public async deleteGroup(id: string): Promise<boolean> {
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
      return res.success;
    }
    logger.warn(consts.UnauthorizedError);
    return false;
  }
  public async quitGroup(id: string): Promise<boolean> {
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
      return res.success;
    }
    logger.warn(consts.UnauthorizedError);
    return false;
  }
  public async getDepartments(reload: boolean = false): Promise<IDepartment[]> {
    if (!reload && this.departments.length > 0) {
      return this.departments;
    }
    const res = await this.getSubTargets(this.departmentTypes);
    if (res.success && res.data.result) {
      this.departments = res.data.result.map((a) => {
        return new Department(a, () => {
          this.departments = this.departments.filter((item) => {
            return item.id != a.id;
          });
        });
      });
    }
    return this.departments;
  }
  public async getStations(reload?: boolean): Promise<IStation[]> {
    if (!reload && this.stations.length > 0) {
      return this.stations;
    }
    const res = await this.getSubTargets([TargetType.Station]);
    if (res.success && res.data.result) {
      this.stations = res.data.result.map((a) => {
        return new Station(a, () => {
          this.stations = this.stations.filter((item) => {
            return item.id != a.id;
          });
        });
      });
    }
    return this.stations;
  }
  public async getWorkings(reload: boolean = false): Promise<IWorking[]> {
    if (!reload && this.workings.length > 0) {
      return this.workings;
    }
    const res = await this.getSubTargets([TargetType.Working]);
    if (res.success && res.data.result) {
      this.workings = res.data.result?.map((a) => {
        return new Working(a, () => {
          this.workings = this.workings.filter((item) => {
            return item.id != a.id;
          });
        });
      });
    }
    return this.workings;
  }
  public async getJoinedGroups(reload: boolean = false): Promise<IGroup[]> {
    if (!reload && this.joinedGroup.length > 0) {
      return this.joinedGroup;
    }
    const res = await this.getjoinedTargets([TargetType.Group], this.userId);
    if (res && res.result) {
      this.joinedGroup = res.result.map((a) => {
        return new Group(a, () => {
          this.joinedGroup = this.joinedGroup.filter((item) => {
            return item.id != a.id;
          });
        });
      });
    }
    return this.joinedGroup;
  }
  public async update(data: TargetParam): Promise<ICompany> {
    if (!validIsSocialCreditCode(data.code)) {
      logger.warn('请填写正确的代码!');
    }
    await super.update(data);
    return this;
  }
  public async applyJoinGroup(id: string): Promise<boolean> {
    const group = this.joinedGroup.find((group) => {
      return group.target.id == id;
    });
    if (group == undefined) {
      return await this.applyJoin(id, TargetType.Group);
    }
    logger.warn(consts.IsJoinedError);
    return false;
  }
  public async queryJoinApply(): Promise<schema.XRelationArray> {
    const res = await kernel.queryJoinTeamApply({
      id: this.target.id,
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
      id: this.target.id,
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
      typeName: TargetType.Company,
      belongId: this.target.id,
    });
    return res.success;
  }
}
