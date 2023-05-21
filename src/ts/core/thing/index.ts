import { schema } from '../../base';
import { SpeciesType } from '../public/enums';
import { ITarget } from '../target/base/target';
import { ISpeciesItem } from './base/species';
import { PropClass } from './store/propclass';
import { Application } from './app/application';
import { Market } from './market/market';
import { DictClass } from './dict/dictclass';
import { ThingClass } from './store/thingclass';

export type { ISpeciesItem } from './base/species';

export const createSpecies = (
  _metadata: schema.XSpecies,
  _current: ITarget,
): ISpeciesItem | undefined => {
  switch (_metadata.typeName as SpeciesType) {
    case SpeciesType.Dict:
      return new DictClass(_metadata, _current);
    case SpeciesType.Store:
      return new PropClass(_metadata, _current);
    case SpeciesType.Thing:
      return new ThingClass(_metadata, _current);
    case SpeciesType.Application:
      return new Application(_metadata, _current);
    case SpeciesType.Market:
      return new Market(_metadata, _current);
  }
};
