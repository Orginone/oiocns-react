import { schema } from '@/ts/base';
import { SpeciesType } from '@/ts/core/public/enums';
import { ISpeciesItem } from '../base/species';
import { ITarget } from '../../target/base/target';
import { Commodity } from './commodity';
import { IWork, Work } from '../base/work';
export interface IMarket extends IWork {}

export class Market extends Work implements IMarket {
  constructor(_metadata: schema.XSpecies, _current: ITarget) {
    super(_metadata, _current);
    this.speciesTypes = [SpeciesType.Commodity];
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    return new Commodity(_metadata, _current, this, this);
  }
}
