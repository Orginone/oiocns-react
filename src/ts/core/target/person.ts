import { TargetType } from '../enum';
import consts from '../consts';
import { model, schema, faildResult, kernel } from '@/ts/base';
import Cohort from './cohort';
import Company from './company';
import University from './university';
import Hospital from './hospital';
import { validIsSocialCreditCode } from '@/utils/tools';
import { ITarget } from './itarget';
import MarketTarget from './mbase';

export default class Person extends MarketTarget {
  constructor(target: schema.XTarget) {
    super(target);
    this.searchTargetType = [
      TargetType.Cohort,
      TargetType.Person,
      ...consts.CompanyTypes,
    ];
    this.subTypes = [];
    this.pullTypes = [TargetType.Person];
    this.joinTargetType = [TargetType.Person, TargetType.Cohort, ...consts.CompanyTypes];
    this.createTargetType = [TargetType.Cohort, ...consts.CompanyTypes];
  }

  /**
   * @description: 查询我加入的群
   * @return {*} 查询到的群组
   */
  public async getJoinedCohorts(): Promise<Cohort[]> {
    await this.getjoinedTargets();
    return <Cohort[]>this.joinTargets.filter((a) => {
      return a.target.typeName == TargetType.Cohort;
    });
  }

  /**
   * 获取单位列表
   * @return 加入的单位列表
   */
  public async getJoinedCompanys(): Promise<Company[]> {
    await this.getjoinedTargets();
    return <Company[]>this.joinTargets.filter((a) => {
      return consts.CompanyTypes.includes(<TargetType>a.target.typeName);
    });
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
  ): Promise<model.ResultType<any>> {
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
      this.joinTargets.push(cohort);
      return cohort.pullMember([this.target]);
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
  ): Promise<model.ResultType<any>> {
    if (!consts.CompanyTypes.includes(type)) {
      return faildResult('您无法创建该类型单位!');
    }
    if (!validIsSocialCreditCode(code)) {
      return faildResult('请填写正确的代码!');
    }
    const tres = await this.searchTargetByName(name, type);
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
        this.joinTargets.push(company);
        return company.pullMember([this.target]);
      }
      return res;
    } else {
      return faildResult('该单位已存在!');
    }
  }

  /**
   * 解散群组
   * @param id 群组id
   * @param belongId 群组归属id
   * @returns
   */
  public async deleteCohort(id: string): Promise<model.ResultType<any>> {
    let res = await kernel.deleteTarget({
      id: id,
      typeName: TargetType.Cohort,
      belongId: this.target.id,
    });
    if (res.success) {
      this.joinTargets = this.joinTargets.filter((obj) => obj.target.id != id);
    }
    return res;
  }

  /**
   * 删除单位
   * @param id 单位Id
   * @returns
   */
  public async deleteCompany(id: string): Promise<model.ResultType<any>> {
    let res = await kernel.deleteTarget({
      id: id,
      typeName: TargetType.Company,
      belongId: this.target.id,
    });
    if (res.success) {
      this.joinTargets = this.joinTargets.filter((obj) => obj.target.id != id);
    }
    return res;
  }

  /**
   * 申请加入群组
   * @param id 目标Id
   * @returns
   */
  public async applyJoinCohort(id: string): Promise<model.ResultType<any>> {
    const cohort = this.joinTargets.find((cohort) => {
      return cohort.target.id == id;
    });
    if (cohort != undefined) {
      return faildResult(consts.IsJoinedError);
    }
    return await this.applyJoin(id, TargetType.Cohort);
  }

  /**
   * 申请加入单位
   * @param id 目标Id
   * @returns
   */
  public async applyJoinCompany(
    id: string,
    typeName: TargetType,
  ): Promise<model.ResultType<any>> {
    const company = this.joinTargets.find((company) => {
      return company.target.id == id;
    });
    if (company != undefined) {
      return faildResult(consts.IsJoinedError);
    }
    return await this.applyJoin(id, typeName);
  }

  /**
   * 退出群组
   * @param id 群组Id
   */
  public async quitCohorts(id: string): Promise<model.ResultType<any>> {
    const res = await this.cancelJoinTeam(id);
    if (res.success) {
      this.joinTargets = this.joinTargets.filter((cohort) => {
        return cohort.target.id != id;
      });
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
    this.joinTargets = this.joinTargets.filter((company) => {
      return company.target.id != id;
    });
    return res;
  }

  /**
   * 获取好友列表
   * @returns 返回好友列表
   */
  public async getFriends(): Promise<ITarget[]> {
    await this.getSubTargets();
    return this.subTargets.filter((a) => {
      return a.target.typeName == TargetType.Person;
    });
  }

  /**
   * 申请添加好友
   * @param target 目标
   * @returns
   */
  public async applyFriend(target: schema.XTarget): Promise<model.ResultType<any>> {
    const res = await this.pullMember([target]);
    if (res.success) {
      await this.applyJoin(target.id, TargetType.Person);
    }
    return res;
  }

  /**
   * 移除好友
   * @param id 好友Id
   */
  public async removeFriend(ids: string[]): Promise<model.ResultType<any>> {
    const res = await this.removeMember(ids, TargetType.Person);
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
   * 审批我的好友申请
   * @param relation 申请
   * @param status 状态
   * @returns
   */
  public async approvalFriendApply(
    relation: schema.XRelation,
    status: number,
  ): Promise<model.ResultType<any>> {
    const res = await this.approvalJoinApply(relation.id, status);
    if (res.success && relation.target != undefined) {
      this.subTargets.push(this.dealTarget(relation.target));
    }
    return res;
  }

  /**
   * 取消好友申请
   * @param id 好友Id
   * @returns
   */
  public async cancelJoinApply(id: string): Promise<model.ResultType<any>> {
    // TODO
    return await kernel.cancelJoinTeam({
      id,
      typeName: TargetType.Person,
      belongId: this.target.id,
    });
  }
}
