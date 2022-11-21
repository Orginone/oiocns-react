import { TargetType } from '../enum';
import consts from '../consts';
import BaseTarget from './base';
import { kernel, model, schema } from '../../base';

export default class Cohort extends BaseTarget {
  constructor(target: schema.XTarget) {
    super(target);
  }
  /**
   * 拉人进入群组
   * @param personIds 人员id数组
   * @returns 是否成功
   */
  public async pullPersons(personIds: string[]): Promise<model.ResultType<any>> {
    return await this.pull({
      targetType: TargetType.Person,
      targetIds: personIds,
    });

  }

  /**
   * 修改群组
   * @param params id:targetId,code:修改后群组编号,TypeName:枚举中取Cohort,belongId: 归属ID,teamName:修改后名称,temcode:修改后编号
   * ,teamReamrk：修改后描述;
   * @returns
   */
  public async UpdateCohort(params: model.TargetModel): Promise<model.ResultType<any>> {
    let res = await kernel.updateTarget(params);
    if (res.success) {
      this.target.name = params.name;
      this.target.code = params.code;
      if (this.target.team != undefined) {
        this.target.team.name = params.name;
        this.target.team.code = params.code;
        this.target.team.remark = params.teamRemark;
      }
    }
    return res;
  }

  /**
   * 获取群组下的人员（群组）
   * @param id 组织Id 默认为群组
   * @returns
   */
  public async getPersons(
    id: string = '0',
  ): Promise<model.ResultType<schema.XTargetArray>> {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(id, [TargetType.Cohort], [TargetType.Person]);
  }

  /**
   * 获取群组下的单位（群组）
   * @param id 组织Id 默认为群组
   * @returns
   */
  public async getCompanys(
    id: string = '0',
  ): Promise<model.ResultType<schema.XTargetArray>> {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(id, [TargetType.Cohort], consts.CompanyTypes);
  }
}
