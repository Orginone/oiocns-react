import { schema } from '../../../base';
import { SpeciesType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';
import { Application } from './application';

/** 应用类别的抽象接口 */
export interface IAppPackage extends ISpeciesItem {}

/** 应用类别的基类实现 */
export class AppPackage extends SpeciesItem implements IAppPackage {
  constructor(_metadata: schema.XSpecies, _current: ITarget) {
    super(_metadata, _current);
    for (const item of _metadata.nodes || []) {
      this.children.push(new Application(item, this.current, this));
    }
    this.speciesTypes = [SpeciesType.Application];
  }
}
