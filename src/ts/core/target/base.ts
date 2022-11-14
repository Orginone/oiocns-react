import { TTarget } from '../entity';
import { kernel, model, common } from '../../base';

export default class BaseTarget {
  public readonly target: TTarget;
  constructor(target: TTarget) {
    this.target = target;
  }

  /**
   * 获取加入的组织
   * @param data 请求参数
   * @returns 请求结果
   */
  public async getjoined(data: any): Promise<model.ResultType> {
    data.id = this.target.id;
    data.typeName = [this.target.typeName];
    data.page = {
      offset: 0,
      filter: '',
      limit: common.Constants.MAX_UINT_16,
    };
    return await kernel.queryJoinedTargetById(data);
  }

  /**
   * 拉对象加入组织
   * @param data 拉入参数
   * @returns 拉入结果
   */
  public async pull(data: any): Promise<model.ResultType> {
    data.id = this.target.id;
    data.teamTypes = [this.target.typeName];
    return await kernel.pullAnyToTeam(data);
  }
}
