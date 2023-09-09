import { schema } from '@/ts/base';
import { ITarget, Target } from '../base/target';
import { IBelong } from '../base/belong';
import { ISession } from '../../chat/session';
import { IPerson } from '../person';
export interface ICohort extends ITarget {}

export class Cohort extends Target implements ICohort {
  constructor(_metadata: schema.XTarget, _space: IBelong, relationId: string) {
    super(_metadata, [relationId]);
    this.space = _space;
    this.user = _space.user;
  }
  user: IPerson;
  space: IBelong;
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
    notity = await super.delete(notity);
    if (notity) {
      this.space.cohorts = this.space.cohorts.filter((i) => i.key != this.key);
    }
    return notity;
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
      await this.directory.loadDirectoryResource(),
    ]);
  }
  async teamChangedNotity(target: schema.XTarget): Promise<boolean> {
    return await this.pullMembers([target], true);
  }
}
