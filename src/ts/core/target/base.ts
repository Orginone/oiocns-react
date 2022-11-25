import consts from '../consts';
import { TargetType } from '../enum';
import { kernel, model, common, schema, faildResult } from '../../base';
import Authority from './authority/authority';
import Provider from '../provider';

export default class BaseTarget {
  public target: schema.XTarget;
  public subTypes: TargetType[];
  public pullTypes: TargetType[];
  public authorityTree: Authority | undefined;

  public createTargetType: TargetType[];
  public joinTargetType: TargetType[];
  public searchTargetType: TargetType[];

  constructor(target: schema.XTarget) {
    this.target = target;
    this.subTypes = [];
    this.pullTypes = [];
    this.createTargetType = [];
    this.joinTargetType = [];
    this.searchTargetType = [];
  }

  protected async createSubTarget(
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

  protected async deleteSubTarget(
    id: string,
    typeName: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.deleteTarget({
      id: id,
      typeName: typeName,
      belongId: Provider.spaceId,
    });
  }

  public async pullMember(
    targets: schema.XTarget[],
  ): Promise<model.ResultType<schema.XRelationArray>> {
    targets = targets.filter((a) => {
      return this.pullTypes.includes(<TargetType>a.typeName);
    });
    if (targets.length > 0) {
      const res = await kernel.pullAnyToTeam({
        id: this.target.id,
        teamTypes: [this.target.typeName],
        targetIds: targets.map((a) => {
          return a.id;
        }),
        targetType: <TargetType>targets[0].typeName,
      });
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }

  protected async removeMember(
    ids: string[],
    typeName: TargetType,
  ): Promise<model.ResultType<any>> {
    if (this.pullTypes.includes(typeName)) {
      return await kernel.removeAnyOfTeam({
        id: this.target.id,
        teamTypes: [this.target.typeName],
        targetIds: ids,
        targetType: typeName,
      });
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 根据名称查询组织/个人
   * @param name 名称
   * @param TypeName 类型
   * @returns
   */
  protected async searchTargetByName(
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
  protected async applyJoin(
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
   * 审批我的加入组织/个人申请
   * @param id
   * @param status
   * @returns
   */
  protected async approvalJoinApply(
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
  protected async getjoinedTargets(
    typeNames: TargetType[],
  ): Promise<model.ResultType<schema.XTargetArray>> {
    typeNames = typeNames.filter((a) => {
      return this.joinTargetType.includes(a);
    });
    if (typeNames.length > 0) {
      return await kernel.queryJoinedTargetById({
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
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 获取子组织/个人
   * @returns 返回好友列表
   */
  protected async getSubTargets(
    typeNames: TargetType[],
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await kernel.querySubTargetById({
      id: this.target.id,
      typeNames: [this.target.typeName],
      subTypeNames: typeNames,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  }

  /**
   * 拉自身进组织(创建组织的时候调用)
   * @param target 目标对象
   * @returns
   */
  protected async join(target: schema.XTarget): Promise<model.ResultType<any>> {
    if (this.joinTargetType.includes(<TargetType>target.typeName)) {
      return await kernel.pullAnyToTeam({
        id: this.target.id,
        teamTypes: [target.typeName],
        targetType: this.target.typeName,
        targetIds: [this.target.id],
      });
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
  protected async updateTarget(
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

  protected loopBuildAuthority(auth: schema.XAuthority): Authority {
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
