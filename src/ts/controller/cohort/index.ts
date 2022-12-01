import Cohort from '../../core/target/cohort';
import Person from '../../core/target/person';
import Company from '../../core/target/company';
import { TargetType } from '../../core/enum';
import { model, schema } from '../../base';
import provider from '../../core/provider';
import Authority from '../../core/target/authority/authority';
import { PropertySafetyFilled } from '@ant-design/icons';
/**
 * 群组控制器
 */
class CohortController {
  private workSpace: Person | Company;
  private _cohorts: Cohort[];
  private _myCohorts: Cohort[];
  private _joinCohorts: Cohort[];
  public callBack!: Function;
  public joinCallBack!: Function;
  constructor() {
    this._cohorts = [];
    this.workSpace = provider.getPerson!;
    this._myCohorts = [];
    this._joinCohorts = [];
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
    if (provider.getPerson?.target.id == provider.userId) {
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
    if (provider.getPerson?.target.id == provider.userId) {
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
    console.log('我加入的群组', data);
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
    obj: Person | Company,
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
    // this._cohorts = provider.getPerson!.ChohortArray;
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
    obj: Person | Company,
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
    targets: schema.XTarget[],
  ): Promise<model.ResultType<any>> {
    const res = await obj.pullMember(targets);
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
      const cohortData = await this.getMyCohort();
      this.callBack([...cohortData]);
    }
    return res;
  }

  public async getCohort(id: string): Promise<Cohort> {
    this._myCohorts = await this.getMyCohort();
    console.log('id内容', id);
    console.log(this._myCohorts);
    const cohort = this._myCohorts.filter((obj) => id == obj.target.id)[0];
    return cohort;
  }

  /**
   * 角色管理列表
   * @param obj
   * @param id
   * @returns
   */
  public async getRoleList(cohort: Cohort): Promise<Authority | undefined> {
    let res = await cohort.selectAuthorityTree();
    console.log('aaaaa', await res?.queryAuthorityIdentity());
    console.log('职权组织树:', res);
    return res;
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
    console.log('职权列表', cohort.authorityTree);
    // const tree = cohort.getMyAuthorityTree;
    const parentId = parentIds[parentIds.length - 1];
    console.log('父职权id', parentId);
    let res = await cohort.authorityTree!.createAuthority(
      name,
      code,
      ispublic,
      parentId,
      remark,
    );
    console.log('职权组织树:', res);
    this.callBack([...cohort._ownAuthoritys]);
    return res;
  }

  /**
   * 获取群组下的人员
   */
  public async getCohortPeronList(obj: Cohort): Promise<schema.XTarget[]> {
    console.log('已进入');
    let res = await obj.getMember();
    console.log('群组下的人员列表:', res);
    return res!.filter((obj) => provider.userId != obj.id);
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
    console.log('已进入');
    // console.log('测试输出', obj.getMyPerson);
    let res = await obj.quitCohorts(id);
    console.log('调用结果', res);
    const cohorJoinData = await this.getJoinCohort();
    this.joinCallBack([...cohorJoinData]);
    return res;
  }
}

export default new CohortController();
