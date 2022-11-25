import { TargetType } from '../enum';
import BaseTarget from './base';
import { schema } from '../../base';
import consts from '../consts';
import { ICohort } from './itarget';
import { ResultType } from '@/ts/base/model';

export default class Cohort extends BaseTarget implements ICohort {
  children: schema.XTarget[];
  constructor(target: schema.XTarget) {
    super(target);
    this.children = [];
    this.subTypes = [TargetType.Person, ...consts.CompanyTypes];
    this.pullTypes = [TargetType.Person, ...consts.CompanyTypes];
    this.searchTargetType = [TargetType.Person, ...consts.CompanyTypes];
  }
  public async update(
    name: string,
    code: string,
    remark: string,
  ): Promise<ResultType<any>> {
    return await super.updateTarget(name, code, name, code, remark);
  }
  public async getMember(): Promise<schema.XTarget[]> {
    if (this.children.length > 0) {
      return this.children;
    }
    const res = await super.getSubTargets(this.subTypes);
    if (res.success) {
      res.data.result?.forEach((a) => {
        this.children.push(a);
      });
    }
    return this.children;
  }
  public async pullMember(
    targets: schema.XTarget[],
  ): Promise<ResultType<schema.XRelationArray>> {
    return await super.pullMember(targets);
  }
  public async removeMember(
    ids: string[],
    typeName: TargetType,
  ): Promise<ResultType<any>> {
    return await super.removeMember(ids, typeName);
  }
}
