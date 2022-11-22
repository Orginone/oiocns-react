import { PageRequest } from '@/ts/base/model';
import { TargetType } from '../enum';
import consts from '../consts';
import SpaceTarget from './sbase';
import { kernel, model, common, schema, faildResult } from '../../base';

export default class BaseTarget extends SpaceTarget {
  // 拥有的身份
  public _ownIdentitys: schema.XIdentity[];
  public _allIdentitys: schema.XIdentity[];
  public _ownAuthoritys: schema.XAuthority[];
  public _allAuthoritys: schema.XAuthority[];

  protected get createTargetType(): TargetType[] {
    return [TargetType.Cohort];
  }

  protected get joinTargetType(): TargetType[] {
    return [TargetType.Cohort, TargetType.Person];
  }

  protected get searchTargetType(): TargetType[] {
    return [TargetType.Cohort, TargetType.Person];
  }

  constructor(target: schema.XTarget) {
    super(target);
    this._ownIdentitys = [];
    this._allIdentitys = [];
    this._ownAuthoritys = [];
    this._allAuthoritys = [];
  }

  /**
   * 根据名称查询组织/个人
   * @param name 名称
   * @param TypeName 类型
   * @returns
   */
  searchTargetByName = async (
    name: string,
    typeName: TargetType,
  ): Promise<model.ResultType<any>> => {
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
      return kernel.searchTargetByName(data);
    }
    return faildResult(consts.UnauthorizedError);
  };

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
    let parent = this._ownAuthoritys.find((auth) => {
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
        this._ownAuthoritys.push(res.data);
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
    const auth = this._ownIdentitys.find((auth) => {
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
        this._ownIdentitys.push(res.data);
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
    const index = this._ownAuthoritys.findIndex((auth) => {
      return auth.id == id;
    });
    if (index > 0) {
      const res = await kernel.deleteAuthority({
        id,
        belongId: this.target.id,
        typeName: '',
      });
      if (res.success) {
        delete this._ownAuthoritys[index];
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
    const index = this._ownIdentitys.findIndex((identity) => {
      return identity.id == id;
    });
    if (index > 0) {
      const res = await kernel.deleteIdentity({
        id,
        belongId: this.target.id,
        typeName: '',
      });
      if (res.success) {
        delete this._ownIdentitys[index];
      }
      return res;
    }
    return faildResult('您未拥有该身份!');
  }

  /**
   * 更新职权
   * @param id 唯一ID
   * @param name 名称
   * @param code 编号
   * @param ispublic 公开的
   * @param remark 备注
   * @returns
   */
  public async updateAuthority(
    id: string,
    name: string,
    code: string,
    ispublic: boolean,
    remark: string,
  ): Promise<model.ResultType<schema.XAuthority>> {
    let auth = this._allAuthoritys.find((authority) => {
      return authority.id == id;
    });
    if (auth != undefined) {
      const res = await kernel.updateAuthority({
        name,
        code,
        remark,
        id: auth.id,
        public: ispublic,
        belongId: auth.belongId,
        parentId: auth.parentId,
      });
      if (res.success) {
        auth.name = name;
        auth.code = code;
        auth.public = ispublic;
        auth.remark = remark;
        auth.updateTime = res.data?.updateTime;
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 更新身份
   * @param id 唯一ID
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns
   */
  public async updateIdentity(
    id: string,
    name: string,
    code: string,
    remark: string,
  ): Promise<model.ResultType<schema.XIdentity>> {
    let iden = this._allIdentitys.find((identity) => {
      return identity.id == id;
    });
    if (iden != undefined) {
      const res = await kernel.updateIdentity({
        name,
        code,
        remark,
        id: iden.id,
        authId: iden.authId,
        belongId: iden.belongId,
      });
      if (res.success) {
        iden.name = name;
        iden.code = code;
        iden.remark = remark;
        iden.updateTime = res.data?.updateTime;
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 赋予组织个人身份
   * @param id 身份Id
   * @param targetIds 组织/个人Id集合
   * @returns
   */
  public async giveIdentity(
    id: string,
    targetIds: string[],
  ): Promise<model.ResultType<any>> {
    let iden = this._allIdentitys.find((identity) => {
      return identity.id == id;
    });
    if (iden != undefined) {
      return await kernel.giveIdentity({ id, targetIds });
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 移除赋予给组织/个人的身份
   * @param id 身份Id
   * @param targetIds 组织/个人Id集合
   * @returns
   */
  public async removeIdentity(
    id: string,
    targetIds: string[],
  ): Promise<model.ResultType<any>> {
    let iden = this._allIdentitys.find((identity) => {
      return identity.id == id;
    });
    if (iden != undefined) {
      return await kernel.removeIdentity({
        id,
        targetIds,
      });
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 查询组织职权树
   * @param id
   * @returns
   */
  public async selectAuthorityTree(
    id: string,
  ): Promise<model.ResultType<schema.XAuthority>> {
    const params = {
      id: id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    };
    const res = await kernel.queryAuthorityTree(params);
    return res;
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
  public async queryjoinApproval(): Promise<model.ResultType<schema.XRelationArray>> {
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
   * 审批我的申请
   * @param id
   * @param status
   * @returns
   */
  public async approvalJoinApply(
    id: string,
    status: number,
  ): Promise<model.ResultType<any>> {
    return await kernel.approvalJoinApply({
      id,
      status,
    });
  }

  /**
   * 查询指定职权下的身份列表
   * @param id
   * @returns
   */
  public async queryAuthorityIdentity(
    id: string,
  ): Promise<model.ResultType<schema.XIdentityArray>> {
    return await kernel.queryAuthorityIdentitys({
      id: id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  }

  /**
   * 查询当前空间赋予我该角色的组织
   * @param id
   * @returns
   */
  public queryTargetsByAuthority = async (id: string) => {
    return await kernel.queryTargetsByAuthority({
      spaceId: this.target.id,
      authId: id,
    });
  };

  /**
   * 查询组织所有职权
   * @returns
   */
  public async getAllAuthoritys(): Promise<schema.XAuthority[]> {
    if (this._allAuthoritys.length > 0) {
      return this._allAuthoritys;
    }
    const res = await kernel.queryTargetAuthoritys({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success && res?.data?.result != undefined) {
      this._allAuthoritys = res.data.result;
    }
    return this._allAuthoritys;
  }

  /**
   * 查询组织所有身份
   * @returns
   */
  public async getAllIdentitys(): Promise<schema.XIdentity[]> {
    if (this._allIdentitys.length > 0) {
      return this._allIdentitys;
    }
    const res = await kernel.queryTargetIdentitys({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success && res?.data?.result != undefined) {
      this._allIdentitys = res.data.result;
    }
    return this._allIdentitys;
  }

  protected async cancelJoinTeam(id: string) {
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
   * 查询指定身份赋予的组织/人员
   * @param id
   * @param targetType
   * @returns
   */
  public async getIdentityTargets(
    id: string,
    targetType: TargetType,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await kernel.queryIdentityTargets({
      id: id,
      targetType: targetType,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  }

  /**
   * 查询当前空间下拥有的身份
   * @returns
   */
  public async getOwnIdentitys(): Promise<schema.XIdentity[]> {
    if (this._ownIdentitys.length > 0) {
      return this._ownIdentitys;
    }
    const res = await kernel.querySpaceIdentitys({ id: this.target.id });
    if (res.success && res.data.result != undefined) {
      this._ownIdentitys = res.data.result;
    }
    return this._ownIdentitys;
  }

  /**
   * 查询职权子职权
   * @param id
   * @returns
   */
  public async getSubAuthoritys(
    id: string,
    page: PageRequest,
  ): Promise<model.ResultType<schema.XAuthorityArray>> {
    return await kernel.querySubAuthoritys({
      id: id,
      page,
    });
  }

  /**
   * 获取子组织/个人
   * @returns 返回好友列表
   */
  protected async getSubTargets(
    id: string,
    typeNames: TargetType[],
    subTypeNames: TargetType[],
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
  protected pull = async (
    targetIds: string[],
    targetType: TargetType,
  ): Promise<model.ResultType<any>> => {
    return await kernel.pullAnyToTeam({
      id: this.target.id,
      teamTypes: [this.target.typeName],
      targetIds,
      targetType,
    });
  };

  /**
   * 拉自身进组织(创建组织的时候调用)
   * @param id
   * @param teamTypes
   * @returns
   */
  protected join = async (
    id: string,
    teamTypes: TargetType[],
  ): Promise<model.ResultType<any>> => {
    return await kernel.pullAnyToTeam({
      id,
      teamTypes,
      targetType: this.target.typeName,
      targetIds: [this.target.id],
    });
  };
}
