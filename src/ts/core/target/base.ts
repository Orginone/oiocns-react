import { XMarketArray, XTarget } from '@/ts/base/schema';
import { kernel, model, common, schema, FaildResult } from '../../base';
import { TargetType } from '../enum';
import AppStore from '../market/appstore';

export default class BaseTarget {
  public readonly target: schema.XTarget;
  protected _joinedMarkets: AppStore[];

  protected get createTargetType(): TargetType[] {
    return [TargetType.Cohort];
  }
  protected get joinTargetType(): TargetType[] {
    return [TargetType.Cohort, TargetType.Person];
  }

  constructor(target: schema.XTarget) {
    this.target = target;
    this._joinedMarkets = [];
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
  ): Promise<model.ResultType<XTarget>> {
    if (this.createTargetType.includes(typeName)) {
      return await kernel.createTarget({
        id: '',
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
   * 申请加入组织/个人
   * @param destId 加入的组织/个人id
   * @param typeName 对象
   * @returns
   */
  public async applyJoin(destId: string, typeName: TargetType) {
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
   * 申请加入市场
   * @param id 市场ID
   * @returns
   */
  public async applyJoinMarket(id: string): Promise<model.ResultType<any>> {
    return await kernel.applyJoinMarket({ id: id, belongId: this.target.id });
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

  public async getTargetByName(
    data: model.NameTypeModel,
  ): Promise<model.ResultType<XTarget>> {
    return await kernel.queryTargetByName(data);
  }

  /**
   * 查询商店列表
   * @returns 商店列表
   */
  public async getJoinMarkets(): Promise<AppStore[]> {
    if (this._joinedMarkets.length > 0) {
      return this._joinedMarkets;
    }
    const res = await kernel.queryOwnMarket({
      id: this.target.id,
      page: { offset: 0, limit: common.Constants.MAX_UINT_16, filter: '' },
    });
    if (res.success) {
      if(res.data.result!=undefined){
      res.data.result.forEach((market) => {
        this._joinedMarkets.push(new AppStore(market));
      });
    }
    }
    return this._joinedMarkets;
  }

  /**
   * 退出市场
   * @param appStore 退出的市场
   * @returns
   */
  public async quitMarket(appStore: AppStore): Promise<model.ResultType<any>> {
    const res = await kernel.quitMarket({
      id: appStore.store.id,
      belongId: this.target.id,
    });
    if (res.success) {
      delete this._joinedMarkets[this._joinedMarkets.indexOf(appStore)];
    }
    return res;
  }

  /**
   * 拉对象加入组织
   * @param data 拉入参数
   * @returns 拉入结果
   */
  public async pull(data: any): Promise<model.ResultType<any>> {
    data.id = this.target.id;
    data.teamTypes = [this.target.typeName];
    return await kernel.pullAnyToTeam(data);
  }

  /**
   * 根据编号查询市场
   * @param page 分页参数
   * @returns
   */
  public async getMarketByCode(
    page: model.PageRequest,
  ): Promise<model.ResultType<XMarketArray>> {
    return await kernel.queryMarketByCode({
      id: '',
      page,
    });
  }

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
}
