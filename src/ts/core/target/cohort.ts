import { schema } from '../../base';
import { TargetType } from '../enum';
import BaseTarget from './base';
import API from '../../../services';
import { common, kernel, model, FaildResult } from '../../base';
import { format } from 'path/posix';
import { formatDate } from '@/utils';
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
  public async UpdateCohort(
    params: model.TargetModel
  ): Promise<model.ResultType<any>> {
    let res = await kernel.updateTarget(params);
    if (res.success) {
      this.target.name = params.name;
      this.target.code = params.code
      this.target.updateUser = formatDate(new Date().getTime);
      if (this.target.team != undefined) {
        this.target.team.name = params.name;
        this.target.team.code = params.code;
        this.target.team.remark = params.teamRemark;
        this.target.team.updateTime = formatDate(new Date().getTime);
      }
    }
    return res;
  }

  /*----------------------------------------------------旧接口内容-----------------------------------------------------------*/
  public async SearchCohort(params: any) {
    const { data } = await API.cohort.searchCohorts({
      data: params,
    });
    console.log("进入调用")

    return { data };
  }

  public async ApplyJoinCohort(params: any) {
    const { code, msg, success } = await API.cohort.applyJoin({
      data: params,
    });
    console.log("进入调用")

    return { code, msg, success };
  }

  public async deleteCohort(params: any) {
    const { code, msg, success } = await API.cohort.delete({
      data: params,
    });
    console.log("进入调用")
    return { code, msg, success };
  }
  // public async deleteCohort(params: any) {
  //   const {code,msg,success} = await API.cohort.applyJoin({
  //     data: params,
  //   });
  //   console.log("进入调用")

  //   return {code,msg,success};
  // }

}
