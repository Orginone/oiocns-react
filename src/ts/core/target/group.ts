import BaseTarget from '@/ts/core/target/base';
import { faildResult, kernel, model, schema } from '../../base';
import { TargetType } from '../enum';
import consts from '../consts';
import { ITarget } from './itarget';

export default class Group extends BaseTarget {
  constructor(target: schema.XTarget) {
    super(target);
    this.subTypes = [TargetType.Group, ...consts.CompanyTypes];
    this.joinTargetType = [TargetType.Group];
    this.pullTypes = consts.CompanyTypes;
    this.searchTargetType = [...consts.CompanyTypes, TargetType.Group];
  }

  /**
   * 查询加入的集团
   * @returns
   */
  public async getJoinedGroups(): Promise<Group[]> {
    await super.getjoinedTargets();
    return <Group[]>super.joinTargets.filter((a) => {
      return (a.target.typeName = TargetType.Group);
    });
  }

  /**
   * 申请加入集团
   * @param id 目标Id
   * @returns
   */
  public async applyJoinGroup(id: string): Promise<model.ResultType<any>> {
    return super.applyJoin(id, TargetType.Group);
  }

  /**
   * 删除子集团
   * @param id 集团Id
   * @returns
   */
  public async deleteSubTarget(id: string): Promise<model.ResultType<any>> {
    const group = this.subTargets.find((group) => {
      return group.target.id == id;
    });
    if (group != undefined) {
      let res = await kernel.recursiveDeleteTarget({
        id: id,
        typeName: TargetType.Group,
        subNodeTypeNames: [TargetType.Group],
      });
      if (res.success) {
        this.subTargets = this.subTargets.filter((group) => {
          return group.target.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 获取集团下的人员（单位、集团）
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  public async getPersons(): Promise<ITarget[]> {
    await this.getSubTargets();
    return this.subTargets.filter((a) => {
      return a.target.typeName == TargetType.Person;
    });
  }

  /**
   * 获取集团下的单位
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  public async getCompanys(): Promise<ITarget[]> {
    await this.getSubTargets();
    return this.subTargets.filter((a) => {
      return consts.CompanyTypes.includes(<TargetType>a.target.typeName);
    });
  }

  /**
   * 获取集团下的集团
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  public async getSubGroups(): Promise<Group[]> {
    await this.getSubTargets();
    return <Group[]>this.subTargets.filter((a) => {
      return a.target.typeName == TargetType.Group;
    });
  }
}
