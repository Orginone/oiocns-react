import { SpeciesType } from '../../public/enums';
import { ISpeciesItem } from '../base/species';
import { schema } from '@/ts/base';
import { ITarget } from '../../target/base/target';
import { Form, IForm } from '../base/form';
import { IMarket } from './market';
export interface ICommodity extends IForm {
  /** 市场接口 */
  market: IMarket;
  /** 所有的表单 */
  loadAllForms(): Promise<schema.XForm[]>;
  /** 所有的表单特性 */
  loadAllAttributes(): Promise<schema.XAttribute[]>;
}

export class Commodity extends Form implements ICommodity {
  constructor(
    _metadata: schema.XSpecies,
    _current: ITarget,
    _parent: ISpeciesItem,
    _market: IMarket,
  ) {
    super(_metadata, _current, _parent);
    this.market = _market;
    this.speciesTypes = [SpeciesType.Commodity];
    for (const item of _metadata.nodes || []) {
      const subItem = this.createChildren(item, _current);
      if (subItem) {
        this.children.push(subItem);
      }
    }
  }
  market: IMarket;
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    return new Commodity(_metadata, _current, this, this.market);
  }
  async loadAllForms(): Promise<schema.XForm[]> {
    const result = [];
    await this.loadForms();
    result.push(...this.forms);
    for (const item of this.children) {
      const subForms = await (item as Commodity).loadAllForms();
      for (const sub of subForms) {
        if (result.findIndex((i) => i.id === sub.id) < 0) {
          result.push(sub);
        }
      }
    }
    return result;
  }
  async loadAllAttributes(): Promise<schema.XAttribute[]> {
    const result = [];
    await this.loadAttributes();
    result.push(...this.attributes);
    for (const item of this.children) {
      const subAttribute = await (item as Commodity).loadAllAttributes();
      for (const sub of subAttribute) {
        if (result.findIndex((i) => i.id === sub.id) < 0) {
          result.push(sub);
        }
      }
    }
    return result;
  }
}
