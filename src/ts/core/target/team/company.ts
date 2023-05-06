import { kernel, model, parseAvatar, schema } from '@/ts/base';
import { IBelong, Belong } from '../base/belong';
import { ICohort, Cohort } from '../outTeam/cohort';
import { IGroup, Group } from '../outTeam/group';
import { IDepartment, Department } from '../innerTeam/department';
import { IStation, Station } from '../innerTeam/station';
import { IPerson } from '../person';
import { PageAll } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { IMsgChat, PersonMsgChat } from '../../chat/message/msgchat';
import { ITarget } from '../base/target';
import { ITeam } from '../base/team';

/** 单位类型接口 */
export interface ICompany extends IBelong {
  /** 加入/管理的单位群 */
  groups: IGroup[];
  /** 设立的岗位 */
  stations: IStation[];
  /** 设立的内部机构 */
  departments: IDepartment[];
  /** 支持的内设机构类型 */
  departmentTypes: string[];
  /** 退出单位 */
  exit(): Promise<boolean>;
  /** 加载集团 */
  loadGroups(reload?: boolean): Promise<IGroup[]>;
  /** 加载创建的群 */
  loadStations(reload?: boolean): Promise<IStation[]>;
  /** 加载单位的内设机构 */
  loadDepartments(reload?: boolean): Promise<IDepartment[]>;
  /** 设立岗位 */
  createStation(data: model.TargetModel): Promise<IStation | undefined>;
  /** 设立单位群 */
  createGroup(data: model.TargetModel): Promise<IGroup | undefined>;
  /** 设立内部机构 */
  createDepartment(data: model.TargetModel): Promise<IDepartment | undefined>;
}

/** 单位类型实现 */
export class Company extends Belong implements ICompany {
  constructor(_metadata: schema.XTarget, _user: IPerson) {
    super(_metadata, [_metadata.typeName + '群'], _user);
    this.departmentTypes = [
      TargetType.Office,
      TargetType.Working,
      TargetType.Research,
      TargetType.Laboratory,
      TargetType.Department,
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
        id: this.metadata.id,
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
        id: this.metadata.id,
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
        id: this.metadata.id,
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
        id: this.metadata.id,
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
          subId: this.metadata.id,
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
  async delete(): Promise<boolean> {
    const res = await kernel.deleteTarget({
      id: this.metadata.id,
      page: PageAll,
    });
    if (res.success) {
      this.user.companys = this.user.companys.filter((i) => i.key != this.key);
    }
    return res.success;
  }
  get subTarget(): ITarget[] {
    return this.departments;
  }
  get parentTarget(): ITarget[] {
    return [this, ...this.groups];
  }
  get chats(): IMsgChat[] {
    const chats: IMsgChat[] = [this];
    for (const item of this.cohorts) {
      chats.push(...item.chats);
    }
    for (const item of this.departments) {
      chats.push(...item.chats);
    }
    for (const item of this.stations) {
      chats.push(...item.chats);
    }
    if (this.superAuth) {
      chats.push(...this.superAuth.chats);
    }
    chats.push(...this.memberChats);
    return chats;
  }
  override loadMemberChats(_newMembers: schema.XTarget[], _isAdd: boolean): void {
    _newMembers
      .filter((i) => i.id != this.user.metadata.id)
      .forEach((i) => {
        if (_isAdd) {
          this.memberChats.push(
            new PersonMsgChat(
              this.metadata.id,
              i.id,
              {
                name: i.name,
                typeName: i.typeName,
                avatar: parseAvatar(i.icon),
              },
              ['同事'],
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
    await this.loadGroups(reload);
    await this.loadDepartments(reload);
    await this.loadStations(reload);
    await this.loadCohorts(reload);
    await this.loadMembers(reload);
    await this.loadSuperAuth(reload);
    await this.loadDicts(reload);
    await this.loadSpecies(reload);
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
  }
}
