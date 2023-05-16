import { SpeciesType, TargetType } from '../../public/enums';
import { ISpeciesItem, SpeciesItem } from '../base/species';
import { kernel, schema } from '@/ts/base';
import { ITarget } from '../../target/base/target';
import { Form, IForm } from '../base/form';
import { IMarket } from './market';
import { PageAll } from '../../public/consts';
export interface ICommodity extends ISpeciesItem {
  /** 市场接口 */
  market: IMarket;
  /** 商品对应的表单 */
  form: IForm | undefined;
  /** 加载表单 */
  loadForm(reload?: boolean): Promise<IForm | undefined>;
  /** 所有的表单 */
  loadAllForms(): Promise<IForm[]>;
}

export class Commodity extends SpeciesItem implements ICommodity {
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
  form: IForm | undefined;
  market: IMarket;
  override async delete(): Promise<boolean> {
    await this.loadForm();
    if (this.form) {
      await this.form.delete();
    }
    return await super.delete();
  }
  async loadForm(reload: boolean = false): Promise<IForm | undefined> {
    if (!this.form || reload) {
      const res = await kernel.querySpeciesForms({
        id: this.current.metadata.id,
        speciesId: this.metadata.id,
        belongId: this.belongId,
        upTeam: this.current.metadata.typeName === TargetType.Group,
        page: PageAll,
      });
      if (res.success) {
        if (res.data.result && res.data.result.length > 0) {
          this.form = new Form(res.data.result[0], this);
        } else {
          const res = await kernel.createForm({
            name: this.metadata.name,
            id: '0',
            rule: '{}',
            code: this.metadata.code,
            remark: this.metadata.remark,
            speciesId: this.metadata.id,
            shareId: this.metadata.shareId,
          });
          if (res.success && res.data.id) {
            this.form = new Form(res.data, this);
          }
        }
      }
    }
    return this.form;
  }
  async loadAllForms(): Promise<IForm[]> {
    const result = [];
    await this.loadForm();
    if (this.form) {
      result.push(this.form);
    }
    for (const item of this.children) {
      result.push(...(await (item as Commodity).loadAllForms()));
    }
    return result;
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    return new Commodity(_metadata, _current, this, this.market);
  }
}
