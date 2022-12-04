import userCtrl from '@/ts/controller/setting/userCtrl';
import consts from '../consts';
import BaseTarget from './base';
import { ResultType, TargetModel } from '@/ts/base/model';
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
  public async update(data: Omit<TargetModel, 'id'>): Promise<ResultType<XTarget>> {
    return await super.updateTarget(data);
  }
  public async getJoinedGroups(reload: boolean = false): Promise<XTarget[]> {
    if (!reload && this.joinedGroup.length > 0) {
      return this.joinedGroup;
    }
    const res = await super.getjoinedTargets([TargetType.Group]);
    if (res.success && res.data.result) {
      this.joinedGroup = res.data.result;
    }
    return this.joinedGroup;
  }
  public async applyJoinGroup(id: string): Promise<ResultType<any>> {
    return super.applyJoin(id, TargetType.Group);
  }
  public async createSubGroup(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<ResultType<any>> {
    const tres = await this.searchTargetByName(data.code, [TargetType.Group]);
    if (!tres.data) {
      const res = await this.createTarget({
        ...data,
        belongId: userCtrl.Company.target.id,
      });
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
  public async getCompanys(reload: boolean = false): Promise<XTarget[]> {
    if (!reload && this.companys.length > 0) {
      return this.companys;
    }
    const res = await this.getSubTargets(consts.CompanyTypes);
    if (res.success && res.data.result) {
      this.companys = res.data.result;
    }
    return this.companys;
  }
  public async getSubGroups(reload: boolean = false): Promise<IGroup[]> {
    if (!reload && this.subGroup.length > 0) {
      return this.subGroup;
    }
    const res = await this.getSubTargets([TargetType.Group]);
    if (res.success && res.data.result) {
      this.subGroup = res.data.result.map((a) => {
        return new Group(a);
      });
    }
    return this.subGroup;
  }
}
