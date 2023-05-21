import { schema } from '@/ts/base';
import { SpeciesType } from '@/ts/core/public/enums';
import { ISpeciesItem } from '../base/species';
import { ITarget } from '../../target/base/target';
import { IWork, Work } from '../base/work';
import { IForm } from '../base/form';
import { IThingClass, ThingClass } from '../store/thingclass';
import { IApplication } from '../app/application';
export interface IMarket extends IWork {}

export class Market extends Work implements IMarket, IApplication {
  constructor(_metadata: schema.XSpecies, _current: ITarget) {
    super(_metadata, _current);
    this.speciesTypes = [SpeciesType.Thing];
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    switch (_metadata.typeName) {
      case SpeciesType.Thing:
        return new ThingClass(_metadata, this.current);
    }
  }
  async loadForms(): Promise<IForm[]> {
    const result: IForm[] = [];
    for (const item of this.children) {
      result.push(...(await (item as IThingClass).loadAllForms()));
    }
    return result;
  }
}
