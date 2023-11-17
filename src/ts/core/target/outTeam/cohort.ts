import { schema } from '@/ts/base';
import { ITarget, Target } from '../base/target';
import { IBelong } from '../base/belong';
import { ISession } from '../../chat/session';
export interface ICohort extends ITarget {}

export class Cohort extends Target implements ICohort {
  constructor(_metadata: schema.XTarget, _space: IBelong, relationId: string) {
    super([_space.key], _metadata, [relationId], _space, _space.user);
  }
  get groupTags(): string[] {
    const tags = [...super.groupTags];
    if (this.id != this.belongId) {
      if (this.belongId != this.spaceId) {
        tags.push('加入的群');
      } else {
        tags.push('创建的群');
      }
    }
    return tags;
  }
  findChat(id: string): ISession | undefined {
    return this.user.memberChats.find((i) => i.id === id);
  }
  async exit(): Promise<boolean> {
    if (this.metadata.belongId !== this.space.id) {
      if (await this.removeMembers([this.user.metadata])) {
        this.space.cohorts = this.space.cohorts.filter((i) => i.key != this.key);
        return true;
      }
    }
    return false;
  }
  override async delete(notity: boolean = false): Promise<boolean> {
    const success = await super.delete(notity);
    if (success) {
      this.space.cohorts = this.space.cohorts.filter((i) => i.key != this.key);
    }
    return success;
  }
  get subTarget(): ITarget[] {
    return [];
  }
  get chats(): ISession[] {
    return this.targets.map((i) => i.session);
  }
  get targets(): ITarget[] {
    return [this];
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await Promise.all([
      await this.loadMembers(reload),
      await this.loadIdentitys(reload),
      await this.directory.loadDirectoryResource(reload),
    ]);
  }
}
