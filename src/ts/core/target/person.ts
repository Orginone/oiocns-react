/* eslint-disable no-unused-vars */
import { TargetType } from '../enum';
import BaseTarget from './base';
import Cohort from './cohort';
import Company from './company';
import { kernel, model, schema } from '../../base';
import University from './university';
import Hospital from './hospital';

export default class Person extends BaseTarget {
  private _curCompany: Company | undefined;
  private _joinedCompanys: Company[];
  private _joinedCohorts: Cohort[];
  constructor(target: schema.XTarget) {
    super(target);
    this._joinedCohorts = [];
    this._joinedCompanys = [];
  }
  /** 支持的单位类型数组 */
  public get companyTypes(): TargetType[] {
    return [TargetType.Company, TargetType.University, TargetType.Hospital];
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
  public applyJoinCompany(_companyId: string): void {}

  /**
   * 获取单位列表
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
