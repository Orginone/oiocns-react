import consts from '../consts';
import { ITarget } from './itarget';
import { TargetType } from '../enum';
import { kernel, model, common, schema, faildResult } from '../../base';
import Identity from './authority/identity';
import Authority from './authority/authority';

export default class BaseTarget implements ITarget {
  public target: schema.XTarget;
  public authorityTree: Authority | undefined;
  public ownIdentitys: Identity[];
  public allIdentitys: Identity[];
  public ownAuthoritys: Authority[];
  public allAuthoritys: Authority[];

  get createTargetType(): TargetType[] {
    return [TargetType.Cohort];
  }

  get joinTargetType(): TargetType[] {
    return [];
  }

  get searchTargetType(): TargetType[] {
    return [TargetType.Cohort, TargetType.Person];
  }

  constructor(target: schema.XTarget) {
    this.target = target;
    this.ownIdentitys = [];
    this.allIdentitys = [];
    this.ownAuthoritys = [];
    this.allAuthoritys = [];
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
      const data: model.NameTypeModel = {
        name: name,
        typeName: typeName,
        page: {
          offset: 0,
          filter: name,
          limit: common.Constants.MAX_UINT_16,
        },
      };
      return await kernel.searchTargetByName(data);
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
   * 获取加入的组织
   * @param data 请求参数
   * @returns 请求结果
   */
  protected async getjoined(
    data: Omit<model.IDReqJoinedModel, 'id' | 'typeName' | 'page'>,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await kernel.queryJoinedTargetById({
      id: this.target.id,
      typeName: this.target.typeName,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
      ...data,
    });
  }

  /**
   * 获取子组织/个人
   * @returns 返回好友列表
   */
  protected async getSubTargets(
    id: string,
    typeNames: string[],
    subTypeNames: string[],
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await kernel.querySubTargetById({
      id: id,
      typeNames: typeNames,
      subTypeNames: subTypeNames,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  }

  /**
   * 拉对象加入自身
   * @param targetIds 拉入对象Id集合
   * @param targetType 拉入对象类型
   * @returns 拉入结果
   */
  protected async pull(
    targetIds: string[],
    targetType: TargetType,
  ): Promise<model.ResultType<any>> {
    return await kernel.pullAnyToTeam({
      id: this.target.id,
      teamTypes: [this.target.typeName],
      targetIds,
      targetType,
    });
  }

  /**
   * 拉自身进组织(创建组织的时候调用)
   * @param id
   * @param teamTypes
   * @returns
   */
  protected async join(
    id: string,
    teamTypes: TargetType[],
  ): Promise<model.ResultType<any>> {
    return await kernel.pullAnyToTeam({
      id,
      teamTypes,
      targetType: this.target.typeName,
      targetIds: [this.target.id],
    });
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
   * 删除对象
   * @param id 对象Id
   * @param typeName 对象类型
   * @returns
   */
  protected async deleteTarget(
    id: string,
    typeName: TargetType,
  ): Promise<model.ResultType<any>> {
    if (this.createTargetType.includes(typeName)) {
      return await kernel.deleteTarget({
        id,
        typeName,
        belongId: this.target.id,
      });
    } else {
      return faildResult(consts.UnauthorizedError);
    }
  }

  /**
   * 创建职权
   * @param name 名称
   * @param code 编号
   * @param ispublic 是否公开
   * @param parentId 父类别ID
   * @param remark 备注
   * @returns
   */
  public async createAuthority(
    name: string,
    code: string,
    ispublic: boolean,
    parentId: string,
    remark: string,
  ): Promise<model.ResultType<schema.XAuthority>> {
    let parent = this.ownAuthoritys.find((auth) => {
      return auth.id == parentId;
    });
    if (parent != undefined) {
      const res = await kernel.createAuthority({
        id: undefined,
        name,
        code,
        parentId,
        remark,
        public: ispublic,
        belongId: this.target.id,
      });
      if (res.success && res.data != undefined) {
        this.ownAuthoritys.push(new Authority(res.data));
      }
      return res;
    }
    return faildResult('父职权不存在!');
  }

  /**
   * 创建身份
   * @param name 名称
   * @param code 编号
   * @param authId 职权Id
   * @param remark 备注
   * @returns
   */
  public async createIdentity(
    name: string,
    code: string,
    authId: string,
    remark: string,
  ): Promise<model.ResultType<schema.XIdentity>> {
    const auth = this.ownIdentitys.find((auth) => {
      return auth.id == authId;
    });
    if (auth != undefined) {
      const res = await kernel.createIdentity({
        name,
        code,
        authId,
        remark,
        id: undefined,
        belongId: this.target.id,
      });
      if (res.success && res.data != undefined) {
        this.ownIdentitys.push(new Identity(res.data));
      }
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 删除职权
   * @param id 职权Id
   * @returns
   */
  public async deleteAuthority(id: string): Promise<model.ResultType<any>> {
    const index = this.ownAuthoritys.findIndex((auth) => {
      return auth.id == id;
    });
    if (index > 0) {
      const res = await kernel.deleteAuthority({
        id,
        belongId: this.target.id,
        typeName: '',
      });
      if (res.success) {
        this.ownAuthoritys = this.ownAuthoritys.filter((auth) => {
          return auth.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 删除身份
   * @param id 身份Id
   * @returns
   */
  public async deleteIdentity(id: string): Promise<model.ResultType<any>> {
    const index = this.ownIdentitys.findIndex((identity) => {
      return identity.id == id;
    });
    if (index > 0) {
      const res = await kernel.deleteIdentity({
        id,
        belongId: this.target.id,
        typeName: '',
      });
      if (res.success) {
        this.ownIdentitys = this.ownIdentitys.filter((identity) => {
          return identity.id != id;
        });
      }
      return res;
    }
    return faildResult('您未拥有该身份!');
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

  /**
   * 查询当前空间赋予我该角色的组织
   * @param id
   * @returns
   */
  public async queryTargetsByAuthority(
    id: string,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await kernel.queryTargetsByAuthority({
      spaceId: this.target.id,
      authId: id,
    });
  }

  /**
   * 查询组织所有职权
   * @returns
   */
  public async getAllAuthoritys(): Promise<Authority[]> {
    if (this.allAuthoritys.length > 0) {
      return this.allAuthoritys;
    }
    const res = await kernel.queryTargetAuthoritys({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success) {
      res.data.result?.forEach((auth) => {
        this.allAuthoritys.push(new Authority(auth));
      });
    }
    return this.allAuthoritys;
  }

  /**
   * 查询组织所有身份
   * @returns
   */
  public async getAllIdentitys(): Promise<Identity[]> {
    if (this.allIdentitys.length > 0) {
      return this.allIdentitys;
    }
    const res = await kernel.queryTargetIdentitys({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success) {
      res.data.result?.forEach((auth) => {
        this.allIdentitys.push(new Identity(auth));
      });
    }
    return this.allIdentitys;
  }

  /**
   * 查询当前空间下拥有的身份
   * @returns
   */
  public async getOwnIdentitys(): Promise<Identity[]> {
    if (this.ownIdentitys.length > 0) {
      return this.ownIdentitys;
    }
    const res = await kernel.querySpaceIdentitys({ id: this.target.id });
    if (res.success) {
      res.data.result?.forEach((auth) => {
        this.ownIdentitys.push(new Identity(auth));
      });
    }
    return this.ownIdentitys;
  }
}
