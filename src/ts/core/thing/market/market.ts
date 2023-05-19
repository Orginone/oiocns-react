import { schema } from '@/ts/base';
import { SpeciesType } from '@/ts/core/public/enums';
import { ISpeciesItem } from '../base/species';
import { ITarget } from '../../target/base/target';
import { IWork, Work } from '../base/work';
import { IForm } from '../base/form';
import { IWorkThing, WorkThing } from '../app/workthing';
import { IApplication } from '../app/application';
export interface IMarket extends IWork {}

export class Market extends Work implements IMarket, IApplication {
  constructor(_metadata: schema.XSpecies, _current: ITarget) {
    super(_metadata, _current);
    this.speciesTypes = [SpeciesType.WorkThing];
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
    return new WorkThing(_metadata, this);
  }
  async loadForms(): Promise<IForm[]> {
    const result: IForm[] = [];
    for (const item of this.children) {
      result.push(...(await (item as IWorkThing).loadAllForms()));
    }
    return result;
  }
}
