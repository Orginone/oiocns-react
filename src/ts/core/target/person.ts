import { XTarget } from './../../base/schema';
import { TargetType } from '../enum';
import BaseTarget from './base';
import { common, kernel, model, schema, FaildResult } from '../../base';
import Cohort from './cohort';
import Company from './company';
import University from './university';
import Hospital from './hospital';
import { data } from '@/components/CardOrTableComp/config';

export default class Person extends BaseTarget {
  private _friends: schema.XTarget[];
  private _curCompany: Company | undefined;
  private _joinedCompanys: Company[];
  private _joinedCohorts: Cohort[];
  // private _joinedStores: AppStore[];
  constructor(target: schema.XTarget) {
    super(target);

    this._friends = [];
    this._joinedCohorts = [];
    this._joinedCompanys = [];
    this.setCohort();
  }
  /**
   * 初始化填入群组信息
   */
  private setCohort() {
    const page: model.PageRequest = {
      offset: 0,
      limit: 10,
      filter: '',
    }
    const params: model.IDReqJoinedModel = {
      id: this.target.id,
      typeName: TargetType.Person,
      JoinTypeNames: [TargetType.Cohort],
      spaceId: this.target.id,
      page: page
    }
    console.log("私有构造方法参数", params)
    this.getCohort(params)
  }


  /** 支持的单位类型数组 */
  public get companyTypes(): TargetType[] {
    return [TargetType.Company, TargetType.University, TargetType.Hospital];
  }
  /**
   * 获取群组列表
   * @param params id:个人ID TypeName:枚举中取当前角色 JoinTypeNames:枚举中取待查寻组织类型 spaceId:空间id page
   * @returns 
   */
  public async getCohort(
    params: model.IDReqJoinedModel
  ): Promise<model.ResultType<any>> {
    let res = await kernel.queryJoinedTargetById(params);
    if (res.success) {
      for(var i=0;i<res.data.result.length;i++){
        const cohort = new Cohort(res.data.result[i])
        this._joinedCohorts.push(cohort);
     }    }
    return res;
  }

  /**
 * 删除群组
 * @param params 
 * @returns 
 */
  public async deleteCohort(
    params: model.IdReqModel
  ): Promise<model.ResultType<any>> {
    let res = await kernel.deleteTarget(params);
    if(res.success){
      this.setCohort()
    }
    return res;
  }

  /** 支持的群组类型数组*/
  public get cohortTypes(): TargetType[] {
    return [TargetType.Cohort];
  }

  /**
   * 创建群组
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns 是否创建成功
   */
  public async createCohort(
    name: string,
    code: string,
    remark: string,
  ): Promise<boolean> {
    const res = await this._create({
      name,
      code,
      teamName: name,
      teamCode: code,
      teamRemark: remark,
    });
    if (res.success) {
      const cohort = new Cohort(res.data);
      this._joinedCohorts.push(cohort);
      return cohort.pullPersons([this.target.id]);
    }
    return false;
  }

  /**
   * 设立单位
   * @param name 单位名称
   * @param code 单位信用代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 单位简介
   * @param type 单位类型,默认'单位',可选:'大学','医院','单位'
   * @returns 是否成功
   */
  public async createCompany(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
    type: TargetType = TargetType.Company,
  ): Promise<boolean> {
    if (!this.companyTypes.includes(type)) {
      return false;
    }
    const res = await this._create({
      name,
      code,
      teamName,
      teamCode,
      typeName: type,
      teamRemark: remark,
    });
    if (res.success) {
      let company;
      switch (type) {
        case TargetType.University:
          company = new University(res.data);
          break;
        case TargetType.Hospital:
          company = new Hospital(res.data);
          break;
        default:
          company = new Company(res.data);
          break;
      }
      this._joinedCompanys.push(company);
      return company.pullPersons([this.target.id]);
    }
    return false;
  }

  /**
   * 申请加入群组
   * @param _cohortId 群组id
   */
  public async applyJoinCohort(_cohortId: string): Promise<boolean> {
    const res = await kernel.applyJoinTeam({
      id: _cohortId,
      targetId: this.target.id,
      teamType: TargetType.Cohort,
      targetType: TargetType.Person,
    });
    return res.success;
  }

  /**
   * 申请加入单位
   * @param _companyId 单位id
   */
  public applyJoinCompany(_companyId: string): void { }

  /**
   * 获取单位列表
   * @return 加入的单位列表
   */
  public async getJoinedCompanys(): Promise<Company[]> {
    if (this._joinedCompanys.length > 0) {
      return this._joinedCompanys;
    }
    let res = await this.getjoined({
      spaceId: this.target.id,
      joinTypeNames: this.companyTypes,
    });
    if (res.success && res.data && res.data.result) {
      res.data.result.forEach((item) => {
        switch (item.typeName) {
          case TargetType.University:
            this._joinedCompanys.push(new University(item));
            break;
          case TargetType.Hospital:
            this._joinedCompanys.push(new Hospital(item));
            break;
          default:
            this._joinedCompanys.push(new Company(item));
            break;
        }
      });
    }
    return this._joinedCompanys;
  }

  /**
   * 获取好友列表
   * @returns 返回好友列表
   */
  public async getFriends(): Promise<XTarget[]> {
    if (this._friends.length > 0) {
      return this._friends;
    }
    const res = await this.getjoined({
      spaceId: this.target.id,
      joinTypeNames: TargetType.Person,
    });
    if (res.success) {
      this._friends = res.data.result;
    }
    return this._friends;
  }

  /** 查询商店列表树
   * queryOwnMarket
   */
  public async getJoinMarkets(): Promise<AppStore[]> {
    if (this._joinedStores.length <= 0) {
      const res = await kernel.queryOwnMarket({
        id: this.target.id,
        page: { offset: 0, limit: common.Constants.MAX_UINT_16, filter: '' },
      });
      if (res.success) {
        res.data.result.forEach((market) => {
          this._joinedStores.push(new AppStore(market));
        });
      }
    }
    return this._joinedStores;
  }

  /**
   * 退出市场
   * @param appStore 退出的市场
   * @returns
   */
  public async quitMarket(appStore: AppStore): Promise<model.ResultType<any>> {
    const res = await kernel.quitMarket({
      id: appStore.getStore.id,
      belongId: this.target.id,
    });
    if (res.success) {
      delete this._joinedStores[this._joinedStores.indexOf(appStore)];
    }
    return res;
  }

  /**
   * 创建对象
   * @param data 创建参数
   * @returns 创建结果
   */
  private async _create(data: any): Promise<model.ResultType<any>> {
    data.belongId = this.target.id;
    data.typeName = TargetType.Cohort;
    if (this._curCompany && this._curCompany.target.id) {
      data.typeName = TargetType.JobCohort;
      data.belongId = this._curCompany.target.id;
    }
    return await kernel.createTarget(data);
  }
}
