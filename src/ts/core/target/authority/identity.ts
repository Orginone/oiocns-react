import { schema, model, kernel, common } from '../../../base';
import { TargetType } from '../../enum';
import { IIdentity } from './iidentity';

export default class Identity implements IIdentity {
  private readonly _identity: schema.XIdentity;
  constructor(identity: schema.XIdentity) {
    this._identity = identity;
  }
  public get id(): string {
    return this._identity.id;
  }

  public async giveIdentity(targetIds: string[]): Promise<model.ResultType<any>> {
    return await kernel.giveIdentity({ id: this._identity.id, targetIds });
  }

  public async updateIdentity(
    name: string,
    code: string,
    remark: string,
  ): Promise<model.ResultType<schema.XIdentity>> {
    const res = await kernel.updateIdentity({
      name,
      code,
      remark,
      id: this._identity.id,
      authId: this._identity.authId,
      belongId: this._identity.belongId,
    });
    if (res.success) {
      this._identity.name = name;
      this._identity.code = code;
      this._identity.remark = remark;
      this._identity.updateTime = res.data?.updateTime;
    }
    return res;
  }

  public async getIdentityTargets(
    targetType: TargetType,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await kernel.queryIdentityTargets({
      id: this._identity.id,
      targetType: targetType,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  }

  public async removeIdentity(targetIds: string[]): Promise<model.ResultType<any>> {
    return await kernel.removeIdentity({
      id: this._identity.id,
      targetIds,
    });
  }
}
