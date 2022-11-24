import consts from '../consts';
import { ITarget } from './itarget';
import { TargetType } from '../enum';
import { kernel, model, common, schema, faildResult } from '../../base';
import Authority from './authority/authority';
import Department from './department';
import Working from './working';
import Provider from '../provider';
import Group from './group';
import Company from './company';
import Hospital from './hospital';
import University from './university';

export default class BaseTarget implements ITarget {
  public target: schema.XTarget;
  public subTypes: TargetType[];
  public pullTypes: TargetType[];
  public subTargets: ITarget[];
  public joinTargets: ITarget[];
  public authorityTree: Authority | undefined;

  public createTargetType: TargetType[];
  public joinTargetType: TargetType[];
  public searchTargetType: TargetType[];

  constructor(target: schema.XTarget) {
    this.target = target;
    this.subTypes = [];
    this.pullTypes = [];
    this.subTargets = [];
    this.joinTargets = [];
    this.createTargetType = [];
    this.joinTargetType = [];
    this.searchTargetType = [];
  }

  public async createSubTarget(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
    targetType: TargetType,
  ): Promise<model.ResultType<any>> {
    if (this.subTypes.includes(targetType)) {
      const res = await this.createTarget(
        name,
        code,
        targetType,
        teamName,
        teamCode,
        remark,
      );
      if (res.success) {
        this.subTargets.push(this.dealTarget(res.data));
        return await kernel.pullAnyToTeam({
          id: this.target.id,
          teamTypes: [this.target.typeName],
          targetIds: [res.data?.id],
          targetType: targetType,
        });
      }
    }
    return faildResult(consts.UnauthorizedError);
  }

  public async deleteSubTarget(id: string): Promise<model.ResultType<any>> {
    const sub = this.subTargets.find((sub) => {
      return (
        sub.target.id == id && this.subTypes.includes(<TargetType>sub.target.typeName)
      );
    });
    if (sub != undefined) {
      let res = await kernel.deleteTarget({
        id: id,
        typeName: sub.target.typeName,
        belongId: Provider.spaceId,
      });
      if (res.success) {
        this.subTargets = this.subTargets.filter((sub) => {
          return sub.target.id != id;
        });
      }
    }
    return faildResult(consts.UnauthorizedError);
  }

  protected dealTarget(target: schema.XTarget): ITarget {
    switch (<TargetType>target.typeName) {
      case TargetType.Company:
        return new Company(target);
      case TargetType.Hospital:
        return new Hospital(target);
      case TargetType.University:
        return new University(target);
      case TargetType.Department:
        return new Department(target);
      case TargetType.Working:
        return new Working(target);
      case TargetType.Group:
        return new Group(target);
      default:
        return new BaseTarget(target);
    }
  }

  public async pullMember(targets: schema.XTarget[]): Promise<model.ResultType<any>> {
    targets = targets.filter((a) => {
      return this.pullTypes.includes(<TargetType>a.typeName);
    });
    const res = await kernel.pullAnyToTeam({
      id: this.target.id,
      teamTypes: [this.target.typeName],
      targetIds: targets.map((a) => {
        return a.id;
      }),
      targetType: <TargetType>targets[0].typeName,
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        const target = targets.find((s) => {
          return s.id == a.targetId;
        });
        if (target != undefined) {
          this.subTargets.push(this.dealTarget(target));
        }
      });
    }
    return res;
  }

  public async removeMember(
    ids: string[],
    typeName: TargetType,
  ): Promise<model.ResultType<any>> {
    if (this.pullTypes.includes(typeName)) {
      const res = await kernel.removeAnyOfTeam({
        id: this.target.id,
        teamTypes: [this.target.typeName],
        targetIds: ids,
        targetType: typeName,
      });
      if (res.success) {
        this.subTargets = this.subTargets.filter((target) => {
          return !ids.includes(target.target.id);
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 根据名称查询组织/个人
   * @param name 名称
   * @param TypeName 类型
   * @returns
   */
  public async searchTargetByName(
    name: string,
    typeName: TargetType,
  ): Promise<model.ResultType<any>> {
    if (this.searchTargetType.includes(typeName)) {
      return await kernel.searchTargetByName({
        name: name,
        typeName: typeName,
        page: {
          offset: 0,
          filter: name,
          limit: common.Constants.MAX_UINT_16,
        },
      });
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 申请加入组织/个人 (好友申请除外)
   * @param destId 加入的组织/个人id
   * @param typeName 对象
   * @returns
   */
  public async applyJoin(
    destId: string,
    typeName: TargetType,
  ): Promise<model.ResultType<any>> {
    if (this.joinTargetType.includes(typeName)) {
      return await kernel.applyJoinTeam({
        id: destId,
        targetId: this.target.id,
        teamType: typeName,
        targetType: this.target.typeName,
      });
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 取消加入组织/个人
   * @param id 申请Id/目标Id
   * @returns
   */
  protected async cancelJoinTeam(id: string): Promise<model.ResultType<any>> {
    return await kernel.cancelJoinTeam({
      id,
      belongId: this.target.id,
      typeName: this.target.typeName,
    });
  }

  /**
   * 查询我的申请
   * @returns
   */
  public queryJoinApply = async () => {
    return await kernel.queryJoinTeamApply({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  };

  /**
   * 查询我的审批
   * @returns
   */
  public async queryJoinApproval(): Promise<model.ResultType<schema.XRelationArray>> {
    return await kernel.queryTeamJoinApproval({
      id: this.target.typeName == TargetType.Person ? '0' : this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  }

  /**
   * 审批我的加入组织/个人申请
   * @param id
   * @param status
   * @returns
   */
  public async approvalJoinApply(
    id: string,
    status: number,
  ): Promise<model.ResultType<any>> {
    return await kernel.joinTeamApproval({
      id,
      status,
    });
  }

  /**
   * 获取加入的组织
   * @param data 请求参数
   * @returns 请求结果
   */
  public async getjoinedTargets(forceFlash: boolean = false): Promise<ITarget[]> {
    if (!forceFlash && this.joinTargets.length > 0) {
      return this.joinTargets;
    }
    const res = await kernel.queryJoinedTargetById({
      id: this.target.id,
      typeName: this.target.typeName,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
      spaceId: Provider.spaceId,
      JoinTypeNames: this.joinTargetType,
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        this.joinTargets.push(this.dealTarget(a));
      });
    }
    return this.joinTargets;
  }

  /**
   * 获取子组织/个人
   * @returns 返回好友列表
   */
  public async getSubTargets(forceFlash: boolean = false): Promise<ITarget[]> {
    if (!forceFlash && this.subTargets.length > 0) {
      return this.subTargets;
    }
    const res = await kernel.querySubTargetById({
      id: this.target.id,
      typeNames: [this.target.typeName],
      subTypeNames: this.subTypes,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        this.subTargets.push(this.dealTarget(a));
      });
    }
    return this.subTargets;
  }

  /**
   * 拉自身进组织(创建组织的时候调用)
   * @param id
   * @param teamTypes
   * @returns
   */
  protected async join(target: schema.XTarget): Promise<model.ResultType<any>> {
    if (this.joinTargetType.includes(<TargetType>target.typeName)) {
      const res = await kernel.pullAnyToTeam({
        id: this.target.id,
        teamTypes: [target.typeName],
        targetType: this.target.typeName,
        targetIds: [this.target.id],
      });
      if (res.success) {
        this.joinTargets.push(this.dealTarget(target));
      }
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 创建对象
   * @param name 名称
   * @param code 编号
   * @param typeName 类型
   * @param teamName team名称
   * @param teamCode team编号
   * @param teamRemark team备注
   * @returns
   */
  protected async createTarget(
    name: string,
    code: string,
    typeName: TargetType,
    teamName: string,
    teamCode: string,
    teamRemark: string,
  ): Promise<model.ResultType<schema.XTarget>> {
    if (this.createTargetType.includes(typeName)) {
      return await kernel.createTarget({
        name,
        code,
        typeName,
        teamCode,
        teamName,
        teamRemark,
        belongId: this.target.id,
      });
    } else {
      return faildResult(consts.UnauthorizedError);
    }
  }

  /**
   * 更新组织、对象
   * @param name 名称
   * @param code 编号
   * @param typeName 类型
   * @param teamName team名称
   * @param teamCode team编号
   * @param teamRemark team备注
   * @returns
   */
  public async updateTarget(
    name: string,
    code: string,
    teamName: string = '',
    teamCode: string = '',
    teamRemark: string,
  ): Promise<model.ResultType<schema.XTarget>> {
    teamCode = teamCode == '' ? code : teamCode;
    teamName = teamName == '' ? code : teamName;
    let res = await kernel.updateTarget({
      name,
      code,
      teamCode,
      teamName,
      teamRemark,
      id: this.target.id,
      belongId: this.target.belongId,
      typeName: this.target.typeName,
    });
    if (res.success) {
      this.target.name = name;
      this.target.code = code;
      if (this.target.team != undefined) {
        this.target.team.name = name;
        this.target.team.code = code;
        this.target.team.remark = teamRemark;
      }
    }
    return res;
  }

  /**
   * 查询组织职权树
   * @param id
   * @returns
   */
  public async selectAuthorityTree(): Promise<Authority | undefined> {
    if (this.authorityTree != undefined) {
      return this.authorityTree;
    }
    const res = await kernel.queryAuthorityTree({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success) {
      this.authorityTree = this.loopBuildAuthority(res.data);
    }
    return this.authorityTree;
  }

  private loopBuildAuthority(auth: schema.XAuthority): Authority {
    const authority = new Authority(auth);
    auth.nodes?.forEach((a) => {
      authority.children.push(this.loopBuildAuthority(a));
    });
    return authority;
  }

  // /**
  //  * 查询当前空间赋予我该角色的组织
  //  * @param id
  //  * @returns
  //  */
  // public async queryTargetsByAuthority(
  //   id: string,
  // ): Promise<model.ResultType<schema.XTargetArray>> {
  //   return await kernel.queryTargetsByAuthority({
  //     spaceId: this.target.id,
  //     authId: id,
  //   });
  // }

  // /**
  //  * 查询组织所有职权
  //  * @returns
  //  */
  // public async getAllAuthoritys(): Promise<Authority[]> {
  //   if (this.allAuthoritys.length > 0) {
  //     return this.allAuthoritys;
  //   }
  //   const res = await kernel.queryTargetAuthoritys({
  //     id: this.target.id,
  //     page: {
  //       offset: 0,
  //       filter: '',
  //       limit: common.Constants.MAX_UINT_16,
  //     },
  //   });
  //   if (res.success) {
  //     res.data.result?.forEach((auth) => {
  //       this.allAuthoritys.push(new Authority(auth));
  //     });
  //   }
  //   return this.allAuthoritys;
  // }

  // /**
  //  * 查询当前空间下拥有的身份
  //  * @returns
  //  */
  // public async getOwnIdentitys(): Promise<Identity[]> {
  //   if (this.ownIdentitys.length > 0) {
  //     return this.ownIdentitys;
  //   }
  //   const res = await kernel.querySpaceIdentitys({ id: this.target.id });
  //   if (res.success) {
  //     res.data.result?.forEach((auth) => {
  //       this.ownIdentitys.push(new Identity(auth));
  //     });
  //   }
  //   return this.ownIdentitys;
  // }
}
