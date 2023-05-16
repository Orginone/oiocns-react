import { schema } from '../../../base';
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
    for (const item of _metadata.nodes || []) {
      this.children.push(new Data(item, this.app, this));
    }
    this.speciesTypes = [_metadata.typeName];
  }
  app: IApplication;
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    return new Data(_metadata, this.app, this);
  }
}
