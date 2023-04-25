import { TargetModel } from './../../base/model';
import BaseTarget from '@/ts/core/target/base';
import { departmentTypes, subDepartmentTypes, TargetType } from '../enum';
import { schema } from '../../base';
import { IDepartment, ISpace, ITarget, IWorking, TargetParam } from './itarget';
import Working from './working';
import { logger } from '@/ts/base/common';
import { IChat } from './chat/ichat';

/**
 * 部门的元操作
 */
export default class Department extends BaseTarget implements IDepartment {
  workingsLoaded: boolean = false;
  workings: IWorking[];
  person: schema.XTarget[];
  departmentsLoaded: boolean = false;
  departments: IDepartment[];
  private _onDeleted: Function;

  constructor(
    target: schema.XTarget,
    space: ISpace,
    userId: string,
    onDeleted: Function,
  ) {
    super(target, space, userId);
    this.person = [];
    this.workings = [];
    this.departments = [];
    this._onDeleted = onDeleted;
    if ([TargetType.Department, TargetType.College].includes(this.typeName)) {
      this.subTeamTypes = [...subDepartmentTypes, TargetType.Working];
    } else {
      this.subTeamTypes = [TargetType.JobCohort, TargetType.Working];
    }
    if (this.typeName === TargetType.College) {
      this.subTeamTypes.unshift(TargetType.Major);
    }
    this.createTargetType = [...this.subTeamTypes];
  }
  public get subTeam(): ITarget[] {
    return [...this.departments, ...this.workings];
  }
  async loadSubTeam(reload?: boolean): Promise<ITarget[]> {
    await this.getDepartments(reload);
    await this.getWorkings(reload);
    return [...this.departments, ...this.workings];
  }

  public async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadSubTeam(reload);
    for (const item of this.departments) {
      await item.deepLoad(reload);
    }
  }

  allChats(): IChat[] {
    const chats = [this.chat];
    for (const item of this.departments) {
      chats.push(...item.allChats());
    }
    for (const item of this.workings) {
      chats.push(...item.allChats());
    }
    return chats;
  }

  public async create(data: TargetModel): Promise<ITarget | undefined> {
    switch (data.typeName as TargetType) {
      case TargetType.Working:
        return this.createWorking(data);
      default:
        return this.createDepartment(data);
    }
  }

  async delete(): Promise<boolean> {
    const res = await this.deleteTarget();
    if (res.success) {
      this._onDeleted?.apply(this, []);
    }
    return res.success;
  }

  public async getDepartments(reload: boolean = false): Promise<IDepartment[]> {
    if (!reload && this.departmentsLoaded) {
      return this.departments;
    }
    this.departmentsLoaded = true;
    const res = await super.getSubTargets(departmentTypes);
    if (res.success) {
      this.departments =
        res.data.result?.map((a) => {
          return new Department(a, this.space, this.userId, () => {
            this.departments = this.departments.filter((i) => {
              return i.id != a.id;
            });
          });
        }) ?? [];
    } else {
      this.departmentsLoaded = false;
    }
    return this.departments;
  }
  public async getWorkings(reload: boolean = false): Promise<IWorking[]> {
    if (!reload && this.workingsLoaded) {
      return this.workings;
    }
    this.workingsLoaded = true;
    const res = await super.getSubTargets([TargetType.Working]);
    if (res.success) {
      this.workings =
        res.data.result?.map((a) => {
          return new Working(a, this.space, this.userId, () => {
            this.workings = this.workings.filter((i) => {
              return i.id != a.id;
            });
          });
        }) ?? [];
    } else {
      this.workingsLoaded = false;
    }
    return this.workings;
  }

  public async createDepartment(data: TargetParam): Promise<IDepartment | undefined> {
    data.teamCode = data.teamCode == '' ? data.code : data.teamCode;
    data.teamName = data.teamName == '' ? data.name : data.teamName;
    if (!this.subTeamTypes.includes(data.typeName as TargetType)) {
      logger.warn('不支持该机构');
      return;
    }
    const res = await super.createSubTarget({ ...data, belongId: this.target.belongId });
    if (res.success) {
      const department = new Department(res.data, this.space, this.userId, () => {
        this.departments = this.departments.filter((i) => {
          return i.id != department.id;
        });
      });
      this.departments.push(department);
      return department;
    }
  }

  public async deleteDepartment(id: string): Promise<boolean> {
    const res = await super.deleteSubTarget(
      id,
      TargetType.Department,
      this.target.belongId,
    );
    if (res.success) {
      this.departments = this.departments.filter((a) => {
        a.chat.destroy();
        return a.target.id != id;
      });
      return true;
    }
    return false;
  }

  public async createWorking(
    data: Omit<TargetModel, 'id'>,
  ): Promise<IWorking | undefined> {
    data.teamCode = data.teamCode == '' ? data.code : data.teamCode;
    data.teamName = data.teamName == '' ? data.name : data.teamName;
    const res = await super.createSubTarget(data);
    if (res.success) {
      const working = new Working(res.data, this.space, this.userId, () => {
        this.workings = this.workings.filter((i) => {
          return i.id != working.id;
        });
      });
      this.workings.push(working);
      return working;
    }
  }

  public async deleteWorking(id: string): Promise<boolean> {
    const res = await super.deleteSubTarget(id, TargetType.Working, this.target.belongId);
    if (res.success) {
      this.workings = this.workings.filter((a) => {
        a.chat.destroy();
        return a.target.id != id;
      });
      return true;
    }
    return false;
  }
}
