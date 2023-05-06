import { SpeciesType } from '../../public/enums';
import { ISpeciesItem } from '../base/species';
import { schema } from '@/ts/base';
import { ITarget } from '../../target/base/target';
import { Form, IForm } from '../base/form';
import { IMarket } from './market';
export interface ICommodity extends IForm {
  /** 市场接口 */
  market: IMarket;
}

export class Commodity extends Form implements ICommodity {
  constructor(
    _metadata: schema.XSpecies,
    _current: ITarget,
    _parent: ISpeciesItem,
    _market: IMarket,
  ) {
    super(_metadata, _current, _parent);
    this.market = _market;
    this.speciesTypes = [SpeciesType.Commodity];
  }
  market: IMarket;
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    return new Commodity(_metadata, _current, this, this.market);
  }
}
