import { schema } from '../../../base';
import { SpeciesType } from '../../public';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';
import { IApplication } from './application';
export interface IData extends ISpeciesItem {
  /** 对应的应用 */
  app: IApplication;
}

export class Data extends SpeciesItem implements IData {
  constructor(_metadata: schema.XSpecies, _app: IApplication, _parent?: IData) {
    super(_metadata, _app.current, _parent);
    this.app = _app;
    this.speciesTypes = [_metadata.typeName];
  }
  app: IApplication;
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    switch (_metadata.typeName) {
      case SpeciesType.Data:
        return new Data(_metadata, this.app, this);
    }
  }
}
