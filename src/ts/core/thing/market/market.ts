import { schema } from '@/ts/base';
import { SpeciesType } from '@/ts/core/public/enums';
import { ISpeciesItem } from '../base/species';
import { ITarget } from '../../target/base/target';
import { Commodity, ICommodity } from './commodity';
import { IWork, Work } from '../base/work';
import { IForm } from '../base/form';
export interface IMarket extends IWork {}

export class Market extends Work implements IMarket {
  constructor(_metadata: schema.XSpecies, _current: ITarget) {
    super(_metadata, _current);
    this.speciesTypes = [SpeciesType.Commodity];
    for (const item of _metadata.nodes || []) {
      const subItem = this.createChildren(item, _current);
      if (subItem) {
        this.children.push(subItem);
      }
    }
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    return new Commodity(_metadata, _current, this, this);
  }
  async loadForms(): Promise<IForm[]> {
    const result: IForm[] = [];
    for (const item of this.children) {
      result.push(...(await (item as ICommodity).loadAllForms()));
    }
    return result;
  }
}
