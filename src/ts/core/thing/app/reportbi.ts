import { schema } from '../../../base';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';
import { IApplication } from './application';
export interface IReportBI extends ISpeciesItem {
  /** 对应的应用 */
  app: IApplication;
}

export class ReportBI extends SpeciesItem implements IReportBI {
  constructor(_metadata: schema.XSpecies, _app: IApplication, _parent?: IReportBI) {
    super(_metadata, _app.current, _parent);
    this.app = _app;
    for (const item of _metadata.nodes || []) {
      this.children.push(new ReportBI(item, this.app, this));
    }
    this.speciesTypes = [_metadata.typeName];
  }
  app: IApplication;
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    return new ReportBI(_metadata, this.app, this);
  }
}
