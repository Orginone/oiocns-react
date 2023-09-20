import { OperateModel } from '@/ts/base/model';
import { kernel, schema } from '../../../base';
import { OperateType, TargetType, companyTypes, targetOperates } from '../../public';
import { IBelong } from '../base/belong';
import { ITarget, Target } from '../base/target';
import { ISession } from '../../chat/session';

/** 存储资源接口 */
export interface IStorage extends ITarget {
  /** 是否处于激活状态 */
  isActivate: boolean;
  /** 激活存储 */
  activateStorage(): Promise<boolean>;
}

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
    const operates = [...super.operates()];
    if (!this.isActivate) {
      operates.push(targetOperates.Activate);
    }
    return operates;
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
  get isActivate(): boolean {
    return this.id === this.space.metadata.storeId;
  }
  async activateStorage(): Promise<boolean> {
    if (!this.isActivate) {
      const res = await kernel.activateStorage({
        id: this.id,
        subId: this.space.id,
      });
      if (res.success) {
        this.space.updateMetadata(res.data);
        this.space.createTargetMsg(OperateType.Update);
      }
      return res.success;
    }
    return false;
  }
  content(_mode?: number | undefined): ITarget[] {
    return [];
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
