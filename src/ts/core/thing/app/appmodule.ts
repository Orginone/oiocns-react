import { schema } from '../../../base';
import { SpeciesType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';
import { WorkForm } from './work/workform';
import { WorkItem } from './work/workitem';
import { ReportBI } from './work/reportbi';
export interface IAppModule extends ISpeciesItem {}

export class AppModule extends SpeciesItem implements IAppModule {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: IAppModule) {
    super(_metadata, _current, _parent);
    this.speciesTypes = [
      SpeciesType.AppModule,
      SpeciesType.WorkForm,
      SpeciesType.WorkItem,
      SpeciesType.ReportBI,
    ];
    for (const item of _metadata.nodes || []) {
      switch (item.typeName) {
        case SpeciesType.AppModule:
          this.children.push(new AppModule(_metadata, _current, this));
          break;
        case SpeciesType.WorkForm:
          this.children.push(new WorkForm(_metadata, _current, this));
          break;
        case SpeciesType.WorkItem:
          this.children.push(new WorkItem(_metadata, _current, this));
          break;
        case SpeciesType.ReportBI:
          this.children.push(new ReportBI(_metadata, _current, this));
          break;
      }
    }
    this.parent = _parent;
  }
}
