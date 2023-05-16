import { kernel, schema } from '@/ts/base';
import { ITarget, Target } from '../base/target';
import { IBelong } from '../base/belong';
import { PageAll } from '../../public/consts';
import { IMsgChat } from '../../chat/message/msgchat';
import { IMarket } from '../../thing/market/market';
import { SpeciesType } from '../../public/enums';
import { OperateType } from '../provider';
import orgCtrl from '@/ts/controller';
export interface ICohort extends ITarget {
  /** 流通交易 */
  market: IMarket | undefined;
}

export class Cohort extends Target implements ICohort {
  constructor(_metadata: schema.XTarget, _space: IBelong) {
    super(_metadata, [_metadata.belong?.name ?? '', _metadata.typeName], _space);
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
  override recvTarget(operate: string, target: schema.XTarget): void {
    switch (operate) {
      case OperateType.Update:
        this.metadata = target;
        break;
      case OperateType.Delete:
        this.space.cohorts = this.space.cohorts.filter((i) => i.key != this.key);
        break;
      default:
        break;
    }
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteTarget({
      id: this.metadata.id,
      page: PageAll,
    });
    if (res.success) {
      orgCtrl.target.prodTargetChange(OperateType.Delete, this);
      orgCtrl.target.prodRelationChange(OperateType.Remove, this.space, this.metadata);
      this.space.cohorts = this.space.cohorts.filter((i) => i.key != this.key);
    }
    return res.success;
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
    const find = this.species.find((i) => i.metadata.typeName === SpeciesType.Market);
    if (find) {
      return find as IMarket;
    }
    return undefined;
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await this.loadMembers(reload);
    await this.loadSpecies(reload);
  }
}
