import { schema } from '@/ts/base';
import { ITarget, Target } from '../base/target';
import { IBelong } from '../base/belong';
import { IMsgChat } from '../../chat/message/msgchat';
import { IMarket } from '../../thing/market/market';
import { SpeciesType } from '../../public/enums';
export interface ICohort extends ITarget {
  /** 流通交易 */
  market: IMarket | undefined;
}

export class Cohort extends Target implements ICohort {
  constructor(_metadata: schema.XTarget, _space: IBelong) {
    super(_metadata, [_metadata.belong?.name ?? '', _metadata.typeName], _space);
    this.speciesTypes.push(SpeciesType.Market);
  }
  async exit(): Promise<boolean> {
    if (this.metadata.belongId !== this.space.id) {
      if (await this.removeMembers([this.space.user.metadata])) {
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
  get chats(): IMsgChat[] {
    return this.targets;
  }
  get targets(): ITarget[] {
    return [this];
  }
  get market(): IMarket | undefined {
    const find = this.species.find((i) => i.typeName === SpeciesType.Market);
    if (find) {
      return find as IMarket;
    }
    return undefined;
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadMembers(reload);
    await this.loadSpecies(reload);
  }
  async teamChangedNotity(target: schema.XTarget): Promise<boolean> {
    return await this.pullMembers([target], true);
  }
}
