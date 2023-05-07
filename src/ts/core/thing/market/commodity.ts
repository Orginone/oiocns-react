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
    const result: schema.XForm[] = [];
    await this.loadForms();
    result.push(...this.forms);
    for (const item of this.children) {
      result.push(...(await (item as ICommodity).loadAllForms()));
    }
    return result;
  }
  async loadAllAttributes(): Promise<schema.XAttribute[]> {
    const result: schema.XAttribute[] = [];
    await this.loadAttributes();
    result.push(...this.attributes);
    for (const item of this.children) {
      result.push(...(await (item as ICommodity).loadAllAttributes()));
    }
    return result;
  }
}
