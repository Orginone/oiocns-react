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
      const subItem = this.createChildren(item, _current);
      if (subItem) {
        this.children.push(subItem);
      }
    }
    this.parent = _parent;
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    switch (_metadata.typeName) {
      case SpeciesType.WorkForm:
        return new WorkForm(_metadata, _current, this);
      case SpeciesType.WorkItem:
        return new WorkItem(_metadata, _current, this);
      case SpeciesType.ReportBI:
        return new ReportBI(_metadata, _current, this);
      case SpeciesType.AppModule:
        return new AppModule(_metadata, _current, this);
    }
  }
}
