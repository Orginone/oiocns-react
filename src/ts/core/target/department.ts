import { TargetModel } from './../../base/model';
import BaseTarget from '@/ts/core/target/base';
import { TargetType } from '../enum';
import { schema } from '../../base';
import { IDepartment, IWorking } from './itarget';
import { ResultType } from '@/ts/base/model';
import Working from './working';

/**
 * 部门的元操作
 */
export default class Department extends BaseTarget implements IDepartment {
  workings: IWorking[];
  person: schema.XTarget[];
  departments: IDepartment[];

  constructor(target: schema.XTarget) {
    super(target);
    this.person = [];
    this.workings = [];
    this.departments = [];

    this.pullTypes = [TargetType.Person];
    this.subTypes = [TargetType.Department, TargetType.Working];
    this.createTargetType = [TargetType.Department, TargetType.Working];
  }
  public async update(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<ResultType<schema.XTarget>> {
    return await super.updateTarget(data);
  }
  public async getPerson(): Promise<schema.XTarget[]> {
    if (this.person.length > 0) {
      return this.person;
    }
    const res = await super.getSubTargets([TargetType.Person]);
    if (res.success && res.data.result != undefined) {
      this.person = res.data.result;
    }
    return this.person;
  }
  public async getDepartments(): Promise<IDepartment[]> {
    if (this.departments.length > 0) {
      return this.departments;
    }
    const res = await super.getSubTargets([TargetType.Department]);
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
    const res = await super.getSubTargets([TargetType.Working]);
    if (res.success) {
      res.data.result?.forEach((a) => {
        this.workings.push(new Working(a));
      });
    }
    return this.workings;
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
  public async removePerson(targets: schema.XTarget[]): Promise<ResultType<any>> {
    const res = await super.removeMember(
      targets.map((a) => a.id),
      TargetType.Person,
    );
    if (res.success) {
      this.person = this.person.filter((a) => {
        return (
          targets.find((t) => {
            return a.id == t.id;
          }) == undefined
        );
      });
    }
    return res;
  }
  public async createDepartment(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<ResultType<any>> {
    const res = await super.createSubTarget(data);
    if (res.success) {
      this.departments.push(new Department(res.data));
    }
    return res;
  }
  public async deleteDepartment(id: string): Promise<ResultType<any>> {
    const res = await super.deleteSubTarget(id, TargetType.Department);
    if (res.success) {
      this.departments = this.departments.filter((a) => {
        return a.target.id != id;
      });
    }
    return res;
  }
  public async createWorking(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<ResultType<any>> {
    const res = await super.createSubTarget(data);
    if (res.success) {
      this.workings.push(new Working(res.data));
    }
    return res;
  }
  public async deleteWorking(id: string): Promise<ResultType<any>> {
    const res = await super.deleteSubTarget(id, TargetType.Working);
    if (res.success) {
      this.workings = this.workings.filter((a) => {
        return a.target.id != id;
      });
    }
    return res;
  }
}
