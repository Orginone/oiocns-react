import Cohort from '../../core/target/cohort';
import Person from '../../core/target/person';
import Company from '../../core/target/company';
import { TargetType } from '../../core/enum';
import { model, schema } from '../../base';
import userCtrl from '../setting/userCtrl';
import { ICompany, IPerson } from '@/ts/core/target/itarget';
/**
 * 群组控制器
 */
class CohortController {
  private workSpace: IPerson | ICompany;
  private _cohorts: Cohort[];
  private _myCohorts: Cohort[];
  public callBack!: Function;
  public joinCallBack!: Function;
  constructor() {
    this._cohorts = [];
    this.workSpace = userCtrl.User!;
    this._myCohorts = [];
  }

  public get getCohorts(): Cohort[] {
    return this._cohorts;
  }

  public setCallBack(fun: Function) {
    this.callBack = fun;
  }
  public setJoinCallBack(fun: Function) {
    this.joinCallBack = fun;
  }

  /**
   * 获取我的群组
   * @returns
   */
  public getMyCohort = async (): Promise<Cohort[]> => {
    if (userCtrl.User?.target.id == userCtrl.User?.target.id) {
      const obj = this.workSpace as Person;
      const data = await obj.getJoinedCohorts();
      this._cohorts = [];
      for (var i = 0; i < data.length; i++) {
        const cohort: Cohort = new Cohort(data[i].target);
        this._cohorts.push(cohort);
      }
    }
    let data = this._cohorts.filter(
      (obj) => this.workSpace.target.id == obj.target.belongId,
    );
    return data;
  };

  /**
   * 获取我加入的群组
   * @returns
   */
  public getJoinCohort = async (): Promise<Cohort[]> => {
    if (userCtrl.User?.target.id == userCtrl.User?.target.id) {
      const obj = this.workSpace as Person;
      const data = await obj.getJoinedCohorts();
      this._cohorts = [];
      for (var i = 0; i < data.length; i++) {
        const cohort: Cohort = new Cohort(data[i].target);
        this._cohorts.push(cohort);
      }
    }
    let data = this._cohorts.filter(
      (obj) => this.workSpace.target.id != obj.target.belongId,
    );
    return data;
  };

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
    belongId: string,
  ): Promise<any> {
    const data = {
      name: name,
      code: code,
      remark: remark,
      typeName: TargetType.Cohort,
      teamRemark: remark,
      belongId: belongId,
      avatar: 'test', //头像
    };
    const res = await obj.update(data);
    const cohortData = await this.getMyCohort();
    this.callBack([...cohortData]);
    const cohorJoinData = await this.getJoinCohort();
    this.joinCallBack([...cohorJoinData]);
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
    obj: IPerson | ICompany,
    name: string,
    code: string,
    remark: string,
  ): Promise<any> {
    const data = {
      name: name,
      code: code,
      remark: remark,
      typeName: TargetType.Cohort,
      teamRemark: remark,
      avatar: 'test', //头像
    };
    const res = await obj.createCohort(data);
    const cohortData = await this.getMyCohort();
    this.callBack([...cohortData]);
    return res;
  }
  /**
   * 搜索群组
   * @param obj
   * @param name
   * @returns
   */
  public async searchCohort(
    obj: IPerson | ICompany,
    name: string,
  ): Promise<model.ResultType<any>> {
    const res = await obj.searchTargetByName(name, TargetType.Cohort);
    console.log(res);
    return res;
  }
  /**
   * 搜索人
   * @param obj
   * @param name
   * @returns
   */
  public async searchPerson(
    obj: Person | Company | Cohort,
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
    obj: IPerson | ICompany,
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
    targets: schema.XTarget[],
  ): Promise<model.ResultType<any>> {
    await obj.getMember();
    const res = await obj.pullMember(targets);
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
    obj: IPerson | ICompany,
    id: string,
  ): Promise<model.ResultType<any>> {
    const res = await obj.deleteCohort(id);
    if (res.success) {
      let data = this._cohorts.filter((obj) => id != obj.target.id);
      this._cohorts = data;
      const cohortData = await this.getMyCohort();
      this.callBack([...cohortData]);
    }
    return res;
  }

  public async getCohort(id: string): Promise<Cohort> {
    this._myCohorts = await this.getMyCohort();
    const cohort = this._myCohorts.filter((obj) => id == obj.target.id)[0];
    return cohort;
  }
  /**
   * 根据id获取名称
   * @param obj
   * @param belongId
   * @returns
   */
  public async getName(obj: Cohort): Promise<string> {
    const list = await obj.getMember();
    for (const value of list) {
      if ((value.id = obj.target.belongId)) {
        return value.team?.name!;
      }
    }
    return '';
  }

  /**
   * 获取群组下的人员
   */
  public async getCohortPeronList(obj: Cohort): Promise<schema.XTarget[]> {
    let res = await obj.getMember();
    return res!.filter((obj) => userCtrl.User?.target.id != obj.id);
  }

  /**
   * 退出群组
   * @param obj
   * @param id
   * @returns
   */
  public async quitCohort(
    obj: Person | Company,
    id: string,
  ): Promise<model.ResultType<any>> {
    let res = await obj.quitCohorts(id);
    const cohorJoinData = await this.getJoinCohort();
    this.joinCallBack([...cohorJoinData]);
    return res;
  }

  /**
   * 踢出群组
   * @param obj
   * @param targets
   * @returns
   */
  public async removeCohort(obj: Cohort, ids: string[]): Promise<model.ResultType<any>> {
    const res = await obj.removeMember(ids, TargetType.Person);
    this.callBack(await this.getCohortPeronList(obj));
    return res;
  }
}

export default new CohortController();
