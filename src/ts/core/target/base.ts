import { Identity } from '@/module/org';
import { kernel, model, common, schema } from '../../base';

export default class BaseTarget {
  public readonly target: schema.XTarget;
  protected identitys: schema.XIdentity[];
  constructor(target: schema.XTarget) {
    this.target = target;
    this.identitys = [];
  }

  /**
   * 获取加入的组织
   * @param data 请求参数
   * @returns 请求结果
   */
  public async getjoined(data: any): Promise<model.ResultType<schema.XTargetArray>> {
    data.id = this.target.id;
    data.typeName = this.target.typeName;
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
  public async pull(data: any): Promise<model.ResultType<any>> {
    data.id = this.target.id;
    data.teamTypes = [this.target.typeName];
    return await kernel.pullAnyToTeam(data);
  }

  /**
   * 获取所有身份
   * @param data 请求参数
   * @returns 身份数组
   */
  public async queryTargetIdentitys(data: any): Promise<model.ResultType<schema.XIdentityArray>> {
    data.id = this.target.id;
    data.page = {
      offset: 0,
      filter: '',
      limit: common.Constants.MAX_UINT_16,
    };
    return await kernel.queryTargetIdentitys(data);
  }

  public async getIdentitys(): Promise<schema.XIdentity[]> {
    if (this.identitys.length > 0) {
      return this.identitys;
    }
    this.identitys = []
    const res = await this.queryTargetIdentitys({
    });
    if (res.success) {
      res.data.result.forEach((identity) => {
        this.identitys.push(identity);
      });
    }
    return this.identitys;
  }

}
