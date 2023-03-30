import { TargetModel } from './../../base/model';
import BaseTarget from '@/ts/core/target/base';
import { departmentTypes, subDepartmentTypes, TargetType } from '../enum';
import { schema } from '../../base';
import { IDepartment, ITarget, IWorking, TargetParam } from './itarget';
import Working from './working';
import { logger } from '@/ts/base/common';

/**
 * 部门的元操作
 */
export default class Department extends BaseTarget implements IDepartment {
  workings: IWorking[];
  person: schema.XTarget[];
  departments: IDepartment[];
  private _onDeleted: Function;

  constructor(target: schema.XTarget, onDeleted: Function) {
    super(target);
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
    if (!reload && this.departments.length > 0) {
      return this.departments;
    }
    const res = await super.getSubTargets(departmentTypes);
    if (res.success && res.data.result) {
      this.departments = res.data.result.map((a) => {
        return new Department(a, () => {
          this.departments = this.departments.filter((i) => {
            return i.id != a.id;
          });
        });
      });
    }
    return this.departments;
  }
  public async getWorkings(reload: boolean = false): Promise<IWorking[]> {
    if (!reload && this.workings.length > 0) {
      return this.workings;
    }
    const res = await super.getSubTargets([TargetType.Working]);
    if (res.success && res.data.result) {
      this.workings = res.data.result.map((a) => {
        return new Working(a, () => {
          this.workings = this.workings.filter((i) => {
            return i.id != a.id;
          });
        });
      });
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
      const department = new Department(res.data, () => {
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
      const working = new Working(res.data, () => {
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
        return a.target.id != id;
      });
      return true;
    }
    return false;
  }
}
