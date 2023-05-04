import { kernel, schema } from '../../../base';
import { PageAll } from '../../public/consts';
import { SpeciesType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';

/** 属性分类的抽象接口 */
export interface IPropClass extends ISpeciesItem {
  /** 类别属性 */
  propertys: schema.XProperty[];
  /** 加载属性 */
  loadPropertys(reload?: boolean): Promise<schema.XProperty[]>;
}

/** 属性分类的基类实现 */
export class PropClass extends SpeciesItem implements IPropClass {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: IPropClass) {
    super(_metadata, _current);
    this.parent = _parent;
    for (const item of _metadata.nodes || []) {
      this.children.push(new PropClass(item, this.current, this));
    }
    this.speciesTypes = [SpeciesType.PropClass];
  }
  propertys: schema.XProperty[] = [];
  private _propertyLoaded: boolean = false;
  async loadPropertys(reload: boolean = false): Promise<schema.XProperty[]> {
    if (!this._propertyLoaded || reload) {
      const res = await kernel.queryPropertys({
        id: this.metadata.id,
        page: PageAll,
      });
      if (res.success) {
        this._propertyLoaded = true;
        this.propertys = res.data.result || [];
      }
    }
    return this.propertys;
  }
}
