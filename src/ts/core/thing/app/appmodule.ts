import { schema } from '../../../base';
import { SpeciesType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';
export interface IAppModule extends ISpeciesItem {}

export class AppModule extends SpeciesItem implements IAppModule {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: IAppModule) {
    super(_metadata, _current);
    this.speciesTypes = [
      SpeciesType.AppModule,
      SpeciesType.WorkForm,
      SpeciesType.WorkItem,
      SpeciesType.ReportBI,
    ];
    for (const item of _metadata.nodes || []) {
      this.children.push(new AppModule(item, this.current, this));
    }
  }
}
