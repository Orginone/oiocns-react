import { kernel, model, schema } from '@/ts/base';
import { IBelong, Belong } from '../base/belong';
import { ICohort, Cohort } from '../outTeam/cohort';
import { IGroup, Group } from '../outTeam/group';
import { IDepartment, Department } from '../innerTeam/department';
import { IStation, Station } from '../innerTeam/station';
import { IPerson } from '../person';
import { PageAll } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { IMsgChat } from '../../chat/message/msgchat';
import { ITarget } from '../base/target';
import { ITeam } from '../base/team';
import { targetOperates } from '../../public';

/** 单位类型接口 */
export interface ICompany extends IBelong {
  /** 加入/管理的组织集群 */
  groups: IGroup[];
  /** 设立的岗位 */
  stations: IStation[];
  /** 设立的部门 */
  departments: IDepartment[];
  /** 支持的内设机构类型 */
  departmentTypes: string[];
  /** 退出单位 */
  exit(): Promise<boolean>;
  /** 加载组织集群 */
  loadGroups(reload?: boolean): Promise<IGroup[]>;
  /** 加载创建的群 */
  loadStations(reload?: boolean): Promise<IStation[]>;
  /** 加载单位的部门 */
  loadDepartments(reload?: boolean): Promise<IDepartment[]>;
  /** 设立岗位 */
  createStation(data: model.TargetModel): Promise<IStation | undefined>;
  /** 设立组织集群 */
  createGroup(data: model.TargetModel): Promise<IGroup | undefined>;
  /** 设立内部机构 */
  createDepartment(data: model.TargetModel): Promise<IDepartment | undefined>;
}

/** 单位类型实现 */
export class Company extends Belong implements ICompany {
  constructor(_metadata: schema.XTarget, _user: IPerson) {
    super(_metadata, ['全员群'], _user);
    this.departmentTypes = [
      TargetType.Department,
      TargetType.Office,
      TargetType.Working,
      TargetType.Research,
      TargetType.Laboratory,
    ];
  }
  groups: IGroup[] = [];
  stations: IStation[] = [];
  departments: IDepartment[] = [];
  departmentTypes: string[] = [];
  private _groupLoaded: boolean = false;
  private _cohortLoaded: boolean = false;
  private _stationLoaded: boolean = false;
  private _departmentLoaded: boolean = false;
  async loadGroups(reload: boolean = false): Promise<IGroup[]> {
    if (!this._groupLoaded || reload) {
      const res = await kernel.queryJoinedTargetById({
        id: this.id,
        typeNames: [TargetType.Group],
        page: PageAll,
      });
      if (res.success) {
        this._groupLoaded = true;
        this.groups = (res.data.result || []).map((i) => new Group(i, this));
      }
    }
    return this.groups;
  }
  async loadCohorts(reload?: boolean | undefined): Promise<ICohort[]> {
    if (!this._cohortLoaded || reload) {
      const res = await kernel.querySubTargetById({
        id: this.id,
        subTypeNames: [TargetType.Cohort],
        page: PageAll,
      });
      if (res.success) {
        this._cohortLoaded = true;
        this.cohorts = (res.data.result || []).map((i) => new Cohort(i, this));
      }
    }
    return this.cohorts;
  }
  async loadStations(reload?: boolean | undefined): Promise<IStation[]> {
    if (!this._stationLoaded || reload) {
      const res = await kernel.querySubTargetById({
        id: this.id,
        subTypeNames: [TargetType.Station],
        page: PageAll,
      });
      if (res.success) {
        this._stationLoaded = true;
        this.stations = (res.data.result || []).map((i) => new Station(i, this));
      }
    }
    return this.stations;
  }
  async loadDepartments(reload?: boolean | undefined): Promise<IDepartment[]> {
    if (!this._departmentLoaded || reload) {
      const res = await kernel.querySubTargetById({
        id: this.id,
        subTypeNames: this.departmentTypes,
        page: PageAll,
      });
      if (res.success) {
        this._departmentLoaded = true;
        this.departments = (res.data.result || []).map((i) => new Department(i, this));
      }
    }
    return this.departments;
  }
  async createGroup(data: model.TargetModel): Promise<IGroup | undefined> {
    data.typeName = TargetType.Group;
    const metadata = await this.create(data);
    if (metadata) {
      const group = new Group(metadata, this);
      await group.deepLoad();
      this.groups.push(group);
      await group.pullMembers([this.metadata]);
      return group;
    }
  }
  async createDepartment(data: model.TargetModel): Promise<IDepartment | undefined> {
    if (!this.departmentTypes.includes(data.typeName as TargetType)) {
      data.typeName = TargetType.Department;
    }
    data.public = false;
    const metadata = await this.create(data);
    if (metadata) {
      const department = new Department(metadata, this);
      await department.deepLoad();
      if (await this.pullSubTarget(department)) {
        this.departments.push(department);
        return department;
      }
    }
  }
  async createStation(data: model.TargetModel): Promise<IStation | undefined> {
    data.public = false;
    data.typeName = TargetType.Station;
    const metadata = await this.create(data);
    if (metadata) {
      const station = new Station(metadata, this);
      if (await this.pullSubTarget(station)) {
        this.stations.push(station);
        return station;
      }
    }
  }
  async createTarget(data: model.TargetModel): Promise<ITeam | undefined> {
    switch (data.typeName) {
      case TargetType.Cohort:
        return this.createCohort(data);
      case TargetType.Station:
        return this.createStation(data);
      case TargetType.Group:
        return this.createGroup(data);
      default:
        return this.createDepartment(data);
    }
  }
  async applyJoin(members: schema.XTarget[]): Promise<boolean> {
    for (const member of members) {
      if (member.typeName === TargetType.Group) {
        await kernel.applyJoinTeam({
          id: member.id,
          subId: this.id,
        });
      }
    }
    return true;
  }
  async exit(): Promise<boolean> {
    if (await this.removeMembers([this.user.metadata])) {
      this.user.companys = this.user.companys.filter((i) => i.key != this.key);
      return true;
    }
    return false;
  }
  override async delete(notity: boolean = false): Promise<boolean> {
    notity = await super.delete(notity);
    if (notity) {
      this.user.companys = this.user.companys.filter((i) => i.key != this.key);
    }
    return notity;
  }
  get subTarget(): ITarget[] {
    return [...this.departments, ...this.cohorts];
  }
  get shareTarget(): ITarget[] {
    return [this, ...this.groups];
  }
  get parentTarget(): ITarget[] {
    return this.groups;
  }
  get chats(): IMsgChat[] {
    const chats: IMsgChat[] = [this];
    chats.push(...this.cohortChats);
    chats.push(...this.memberChats);
    return chats;
  }
  get cohortChats(): IMsgChat[] {
    const chats: IMsgChat[] = [];
    for (const item of this.departments) {
      chats.push(...item.chats);
    }
    for (const item of this.stations) {
      chats.push(...item.chats);
    }
    for (const item of this.cohorts) {
      chats.push(...item.chats);
    }
    if (this.superAuth) {
      chats.push(...this.superAuth.chats);
    }
    return chats;
  }
  get targets(): ITarget[] {
    const targets: ITarget[] = [this];
    for (const item of this.groups) {
      targets.push(...item.targets);
    }
    for (const item of this.departments) {
      targets.push(...item.targets);
    }
    for (const item of this.cohorts) {
      targets.push(...item.targets);
    }
    return targets;
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.directory.loadSubDirectory();
    await this.loadGroups(reload);
    await this.loadDepartments(reload);
    await this.loadStations(reload);
    await this.loadCohorts(reload);
    await this.loadMembers(reload);
    await this.loadSuperAuth(reload);
    for (const group of this.groups) {
      await group.deepLoad(reload);
    }
    for (const department of this.departments) {
      await department.deepLoad(reload);
    }
    for (const station of this.stations) {
      await station.deepLoad(reload);
    }
    for (const cohort of this.cohorts) {
      await cohort.deepLoad(reload);
    }
    this.superAuth?.deepLoad(reload);
  }

  override operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.hasRelationAuth()) {
      operates.unshift(
        {
          sort: 3,
          cmd: 'setNew',
          label: '设立更多',
          iconType: 'setNew',
          menus: [targetOperates.NewGroup, targetOperates.NewDepartment],
        },
        {
          sort: 13,
          cmd: 'joinGroup',
          label: '加入集群',
          iconType: 'joinGroup',
        },
      );
    }
    return operates;
  }

  override async removeMembers(
    members: schema.XTarget[],
    notity: boolean = false,
  ): Promise<boolean> {
    notity = await super.removeMembers(members, notity);
    if (notity) {
      this.subTarget.forEach((a) => a.removeMembers(members, true));
    }
    return notity;
  }

  async teamChangedNotity(target: schema.XTarget): Promise<boolean> {
    switch (target.typeName) {
      case TargetType.Person:
        return this.pullMembers([target], true);
      case TargetType.Group:
        if (this.groups.every((i) => i.id != target.id)) {
          const group = new Group(target, this);
          await group.deepLoad();
          this.groups.push(group);
          return true;
        }
        break;
      case TargetType.Station:
        if (this.stations.every((i) => i.id != target.id)) {
          const station = new Station(target, this);
          await station.deepLoad();
          this.stations.push(station);
          return true;
        }
        break;
      case TargetType.Cohort:
        if (this.cohorts.every((i) => i.id != target.id)) {
          const cohort = new Cohort(target, this);
          await cohort.deepLoad();
          this.cohorts.push(cohort);
          return true;
        }
        break;
      default:
        if (this.departmentTypes.includes(target.typeName as TargetType)) {
          if (this.departments.every((i) => i.id != target.id)) {
            const department = new Department(target, this);
            await department.deepLoad();
            this.departments.push(department);
            return true;
          }
        }
    }
    return false;
  }
}
