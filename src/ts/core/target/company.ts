import Group from './group';
import Cohort from './cohort';
import consts from '../consts';
import { TargetType } from '../enum';
import { faildResult, model, schema, kernel } from '@/ts/base';
import { validIsSocialCreditCode } from '@/utils/tools';
import BaseTarget from './base';
import Working from './working';
import Department from './department';
import MarketTarget from './mbase';
/**
 * 公司的元操作
 */
export default class Company extends MarketTarget {
  constructor(target: schema.XTarget) {
    super(target);
    this.subTypes = [
      // 工作群
      TargetType.JobCohort,
      // 工作组
      TargetType.Working,
      // 部门
      TargetType.Department,
      // 集团
      TargetType.Group,
      // 科室
      TargetType.Section,
    ];
    this.pullTypes = [TargetType.Person];
    this.joinTargetType = [TargetType.Group, TargetType.Cohort];
    this.createTargetType = [TargetType.Cohort, TargetType.Group];
    this.searchTargetType = [TargetType.Person, TargetType.Cohort, TargetType.Group];
  }

  /**
   * 创建集团
   * @param name 集团名称
   * @param code 集团代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 集团简介
   * @returns 是否成功
   */
  public async createGroup(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
  ): Promise<model.ResultType<any>> {
    const tres = await this.searchTargetByName(name, TargetType.Group);
    if (!tres.data) {
      const res = await this.createTarget(
        name,
        code,
        TargetType.Group,
        teamName,
        teamCode,
        remark,
      );
      if (res.success) {
        const group = new Group(res.data);
        this.joinTargets.push(group);
        return await this.pullMember([this.target]);
      }
      return res;
    } else {
      return faildResult('该集团已存在!');
    }
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
   * 删除集团
   * @param id 集团Id
   * @returns
   */
  public async deleteGroup(id: string): Promise<model.ResultType<any>> {
    const group = this.joinTargets.find((group) => {
      return group.target.id == id;
    });
    if (group != undefined) {
      let res = await kernel.recursiveDeleteTarget({
        id: id,
        typeName: TargetType.Group,
        subNodeTypeNames: [TargetType.Group],
      });
      if (res.success) {
        this.joinTargets = this.joinTargets.filter((group) => {
          return group.target.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
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
   *  退出集团
   * @param id 集团Id
   * @returns
   */
  public async quitGroup(id: string): Promise<model.ResultType<any>> {
    const group = await this.joinTargets.find((a) => {
      return a.target.id == id;
    });
    if (group != undefined) {
      const res = await kernel.recursiveExitAnyOfTeam({
        id,
        teamTypes: [TargetType.Group],
        targetId: this.target.id,
        targetType: this.target.typeName,
      });
      if (res.success) {
        this.joinTargets = this.joinTargets.filter((a) => {
          return a.target.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  }

  /**
   * 获取组织下的人员（单位、部门、工作组）
   * @param id 组织Id 默认为当前单位
   * @returns
   */
  public async getPersons(): Promise<BaseTarget[]> {
    await this.getSubTargets();
    return <BaseTarget[]>this.subTargets.filter((a) => {
      return a.target.typeName == TargetType.Person;
    });
  }

  /**
   * 获取组织下的部门（单位、部门）
   * @param id 组织Id 默认为当前单位
   * @returns
   */
  public async getDepartments(): Promise<Department[]> {
    await this.getSubTargets();
    return <Department[]>this.subTargets.filter((a) => {
      return a.target.typeName == TargetType.Department;
    });
  }

  /**
   * 获取组织下的工作组（单位、部门、工作组）
   * @param id 组织Id 默认为当前单位
   * @returns 返回好友列表
   */
  public async getWorkings(): Promise<Working[]> {
    await this.getSubTargets();
    return <Working[]>this.subTargets.filter((a) => {
      return a.target.typeName == TargetType.Working;
    });
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
   * @description: 查询我加入的集团
   * @return {*} 查询到的群组
   */
  public async getJoinedGroups(): Promise<Group[]> {
    await this.getjoinedTargets();
    return <Group[]>this.joinTargets.filter((a) => {
      return a.target.typeName == TargetType.Group;
    });
  }

  /**
   * 更新单位
   * @param name 单位名称
   * @param code 单位信用代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 单位简介
   * @param type 单位类型,默认'单位',可选:'大学','医院','单位'
   * @returns 是否成功
   */
  public async updateTarget(
    name: string,
    code: string,
    teamName: string = '',
    teamCode: string = '',
    remark: string,
  ): Promise<model.ResultType<schema.XTarget>> {
    if (!validIsSocialCreditCode(code)) {
      return faildResult('请填写正确的代码!');
    }
    return await super.updateTarget(name, code, teamName, teamCode, remark);
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
   * 申请加入集团
   * @param id 目标Id
   * @returns
   */
  public async applyJoinGroup(id: string): Promise<model.ResultType<any>> {
    const group = this.joinTargets.find((group) => {
      return group.target.id == id;
    });
    if (group != undefined) {
      return faildResult(consts.IsJoinedError);
    }
    return await this.applyJoin(id, TargetType.Group);
  }
}
