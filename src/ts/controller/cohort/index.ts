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
<<<<<<< HEAD
  constructor() {
    this._cohorts = [];
=======
  constructor(cohorts: Cohort[]) {
    this._cohorts = cohorts;
>>>>>>> 0243cfb9d49d0d0c3ef3713e9a99141addfb8411
    this.workSpace = provider.getPerson!;
    this._myCohorts = this.getMyCohort;
    this._joinCohorts = this.getJoinCohort;
  }

  public get getCohorts(): Cohort[] {
    return this._cohorts;
  }

  // this._joinedCohorts = this._joinedCohorts.filter((obj) => obj.target.id != id);
<<<<<<< HEAD
/**
 * 获取我的群组
 */
  public get getMyCohort(): Cohort[] {
    if (provider.getPerson?.target.id == provider.userId) {
      const obj = this.workSpace as Person;
      if (obj.ChohortArray.length==0) {
        obj.getJoinedCohorts();
        this._cohorts = obj.ChohortArray;
      }else{
        this._cohorts = obj.ChohortArray;
      }
    }
=======

  public get getMyCohort(): Cohort[] {
>>>>>>> 0243cfb9d49d0d0c3ef3713e9a99141addfb8411
    let data = this._cohorts.filter(
      (obj) => this.workSpace.target.id == obj.target.belongId,
    );
    console.log('我的群组', data);
<<<<<<< HEAD
    return data;
  }
/**
 * 获取我加入的群组
 */
  public get getJoinCohort(): Cohort[] {
    if (provider.getPerson?.target.id == provider.userId) {
      const obj = this.workSpace as Person;
      if (obj.ChohortArray == []) {
        obj.getJoinedCohorts();
        this._cohorts = obj.ChohortArray;
      } 
    }
    let data = this._cohorts.filter(
      (obj) => this.workSpace.target.id != obj.target.belongId,
    );
    console.log('我加入的群组', data);
    return data;
  }

=======
    return data;
  }

  public get getJoinCohort(): Cohort[] {
    let data = this._cohorts.filter(
      (obj) => this.workSpace.target.id != obj.target.belongId,
    );
    console.log('我加入的群组', data);
    return data;
  }

>>>>>>> 0243cfb9d49d0d0c3ef3713e9a99141addfb8411
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
<<<<<<< HEAD
    this.callBack([...this.getMyCohort]);
=======
    this.callBack([...this._myCohorts]);
    console.log('callback', this._myCohorts);
>>>>>>> 0243cfb9d49d0d0c3ef3713e9a99141addfb8411
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
<<<<<<< HEAD
    // this._cohorts = provider.getPerson!.ChohortArray;
    this.callBack([...this.getMyCohort]);
=======
    this._cohorts = provider.getPerson!.ChohortArray;
    this.callBack([...this._myCohorts]);
>>>>>>> 0243cfb9d49d0d0c3ef3713e9a99141addfb8411
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
<<<<<<< HEAD
      this.callBack([...this.getMyCohort]);
    }
    return res;
  }

=======
      this.callBack([...this._myCohorts]);
    }
    return res;
  }
>>>>>>> 0243cfb9d49d0d0c3ef3713e9a99141addfb8411
  /**
   * 角色管理列表
   * @param obj
   * @param id
   * @returns
   */
<<<<<<< HEAD
  public async getRoleList(id: string): Promise<schema.XAuthority[]> {
    this._myCohorts = this.getMyCohort;
    console.log("id内容",id)
    console.log(this._myCohorts)
    const cohort = this._myCohorts.filter((obj) => id == obj.target.id)[0];
    if (cohort._ownAuthoritys.length==0) {
      let res = await cohort.selectAuthorityTree(id);
      console.log('职权组织树:', res);
      return [res.data];
    }
    return cohort._ownAuthoritys;
  }
  /**
   * 增加新角色
   * @param id 群组id 路由不能传包含方法的对象，用id自行获取
   * @param name 角色名称
   * @param code 角色编号
   * @param ispublic 是否公开
   * @param parentIds 父级id数组（使用的是级联样式，所以是数组，目标为最后一个元素）
   * @param remark 备注信息
   * @returns
   */
  public async addRole(
    id: string,
    name: string,
    code: string,
    ispublic: boolean,
    parentIds: string[],
    remark: string,
  ): Promise<model.ResultType<schema.XAuthority>> {
    let cohort = this._myCohorts.filter((obj) => id == obj.target.id)[0];
    console.log(this._myCohorts);
    console.log('职权列表', cohort._ownAuthoritys);
    // const tree = cohort.getMyAuthorityTree;
    const parentId = parentIds[parentIds.length - 1];
    console.log('父职权id', parentId);
    let res = await cohort.createAuthority(name, code, ispublic, parentId, remark);
    console.log('职权组织树:', res);
    this.callBack([...cohort._ownAuthoritys]);
    return res;
  }
  /**
   * 获取群组下的好友
   */
  public async getCohortPeronList(obj: Cohort): Promise<schema.XTarget[]> {
    console.log("已进入")
    console.log("测试输出",obj.getMyPerson)
    if (obj.getMyPerson.length == 0 ) {
      let res = await obj.getPersons();
      console.log('群组下的人员列表:', res);
      return res.data.result!;
    }else{
    return obj.getMyPerson;
    }
  }
}

export default new CohortController();
=======
  public async getRoleList(id: string): Promise<model.ResultType<schema.XAuthority>> {
    let cohort = this._myCohorts.filter((obj) => id == obj.target.id)[0];
    let res = await cohort.selectAuthorityTree(id);
    console.log('职权组织树:', res);
    return res;
  }
}

export default new CohortController(provider.getPerson!.ChohortArray);
>>>>>>> 0243cfb9d49d0d0c3ef3713e9a99141addfb8411
