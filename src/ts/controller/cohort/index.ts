import Cohort from '../../core/target/cohort';
import Person from '../../core/target/person';
import Company from '../../core/target/company';
import { TargetType } from '../../core/enum';
import { model, schema } from '../../base';
import provider from '../../core/provider';
/**
 * 群组控制器
 */
class CohortController {
  private workSpace: Person | Company;
  private _cohorts: Cohort[];
  private _myCohorts: Cohort[];
  private _joinCohorts: Cohort[];
  public callBack!: Function;
  constructor(cohorts: Cohort[]) {
    this._cohorts = cohorts;
    this.workSpace = provider.getPerson!;
    this._myCohorts = this.getMyCohort;
    this._joinCohorts = this.getJoinCohort;
  }

  public get getCohorts(): Cohort[] {
    return this._cohorts;
  }

  // this._joinedCohorts = this._joinedCohorts.filter((obj) => obj.target.id != id);

  public get getMyCohort(): Cohort[] {
    let data = this._cohorts.filter(
      (obj) => this.workSpace.target.id == obj.target.belongId,
    );
    console.log('我的群组', data);
    return data;
  }

  public get getJoinCohort(): Cohort[] {
    let data = this._cohorts.filter(
      (obj) => this.workSpace.target.id != obj.target.belongId,
    );
    console.log('我加入的群组', data);
    return data;
  }

  public setCallBack(fun: Function) {
    this.callBack = fun;
  }

  /**
   * 群组变更
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns
   */
  public async updateCohort(
    obj: Cohort,
    name: string,
    code: string,
    remark: string,
  ): Promise<any> {
    const res = await obj.updateTargetBase(name, code, TargetType.Cohort, remark);
    this.callBack([...this._myCohorts]);
    console.log('callback', this._myCohorts);
    return res;
  }
  /**
   * 创建群组
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns
   */
  public async createCohort(
    obj: Person | Company,
    name: string,
    code: string,
    remark: string,
  ): Promise<any> {
    const res = await obj.createCohort(name, code, remark);
    this._cohorts = provider.getPerson!.ChohortArray;
    this.callBack([...this._myCohorts]);
    return res;
  }
  /**
   * 搜索群组
   * @param obj
   * @param name
   * @returns
   */
  public async searchCohort(
    obj: Person | Company,
    name: string,
  ): Promise<model.ResultType<any>> {
    const res = await obj.searchTargetByName(name, TargetType.Cohort);
    return res;
  }
  /**
   * 搜索人
   * @param obj
   * @param name
   * @returns
   */
  public async searchPerson(
    obj: Person | Company,
    name: string,
  ): Promise<model.ResultType<any>> {
    const res = await obj.searchTargetByName(name, TargetType.Person);
    return res;
  }
  /**
   * 发起加入群组申请
   * @param obj
   * @param destId
   * @returns
   */
  public async joinCohort(
    obj: Person | Company,
    destId: string,
  ): Promise<model.ResultType<any>> {
    const res = await obj.applyJoin(destId, TargetType.Cohort);
    return res;
  }
  /**
   * 拉人加入群组
   * @param obj
   * @param destId
   * @returns
   */
  public async pullCohort(
    obj: Cohort,
    PersonId: [string],
  ): Promise<model.ResultType<any>> {
    const res = await obj.pullPerson(PersonId);
    console.log('输出返回值', res);
    return res;
  }
  /**
   * 解散群组
   * @param obj
   * @param id
   * @param belongId
   * @returns
   */
  public async deleteCohort(
    obj: Person | Company,
    id: string,
  ): Promise<model.ResultType<any>> {
    const res = await obj.deleteCohort(id);
    if (res.success) {
      let data = this._cohorts.filter((obj) => id != obj.target.id);
      this._cohorts = data;
      this.callBack([...this._myCohorts]);
    }
    return res;
  }
  /**
   * 角色管理列表
   * @param obj
   * @param id
   * @returns
   */
  public async getRoleList(id: string): Promise<model.ResultType<schema.XAuthority>> {
    let cohort = this._myCohorts.filter((obj) => id == obj.target.id)[0];
    let res = await cohort.selectAuthorityTree(id);
    console.log('职权组织树:', res);
    return res;
  }
}

export default new CohortController(provider.getPerson!.ChohortArray);
