import { kernel, schema } from '@/ts/base';
import { ITarget, Target } from '../base/target';
import { IBelong } from '../base/belong';
import { PageAll } from '../../public/consts';
import { IMsgChat } from '../../chat/message/msgchat';
export interface ICohort extends ITarget {}

export class Cohort extends Target implements ICohort {
  constructor(_metadata: schema.XTarget, _space: IBelong) {
    super(_metadata, [_metadata.typeName], _space);
  }
  async exit(): Promise<boolean> {
    if (this.metadata.belongId !== this.space.metadata.id) {
      if (await this.removeMembers([this.space.user.metadata])) {
        this.space.cohorts = this.space.cohorts.filter((i) => i.key != this.key);
        return true;
      }
    }
    return false;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteTarget({
      id: this.metadata.id,
      page: PageAll,
    });
    if (res.success) {
      this.space.cohorts = this.space.cohorts.filter((i) => i.key != this.key);
    }
    return res.success;
  }
  get subTarget(): ITarget[] {
    return [];
  }
  get chats(): IMsgChat[] {
    return [this];
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadMembers(reload);
    await this.loadSpecies(reload);
  }
}
