import { schema } from '../../../../base';
import { ITarget } from '../../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../../base/species';
import { IAppModule } from '../appmodule';
export interface IReportBI extends ISpeciesItem {}

export class ReportBI extends SpeciesItem implements IReportBI {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: IAppModule) {
    super(_metadata, _current);
    this.speciesTypes = [];
  }
}
