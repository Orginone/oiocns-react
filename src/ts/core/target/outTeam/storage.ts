import { OperateModel } from '@/ts/base/model';
import { schema } from '../../../base';
import { TargetType, companyTypes, targetOperates } from '../../public';
import { IBelong } from '../base/belong';
import { ITarget, Target } from '../base/target';
import { ISession } from '../../chat/session';

/** 存储资源接口 */
export interface IStorage extends ITarget {}

export class Storage extends Target implements IStorage {
  constructor(_metadata: schema.XTarget, _relations: string[], _space: IBelong) {
    super(_metadata, [..._relations, _metadata.id], _space.user, [
      ...companyTypes,
      TargetType.Person,
    ]);
    this.space = _space;
  }
  space: IBelong;
  async exit(): Promise<boolean> {
    if (this.metadata.belongId !== this.space.id) {
      if (await this.removeMembers([this.user.metadata])) {
        this.space.storages = this.space.storages.filter((i) => i.key != this.key);
        return true;
      }
    }
    return false;
  }
  override async delete(notity: boolean = false): Promise<boolean> {
    notity = await super.delete(notity);
    if (notity) {
      this.space.storages = this.space.storages.filter((i) => i.key != this.key);
    }
    return notity;
  }
  override operates(): OperateModel[] {
    return [...super.operates(), targetOperates.Activate];
  }
  get subTarget(): ITarget[] {
    return [];
  }
  get chats(): ISession[] {
    return [];
  }
  get targets(): ITarget[] {
    return [this];
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    if (this.metadata.belongId === this.userId) {
      await this.loadMembers(reload);
    }
  }
  async teamChangedNotity(target: schema.XTarget): Promise<boolean> {
    return await this.pullMembers([target], true);
  }
}
