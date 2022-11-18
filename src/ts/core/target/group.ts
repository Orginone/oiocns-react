import { FaildResult, model, schema } from '../../base';
import { TargetType } from '../enum';
import BaseTarget from './base';

export default class Group extends BaseTarget {
  public _subGroups: Group[];
  constructor(target: schema.XTarget) {
    super(target);
    this._subGroups = [];
  }

  /**
   * 设立子集团
   * @param name 子集团名称
   * @param code 子集团代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 子集团简介
   * @returns 是否成功
   */
  public async createSubGroup(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
  ): Promise<model.ResultType<any>> {
    const tres = await this.getTargetByName({
      name,
      typeName: TargetType.Group,
      page: { offset: 0, limit: 1, filter: code },
    });
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
        this._subGroups.push(new Group(res.data));
        return this.pull({
          targetType: TargetType.Group,
          targetIds: [res.data.id],
        });
      }
      return res;
    } else {
      return FaildResult('该集团已存在!');
    }
  }
}
