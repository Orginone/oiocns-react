import { schema, model, kernel } from '@/ts/base';
import { TargetType } from '../../enum';
import { IIdentity } from './iidentity';

export default class Identity implements IIdentity {
  readonly target: schema.XIdentity;

  public get id(): string {
    return this.target.id;
  }

  public get name(): string {
    return this.target.name;
  }
  constructor(identity: schema.XIdentity) {
    this.target = identity;
  }
  async loadMembers(page: model.PageRequest): Promise<schema.XTargetArray> {
    return (
      await kernel.queryIdentityTargets({
        id: this.id,
        targetType: TargetType.Person,
        page: page,
      })
    ).data;
  }
  async pullMembers(ids: string[]): Promise<boolean> {
    return (await kernel.giveIdentity({ id: this.id, targetIds: ids })).success;
  }
  async removeMembers(ids: string[]): Promise<boolean> {
    return (await kernel.removeIdentity({ id: this.id, targetIds: ids })).success;
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
      id: this.target.id,
      authId: this.target.authId,
      belongId: this.target.belongId,
    });
    if (res.success) {
      this.target.name = name;
      this.target.code = code;
      this.target.remark = remark;
      this.target.updateTime = res.data?.updateTime;
    }
    return res;
  }
}
