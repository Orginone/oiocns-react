import { PageRequest } from './../../base/model';
import { TargetType } from '../enum';
import { kernel, model, common, schema, FaildResult } from '../../base';
import { XIdentityArray } from '../../base/schema';

export default class BaseTarget {
  public readonly target: schema.XTarget;
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

  constructor(target: schema.XTarget) {
    this.target = target;
    this._ownIdentitys = [];
    this._allIdentitys = [];
    this._ownAuthoritys = [];
    this._allAuthoritys = [];
  }

  /**
   * 根据名称查询组织/个人
   * @param name
   * @param TypeName
   * @returns
   */
  public async searchTargetByName(
    name: string,
    TypeName: string,
  ): Promise<model.ResultType<any>> {
    const data: model.NameTypeModel = {
      name: name,
      typeName: TypeName,
      page: {
        offset: 0,
        filter: name,
        limit: common.Constants.MAX_UINT_16,
      },
    };
    return await kernel.searchTargetByName(data);
  }

  /**
   * 申请加入组织/个人
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
    } else {
      return FaildResult('您无法创建该类型对象!');
    }
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
      return FaildResult('您无法创建该类型对象!');
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
    return FaildResult('父职权不存在!');
  }

  /**
  // /**
  //  * 更新职权
  //  * @param data
  //  * @returns
  //  */
  //  public async UpdateAuthorityBase(data: any) {
  //   return await kernel.createAuthority({
  //     id: this.target.id,
  //     name: data.name,
  //     code: data.code,
  //     public: data.dPublic,
  //     parentId: data.parentId,
  //     belongId: this.target.id,
  //     remark: data.remark,
  //   });
  // }

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
    return FaildResult('您未拥有该职权!');
  }

  /**
   * 删除职权
   * @param id 职权Id
   * @returns
   */
  protected async deleteAuthority(id: string): Promise<model.ResultType<any>> {
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
    return FaildResult('您未拥有该职权!');
  }

  /**
   * 删除身份
   * @param id 身份Id
   * @returns
   */
  protected async deleteIdentity(id: string): Promise<model.ResultType<any>> {
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
    return FaildResult('您未拥有该身份!');
  }

  /**
   * 查询组织职权树
   * @param id
   * @returns
   */
  public async selectAuthorityTree(id: string): Promise<model.ResultType<any>> {
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
   * 查询发起的加入申请
   * @param id
   * @returns
   */
  public async queryJoinApplyBase(): Promise<model.ResultType<any>> {
    const params = {
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    };
    const res = await kernel.queryJoinTeamApply(params);
    return res;
  }

  /**
   * 根据职权查询身份
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
    if (res.success && res.data.result != undefined) {
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
    const res = await this.queryTargetIdentitys();
    if (res.success && res.data.result != undefined) {
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
  protected async getIdentityTargets(
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
   * 查询拥有的身份
   * @returns
   */
  protected async getOwnIdentitys(): Promise<schema.XIdentity[]> {
    //TODO
    return [];
  }

  /**
   * 查询拥有的身份
   * @returns
   */
  protected async getOwnAuthoritys(): Promise<schema.XIdentity[]> {
    //TODO
    return [];
  }

  /**
   * 查询职权子职权
   * @param id
   * @returns
   */
  protected async getSubAuthoritys(
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
  public async getSubTargets(
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
   * 查询组织或个人
   * @param data
   * @returns
   */
  public async getTargetByName(
    data: model.NameTypeModel,
  ): Promise<model.ResultType<schema.XTarget>> {
    return await kernel.queryTargetByName(data);
  }

  /**
   * 拉对象加入组织
   * @param data 拉入参数
   * @returns 拉入结果
   */
  public async pull(data: any): Promise<model.ResultType<any>> {
    return await kernel.pullAnyToTeam({
      id: this.target.id,
      teamTypes: [this.target.typeName],
      ...data,
    });
  }

  /**
   * 获取所有身份
   * @param data 请求参数
   * @returns 身份数组
   */
  public async queryTargetIdentitys(): Promise<model.ResultType<schema.XIdentityArray>> {
    return await kernel.queryTargetIdentitys({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  }
}
