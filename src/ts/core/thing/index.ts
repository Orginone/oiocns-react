import { schema } from '../../base';
import { SpeciesType } from '../public/enums';
import { ITarget } from '../target/base/target';
import { ISpeciesItem, SpeciesItem } from './base/species';
import { PropClass } from './store/propclass';
import { AppPackage } from './app/package';
import { FileSystem } from './filesys/filesystem';
import { AppModule } from './app/appmodule';
import { WorkForm } from './app/work/workform';
import { WorkItem } from './app/work/workitem';
import { ReportBI } from './app/work/reportbi';

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
    case SpeciesType.Resource:
      break;
    case SpeciesType.Market:
      break;
    case SpeciesType.Store:
      break;
    case SpeciesType.AppModule:
      return new AppModule(_metadata, _current);
    case SpeciesType.WorkForm:
      return new WorkForm(_metadata, _current);
    case SpeciesType.WorkItem:
      return new WorkItem(_metadata, _current);
    case SpeciesType.ReportBI:
      return new ReportBI(_metadata, _current);
  }
  return new SpeciesItem(_metadata, _current);
};
