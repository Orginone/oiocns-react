import Group from './group';
import Cohort from './cohort';
import consts from '../consts';
import { TargetType } from '../enum';
import MarketTarget from './mbase';
import { faildResult, model, schema, kernel, common } from '../../base';
import { validIsSocialCreditCode } from '@/utils/tools';
/**
 * 公司的元操作
 */
export default class Company extends MarketTarget {
  private _joinedGroups: Group[];
  private _joinedCohorts: Cohort[];
  constructor(target: schema.XTarget) {
    super(target);
    this._joinedGroups = [];
    this._joinedCohorts = [];
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
  updateCompany = async (
    id: string = '',
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
  ): Promise<model.ResultType<any>> => {
    if (id != '0') {
      return faildResult(consts.UnauthorizedError);
    }
    if (!validIsSocialCreditCode(code)) {
      return faildResult('请填写正确的代码!');
    }
    return await this.updateTarget(name, code, teamName, teamCode, remark);
  };

  /**
   * 更新部门、工作组
   * @param id 部门、工作组Id
   * @param name 部门、工作组名称
   * @param code 部门、工作组编码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 部门、工作组简介
   * @param type 部门、工作组类型
   * @returns 是否成功
   */
  updateDepartmentOrWorking = async (
    id: string,
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    typeName: TargetType,
    remark: string,
  ): Promise<model.ResultType<any>> => {
    return await kernel.updateTarget({
      id,
      name,
      code,
      teamCode,
      teamName,
      teamRemark: remark,
      belongId: this.target.belongId,
      typeName: typeName,
    });
  };

  /** 可以创建的子类型 enum.ts */
  get subTypes(): TargetType[] {
    return [
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
  }

  protected get searchTargetType(): TargetType[] {
    return [TargetType.Group, ...super.searchTargetType];
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
  createGroup = async (
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
  ): Promise<model.ResultType<any>> => {
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
        this._joinedGroups.push(new Group(res.data));
        return await this.join(res.data.id, [TargetType.Group]);
      }
      return res;
    } else {
      return faildResult('该集团已存在!');
    }
  };

  /**
   * 删除集团
   * @param id 集团Id
   * @returns
   */
  deleteGroup = async (id: string): Promise<model.ResultType<any>> => {
    const group = this._joinedGroups.find((group) => {
      return group.target.id == id;
    });
    if (group != undefined) {
      let res = await kernel.recursiveDeleteTarget({
        id: id,
        typeName: TargetType.Group,
        subNodeTypeNames: [TargetType.Group],
      });
      if (res.success) {
        this._joinedGroups = this._joinedGroups.filter((group) => {
          return group.target.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  };

  /**
   * 创建群组
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns 是否创建成功
   */
  createCohort = async (
    name: string,
    code: string,
    remark: string,
  ): Promise<model.ResultType<any>> => {
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
      return cohort.pullCompanys([this.target.id]);
    }
    return res;
  };

  /**
   * 解散群组
   * @param id 群组id
   * @param belongId 群组归属id
   * @returns
   */
  deleteCohort = async (id: string): Promise<model.ResultType<any>> => {
    let res = await super.deleteTarget(id, TargetType.Cohort);
    if (res.success) {
      this._joinedCohorts = this._joinedCohorts.filter((obj) => obj.target.id != id);
    }
    return res;
  };

  /**
   * 创建部门/工作组
   * @param name 名称
   * @param code 编号
   * @param teamName 团队名称
   * @param teamCode 团队编号
   * @param remark 简介
   * @param parentId 上级组织Id 默认公司 公司、部门
   * @returns
   */
  createDepartmentOrWoking = async (
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
    parentId: string = '0',
    targetType: TargetType.Working | TargetType.Department,
  ): Promise<model.ResultType<any>> => {
    const res = await this.createTarget(
      name,
      code,
      targetType,
      teamName,
      teamCode,
      remark,
    );
    if (res.success) {
      if (parentId == '0') {
        parentId = this.target.id;
      }
      this._joinedGroups.push(new Group(res.data));
      return await kernel.pullAnyToTeam({
        id: parentId,
        teamTypes: [TargetType.Department, this.target.typeName],
        targetIds: [res.data?.id],
        targetType: targetType,
      });
    }
    return res;
  };

  /**
   * 删除工作组
   * @param id 工作组Id
   * @returns
   */
  deleteWoking = async (id: string): Promise<model.ResultType<any>> => {
    let res = await kernel.deleteTarget({
      id: id,
      typeName: TargetType.Working,
      belongId: this.target.id,
    });
    return res;
  };

  /**
   * 删除部门
   * @param id 部门Id
   * @returns
   */
  deleteDepartment = async (id: string): Promise<model.ResultType<any>> => {
    let res = await kernel.recursiveDeleteTarget({
      id: id,
      typeName: TargetType.Department,
      subNodeTypeNames: [TargetType.Department, TargetType.Working],
    });
    return res;
  };

  /**
   * 拉人进入单位
   * @param personIds 人员id数组
   * @returns 是否成功
   */
  pullPerson = async (personIds: string[]): Promise<model.ResultType<any>> => {
    return await this.pull(personIds, TargetType.Person);
  };

  /**
   * 拉人进入部门
   * @param id 部门Id
   * @param personIds 人员id数组
   * @returns 是否成功
   */
  pullPersonInDepartment = async (
    id: string,
    personIds: string[],
  ): Promise<model.ResultType<any>> => {
    return await kernel.pullAnyToTeam({
      id,
      teamTypes: [TargetType.Department],
      targetIds: personIds,
      targetType: TargetType.Person,
    });
  };

  /**
   * 拉人进入工作组
   * @param id 工作组Id
   * @param personIds 人员id数组
   * @returns 是否成功
   */
  pullPersonInWorking = async (
    id: string,
    personIds: string[],
  ): Promise<model.ResultType<any>> => {
    return await kernel.pullAnyToTeam({
      id,
      teamTypes: [TargetType.Working],
      targetIds: personIds,
      targetType: TargetType.Person,
    });
  };

  /**
   * 获取组织下的工作组（单位、部门、工作组）
   * @param id 组织Id 默认为当前单位
   * @returns 返回好友列表
   */
  getWorkings = async (id: string = '0'): Promise<model.ResultType<any>> => {
    return await this.getSubTargets(
      id,
      [...consts.CompanyTypes, TargetType.Department],
      [TargetType.Working],
    );
  };

  /**
   * 获取组织下的人员（单位、部门、工作组）
   * @param id 组织Id 默认为当前单位
   * @returns
   */
  getPersons = async (id: string = '0'): Promise<model.ResultType<any>> => {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(
      id,
      [...consts.CompanyTypes, TargetType.Department, TargetType.Working],
      [TargetType.Person],
    );
  };

  /**
   * 获取组织下的部门（单位、部门）
   * @param id 组织Id 默认为当前单位
   * @returns
   */
  getDepartments = async (id: string = '0'): Promise<model.ResultType<any>> => {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(
      id,
      [...consts.CompanyTypes, TargetType.Department],
      [TargetType.Person],
    );
  };

  /**
   * @description: 查询我加入的群
   * @return {*} 查询到的群组
   */
  getJoinedCohorts = async (): Promise<Cohort[]> => {
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
  };

  /**
   * @description: 查询我加入的部门
   * @return {*} 查询到的群组
   */
  getJoinedDepartments = async (
    personId: string,
  ): Promise<model.ResultType<schema.XTargetArray>> => {
    return await kernel.queryJoinedTargetById({
      id: personId,
      typeName: this.target.typeName,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
      spaceId: this.target.id,
      JoinTypeNames: [TargetType.Cohort],
    });
  };

  /**
   * @description: 查询我加入的工作组
   * @return {*} 查询到的群组
   */
  getJoinedWorkings = async (
    personId: string,
  ): Promise<model.ResultType<schema.XTargetArray>> => {
    return await kernel.queryJoinedTargetById({
      id: personId,
      typeName: this.target.typeName,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
      spaceId: this.target.id,
      JoinTypeNames: [TargetType.Cohort],
    });
  };

  /**
   * @description: 查询我加入的集团
   * @return {*} 查询到的群组
   */
  getJoinedGroups = async (): Promise<Group[]> => {
    if (this._joinedGroups.length > 0) {
      return this._joinedGroups;
    }
    let res = await this.getjoined({
      spaceId: this.target.id,
      JoinTypeNames: [TargetType.Group],
    });
    if (res.success) {
      res.data?.result?.forEach((item) => {
        this._joinedGroups.push(new Group(item));
      });
    }
    return this._joinedGroups;
  };

  /**
   * 申请加入群组
   * @param id 目标Id
   * @returns
   */
  applyJoinCohort = async (id: string): Promise<model.ResultType<any>> => {
    const cohort = this._joinedCohorts.find((cohort) => {
      return cohort.target.id == id;
    });
    if (cohort != undefined) {
      return faildResult(consts.IsJoinedError);
    }
    return await this.applyJoin(id, TargetType.Cohort);
  };

  /**
   * 申请加入集团
   * @param id 目标Id
   * @returns
   */
  applyJoinGroup = async (id: string): Promise<model.ResultType<any>> => {
    const group = this._joinedGroups.find((group) => {
      return group.target.id == id;
    });
    if (group != undefined) {
      return faildResult(consts.IsJoinedError);
    }
    return await this.applyJoin(id, TargetType.Group);
  };

  /**
   *  退出集团
   * @param id 集团Id
   * @returns
   */
  quitGroup = async (id: string): Promise<model.ResultType<any>> => {
    return await kernel.recursiveExitAnyOfTeam({
      id,
      teamTypes: [TargetType.Group],
      targetId: this.target.id,
      targetType: this.target.typeName,
    });
  };
}
