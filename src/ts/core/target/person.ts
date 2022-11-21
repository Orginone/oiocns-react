import { TargetType } from '../enum';
import MarketActionTarget from './mbase';
import consts from '../consts';
import { model, schema, faildResult, kernel } from '../../base';
import Cohort from './cohort';
import Company from './company';
import University from './university';
import Hospital from './hospital';
import { validIsSocialCreditCode } from '@/utils/tools';

export default class Person extends MarketActionTarget {
  private _friends: schema.XTarget[];
  private _joinedCompanys: Company[];
  private _joinedCohorts: Cohort[];

  constructor(target: schema.XTarget) {
    super(target);
    this._friends = [];
    this._joinedCohorts = [];
    this._joinedCompanys = [];
  }

  protected override get createTargetType(): TargetType[] {
    return [TargetType.Cohort, ...consts.CompanyTypes];
  }

  protected override get joinTargetType(): TargetType[] {
    return [TargetType.Person, TargetType.Cohort, ...consts.CompanyTypes];
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
    if (res.success && res.data != undefined && res.data.result != undefined) {
      this._joinedCohorts = [];
      for (var i = 0; i < res.data?.result.length; i++) {
        const cohort = new Cohort(res.data?.result[i]);
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
    if (res.success && res.data != undefined) {
      const cohort = new Cohort(res.data);
      this._joinedCohorts.push(cohort);
      return cohort.pullPersons([this.target.id]);
    }
    return false;
  }

  /**
   * 解散群组
   * @param id 群组id
   * @param belongId 群组归属id
   * @returns
   */
  public async deleteCohorts(
    id: string,
    belongId: string,
  ): Promise<model.ResultType<any>> {
    let res = await kernel.deleteTarget({
      id: id,
      typeName: TargetType.Cohort,
      belongId: belongId,
    });
    if (res.success) {
      this._joinedCohorts = this._joinedCohorts.filter((obj) => obj.target.id != id);
    }
    return res;
  }

  /**
<<<<<<< HEAD
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
    console.log('好友查询结果', res);
    if (res.success) {
      if (res.data != undefined && res.data.result != undefined) {
        this._friends = res.data.result;
      }
    }
    return this._friends;
  }

  /**
=======
>>>>>>> dev
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
  ): Promise<model.ResultType<any>> {
    if (!consts.CompanyTypes.includes(type)) {
      return faildResult('您无法创建该类型单位!');
    }
    if (!validIsSocialCreditCode(code)) {
      return faildResult('请填写正确的代码!');
    }
    const tres = await this.getTargetByName({
      name,
      typeName: type,
      page: { offset: 0, limit: 1, filter: code },
    });
    if (!tres.data) {
      const res = await this.createTarget(name, code, type, teamName, teamCode, remark);
      if (res.success && res.data != undefined) {
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
      return res;
    } else {
      return faildResult('该单位已存在!');
    }
  }

  /**
<<<<<<< HEAD
   * 查询我的产品/应用
   * @param params
   * @returns
   */
  public async queryMyProduct(): Promise<schema.XProductArray> {
    let resultArray: any = [];
    let paramData: any = {};
    paramData.id = this.target.id;
    paramData.page = {
      offset: 0,
      filter: '',
      limit: common.Constants.MAX_UINT_8,
    };
    let res = await kernel.querySelfProduct(paramData);
    if (res.success && res.data && res.data.result) {
      resultArray = res.data.result;
    }
    return resultArray;
  }

  /**
   * 查询我的个人产品/应用
   * @param params
   * @returns
   */
  public async queryMySpaceProduct(): Promise<schema.XProductArray> {
    let resultArray: any = [];
    // 判断如果是有个人空间
    if (!this._curCompany) {
      return resultArray;
    }

    let paramData: any = {};
    paramData.id = this._joinedCompanys[0].target.id;
    paramData.page = {
      offset: 0,
      filter: '',
      limit: common.Constants.MAX_UINT_8,
    };
    let res = await kernel.querySelfProduct(paramData);
    if (res.success && res.data && res.data.result) {
      resultArray = res.data.result;
    }
    return resultArray;
  }

=======
   * 获取好友列表
   * @returns 返回好友列表
   */
  public async getFriends(): Promise<schema.XTarget[]> {
    if (this._friends.length > 0) {
      return this._friends;
    }
    const res = await this.getSubTargets(
      this.target.id,
      [TargetType.Person],
      [TargetType.Person],
    );
    if (res.success && res?.data?.result != undefined) {
      this._friends = res.data.result;
    }
    return this._friends;
  }
>>>>>>> dev
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
      JoinTypeNames: [TargetType.Cohort],
    });
    if (res.success) {
      res.data?.result?.forEach((item) => {
        this._joinedCohorts.push(new Cohort(item));
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
    this._joinedCompanys = [];
    let res = await this.getjoined({
      spaceId: this.target.id,
      JoinTypeNames: consts.CompanyTypes,
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
   * 申请好友
   * @param id 目标Id
   * @returns
   */
  public async applyFriend(id: string): Promise<model.ResultType<any>> {
    const res = await kernel.pullAnyToTeam({
      id: this.target.id,
      teamTypes: [TargetType.Person],
      targetIds: [id],
      targetType: TargetType.Person,
    });
    if (res.success) {
      await this.applyJoin(id, TargetType.Person);
    }
    return res;
  }

  /**
   * 取消好友申请
   * @param id 好友Id
   * @returns
   */
  public async cancelJoinApply(id: string): Promise<model.ResultType<any>> {
    return await kernel.cancelJoinTeam({
      id,
      typeName: TargetType.Person,
      belongId: this.target.id,
    });
  }

  /**
   * 移除好友
   * @param id 好友Id
   */
  public async removeFriend(ids: string[]): Promise<model.ResultType<any>> {
    const res = await kernel.removeAnyOfTeam({
      id: this.target.id,
      teamTypes: [this.target.typeName],
      targetIds: ids,
      targetType: TargetType.Person,
    });
    if (res.success) {
      ids.forEach(async (id) => {
        await kernel.exitAnyOfTeam({
          id,
          teamTypes: [TargetType.Person],
          targetId: this.target.id,
          targetType: TargetType.Person,
        });
      });
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
        this._joinedCohorts = this._joinedCohorts.filter((cohort) => {
          return cohort.target.id != id;
        });
      }
    }
    return res;
  }

  /**
   * 退出单位
   * @param id 单位Id
   */
  public async quitCompany(id: string): Promise<model.ResultType<any>> {
    const res = await kernel.exitAnyOfTeamAndBelong({
      id,
      teamTypes: [
        TargetType.JobCohort,
        TargetType.Department,
        TargetType.Cohort,
        ...consts.CompanyTypes,
      ],
      targetId: this.target.id,
      targetType: TargetType.Person,
    });
    this._joinedCompanys = this._joinedCompanys.filter((company) => {
      return company.target.id != id;
    });
    return res;
  }
}
