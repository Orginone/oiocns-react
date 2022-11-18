import { XTarget } from './../../base/schema';
import { TargetType } from '../enum';
import BaseTarget from './base';
import { model, schema, FaildResult,kernel,common } from '../../base';
import Cohort from './cohort';
import Company from './company';
import University from './university';
import Hospital from './hospital';
import AppStore from '../market/appstore'

export default class Person extends BaseTarget {
  private _friends: schema.XTarget[];
  private _curCompany: Company | undefined;
  private _joinedCompanys: Company[];
  private _joinedCohorts: Cohort[];
  private _joinedStores: AppStore[];
  constructor(target: schema.XTarget) {
    super(target);
    this._friends = [];
    this._joinedCohorts = [];
    this._joinedCompanys = [];
    this._joinedStores = [];
    //初始化时填入信息
    this.getCohort();
    this.getFriends();
  }

  protected override get createTargetType(): TargetType[] {
    return [
      TargetType.Group,
      TargetType.Company,
      TargetType.Hospital,
      TargetType.University,
      TargetType.Cohort,
    ];
  }

  protected override get joinTargetType(): TargetType[] {
    return [
      TargetType.Person,
      TargetType.Company,
      TargetType.Hospital,
      TargetType.University,
      TargetType.Cohort,
    ];
  }
  /** 支持的单位类型数组 */
  public get companyTypes(): TargetType[] {
    return [TargetType.Company, TargetType.University, TargetType.Hospital];
  }

  public get ChohortArray(): Cohort[] {
    return this._joinedCohorts;
  }
  /**
   * 获取群组列表
   * @param params 
   * @returns 
   */
  public async getCohort(): Promise<model.ResultType<any>> {
    const res = await this.getjoined({
      spaceId: this.target.id,
      JoinTypeNames: [TargetType.Cohort],
    });
    if (res.success) {
      this._joinedCohorts = [];
      for (var i = 0; i < res.data.result.length; i++) {
        const cohort = new Cohort(res.data.result[i])
        this._joinedCohorts.push(cohort);
      }
    }
    return res;
  }

  /** 支持的群组类型数组*/
  public get cohortTypes(): TargetType[] {
    return [TargetType.Cohort];
  }

  // 购买
  buyApp() {
    console.log('buyApp');
  }
  //加购物车
  addCart() {
    console.log('addCart');
  }
  //获取订单
  getOrderList() {
    console.log('getOrderList');
  }
  //取消订单
  cancleOrder() {
    console.log('cancleOrder');
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
    const res = await this.createTarget(
      name,
      code,
      TargetType.Cohort,
      name,
      code,
      remark,
    );
    if (res.success) {
      const cohort = new Cohort(res.data);
      this._joinedCohorts.push(cohort);
      return cohort.pullPersons([this.target.id]);
    }
    return false;
  }

  /**
   * 删除群组
   * @param params 
   * @returns 
   */
  public async deleteCohorts(
    params: model.IdReqModel
  ): Promise<model.ResultType<any>> {
    let res = await kernel.deleteTarget(params);
    if (res.success) {
      this.getCohort();
    }
    return res;
  }
  /**
     * 搜索群组
     * @param params id:targetId,TypeName:枚举中取当前角色,belongId: 归属ID;
     * @returns 
     */
  public async searchCohorts(name: string
  ): Promise<model.ResultType<any>> {
    const data:model.NameTypeModel = {
      name: name,
      typeName: TargetType.Cohort,
      page : {
        offset: 0,
        filter: name,
        limit: common.Constants.MAX_UINT_16,
      }
    }
    const res = await kernel.searchTargetByName(data);
    if (res.success) {
      this.getCohort();
    }
    return res;
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
  ): Promise<model.ResultType<XTarget>> {
    if (!this.companyTypes.includes(type)) {
      return FaildResult('您无法创建该类型单位!');
    }
    const res = await this.createTarget(name, code, type, teamName, teamCode, remark);
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
      company.pullPersons([this.target.id]);
    }
    return res;
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
      JoinTypeNames: [TargetType.Person],
    });
    if (res.success) {
      this._friends = res.data.result;
    }
    return this._friends;
  }

  /**
   * 查询我的产品/应用
   * @param params
   * @returns
   */
  public async queryMyProduct(): Promise<model.ResultType<schema.XProductArray>> {
    // model.IDBelongReq
    let paramData: any = {};
    paramData.id = this.target.id;
    paramData.page = {
      offset: 0,
      filter: this.target.id,
      limit: common.Constants.MAX_UINT_8,
    };
    return await kernel.querySelfProduct(paramData);
  }

  /**
   * @description: 查询我加入的群
   * @return {*} 查询到的群组
   */
  public async getJoinedCohorts(): Promise<Cohort[]> {
    if (this._joinedCohorts.length > 0) {
      return this._joinedCohorts;
    }
    let res = await this.getjoined({
      spaceId: this.target.id,
      JoinTypeNames: this.cohortTypes,
    });
    if (res.success && res.data && res.data.result) {
      res.data.result.forEach((item) => {
        switch (item.typeName) {
          case TargetType.Cohort:
            this._joinedCohorts.push(new Cohort(item));
            break;
        }
      });
    }
    return this._joinedCohorts;
  }

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
      JoinTypeNames: this.companyTypes,
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
   * 移除好友
   * @param id 好友Id
   */
  public async removeFriend(id: string): Promise<model.ResultType<any>> {
    const res = await this.cancelJoinTeam(id);
    if (res.success) {
      var index = this._friends.findIndex((friend) => {
        return friend.id == id;
      });
      if (index > 0) {
        delete this._friends[index];
      }
    }
    return res;
  }

  /**
   * 退出群组
   * @param id 群组Id
   */
  public async quitCohorts(id: string): Promise<model.ResultType<any>> {
    const res = await this.cancelJoinTeam(id);
    if (res.success) {
      var index = this._joinedCohorts.findIndex((cohort) => {
        return cohort.target.id == id;
      });
      if (index > 0) {
        delete this._joinedCohorts[index];
      }
    }
    return res;
  }

  /**
   * 退出单位
   * @param id 单位Id
   */
  public async quitCompany(id: string): Promise<model.ResultType<any>> {
    const res = await this.cancelJoinTeam(id);
    if (res.success) {
      var index = this._joinedCompanys.findIndex((cohort) => {
        return cohort.target.id == id;
      });
      if (index > 0) {
        delete this._joinedCompanys[index];
      }
    }
    return res;
  }
}
