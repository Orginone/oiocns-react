import consts from '../consts';
import BaseTarget from './base';
import { ResultType } from '@/ts/base/model';
import { XTarget } from '@/ts/base/schema';
import { IGroup } from './itarget';
import { TargetType } from '../enum';
import { faildResult, kernel } from '@/ts/base';

export default class Group extends BaseTarget implements IGroup {
  subGroup: IGroup[];
  companys: XTarget[];
  joinedGroup: XTarget[];

  constructor(target: XTarget) {
    super(target);
    this.subGroup = [];
    this.companys = [];
    this.joinedGroup = [];
    this.subTypes = [TargetType.Group, ...consts.CompanyTypes];
    this.joinTargetType = [TargetType.Group];
    this.pullTypes = consts.CompanyTypes;
    this.searchTargetType = [...consts.CompanyTypes, TargetType.Group];
  }
  public async getJoinedGroups(): Promise<XTarget[]> {
    if (this.joinedGroup.length > 0) {
      return this.joinedGroup;
    }
    const res = await super.getjoinedTargets([TargetType.Group]);
    if (res.success) {
      res.data.result?.forEach((a) => {
        this.joinedGroup.push(a);
      });
    }
    return this.joinedGroup;
  }
  public async applyJoinGroup(id: string): Promise<ResultType<any>> {
    return super.applyJoin(id, TargetType.Group);
  }
  public async createSubGroup(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
  ): Promise<ResultType<any>> {
    const tres = await this.searchTargetByName(name, TargetType.Group);
    if (!tres.data) {
      const res = await this.createTarget(
        name,
        code,
        TargetType.Group,
        teamName,
        teamCode,
        remark,
      );
      if (res.success) {
        const group = new Group(res.data);
        this.subGroup.push(group);
        return await group.pullMember([this.target]);
      }
      return res;
    } else {
      return faildResult('该集团已存在!');
    }
  }
  public async deleteSubGroup(id: string): Promise<ResultType<any>> {
    const group = this.subGroup.find((group) => {
      return group.target.id == id;
    });
    if (group != undefined) {
      let res = await kernel.recursiveDeleteTarget({
        id: id,
        typeName: TargetType.Group,
        subNodeTypeNames: [TargetType.Group],
      });
      if (res.success) {
        this.subGroup = this.subGroup.filter((group) => {
          return group.target.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }
  public async getCompanys(): Promise<XTarget[]> {
    if (this.companys.length > 0) {
      return this.companys;
    }
    const res = await this.getSubTargets(consts.CompanyTypes);
    if (res.success && res.data.result != undefined) {
      this.companys = res.data.result;
    }
    return this.companys;
  }
  public async getSubGroups(): Promise<IGroup[]> {
    if (this.subGroup.length > 0) {
      return this.subGroup;
    }
    const res = await this.getSubTargets([TargetType.Group]);
    if (res.success) {
      res.data.result?.forEach((a) => {
        this.subGroup.push(new Group(a));
      });
    }
    return this.subGroup;
  }
}
