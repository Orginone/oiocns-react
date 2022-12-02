import { IWorking } from './itarget';
import { schema } from '../../base';
import BaseTarget from './base';
import { TargetType } from '../enum';
import { ResultType, TargetModel } from '@/ts/base/model';

/**
 * 工作组的元操作
 */
export default class Working extends BaseTarget implements IWorking {
  workings: IWorking[];
  person: schema.XTarget[];
  constructor(target: schema.XTarget) {
    super(target);

    this.workings = [];
    this.person = [];

    this.pullTypes = [TargetType.Person];
    this.subTypes = [TargetType.Working];
    this.createTargetType = [TargetType.Working];
  }
  public async update(
    data: Omit<TargetModel, 'id'>,
  ): Promise<ResultType<schema.XTarget>> {
    return await super.updateTarget(data);
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
  public async removePerson(ids: string[]): Promise<ResultType<any>> {
    const res = await super.removeMember(ids, TargetType.Person);
    if (res.success) {
      this.person = this.person.filter((a) => {
        return !ids.includes(a.id);
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
