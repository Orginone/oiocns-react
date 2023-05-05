import { schema } from '../../base';
import { SpeciesType } from '../public/enums';
import { ITarget } from '../target/base/target';
import { ISpeciesItem } from './base/species';
import { PropClass } from './store/propclass';
import { AppPackage } from './app/package';
import { FileSystem } from './filesys/filesystem';

export type { ISpeciesItem } from './base/species';

export const createSpecies = (
  _metadata: schema.XSpecies,
  _current: ITarget,
): ISpeciesItem => {
  switch (_metadata.typeName as SpeciesType) {
    case SpeciesType.PropClass:
      return new PropClass(_metadata, _current);
    case SpeciesType.AppPackage:
      return new AppPackage(_metadata, _current);
    case SpeciesType.FileSystem:
      return new FileSystem(_metadata, _current);
    // case SpeciesType.Resource:
    //   break;
    // case SpeciesType.Market:
    //   break;
    // case SpeciesType.Store:
    //   break;
    default:
      return new PropClass(_metadata, _current);
  }
};
