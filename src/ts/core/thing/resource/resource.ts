import { schema } from '../../../base';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';
export interface IResource extends ISpeciesItem {}

export class Resource extends SpeciesItem implements IResource {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: IResource) {
    super(_metadata, _current, _parent);
    for (const item of _metadata.nodes || []) {
      this.children.push(new Resource(item, this.current, this));
    }
    this.speciesTypes = [_metadata.typeName];
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    return new Resource(_metadata, this.current, this);
  }
}
