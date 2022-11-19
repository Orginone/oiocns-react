import { TargetType } from '../enum';
import { kernel, model, common, schema, FaildResult } from '../../base';

export default class BaseTarget {
  public readonly target: schema.XTarget;
  protected identitys: schema.XIdentity[];
  protected get createTargetType(): TargetType[] {
    return [TargetType.Cohort];
  }
  protected get joinTargetType(): TargetType[] {
    return [TargetType.Cohort, TargetType.Person];
  }

  constructor(target: schema.XTarget) {
    this.target = target;
    this.identitys = [];
  }

  /**
   * 根据名称查询组织/个人
   * @param name
   * @param TypeName
   * @returns
   */
  public async search(name: string, TypeName: string): Promise<model.ResultType<any>> {
    const data: model.NameTypeModel = {
      name: name,
      typeName: TypeName,
      page: {
        offset: 0,
        filter: name,
        limit: common.Constants.MAX_UINT_16,
      },
    };
    const res = await kernel.searchTargetByName(data);
    return res;
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
   * 取消加入组织/取消好友请求
   * @param id 目标组织/个人Id
   * @returns
   */
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

  public async getIdentitys(): Promise<schema.XIdentity[]> {
    if (this.identitys.length > 0) {
      return this.identitys;
    }
    this.identitys = [];
    const res = await this.queryTargetIdentitys();
    if (res.success && res.data.result != undefined) {
      res.data.result.forEach((identity) => {
        this.identitys.push(identity);
      });
    }
    return this.identitys;
  }
}
