import { TargetType } from '../enum';
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
  public async pullPersons(personIds: string[]): Promise<boolean> {
    let res = await this.pull({
      targetType: TargetType.Person,
      targetIds: personIds,
    });
    return res.success;
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
}
