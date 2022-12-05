import { TargetType } from '../enum';
import BaseTarget from './base';
import { schema } from '../../base';
import { ICohort } from './itarget';
import { ResultType, TargetModel } from '@/ts/base/model';

export default class Cohort extends BaseTarget implements ICohort {
  children: schema.XTarget[];
  constructor(target: schema.XTarget) {
    super(target);
    this.children = [];
    this.subTypes = [TargetType.Person, ...this.companyTypes];
    this.pullTypes = [TargetType.Person, TargetType.Cohort, ...this.companyTypes];
    this.searchTargetType = [TargetType.Person, ...this.companyTypes];
  }
  public async searchPerson(code: string): Promise<ResultType<schema.XTargetArray>> {
    return await this.searchTargetByName(code, [TargetType.Person]);
  }
  public async searchCompany(code: string): Promise<ResultType<schema.XTargetArray>> {
    return await this.searchTargetByName(code, this.companyTypes);
  }
  public async update(
    data: Omit<TargetModel, 'id' | 'teamName' | 'teamCode'>,
  ): Promise<ResultType<any>> {
    return await super.updateTarget({
      ...data,
      teamCode: data.code,
      belongId: data.belongId,
      teamName: data.name,
    });
  }
  public async getMember(reload: boolean): Promise<schema.XTarget[]> {
    if (!reload && this.children.length > 0) {
      return this.children;
    }
    const res = await super.getSubTargets(this.subTypes);
    if (res.success && res.data.result) {
      this.children = res.data.result;
    }
    return this.children;
  }
  public async pullMember(
    targets: schema.XTarget[],
  ): Promise<ResultType<schema.XRelationArray>> {
    const res = await super.pullMember(targets);
    if (res.success) {
      for (const value of targets) {
        const size = this.children.filter((obj) => obj.id == value.id).length;
        if (size == 0) {
          this.children.push(value);
        }
      }
    }
    return await super.pullMember(targets);
  }
  public async removeMember(
    ids: string[],
    typeName: TargetType,
  ): Promise<ResultType<any>> {
    const res = await super.removeMember(ids, typeName);
    const newChildren: schema.XTarget[] = [];
    if (res.success) {
      for (const a of this.children) {
        for (const b of ids) {
          if (a.id != b) {
            newChildren.push(a);
          }
        }
      }
    }
    if (newChildren.length != 0) {
      this.children = newChildren;
    }
    return res;
  }
}
