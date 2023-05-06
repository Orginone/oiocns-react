import { kernel, model, schema } from '../../../base';
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
  /** 新建表单特性 */
  createProperty(data: model.PropertyModel): Promise<schema.XProperty | undefined>;
  /** 更新表单特性 */
  updateProperty(data: model.PropertyModel): Promise<boolean>;
  /** 删除表单特性 */
  deleteProperty(data: schema.XProperty): Promise<boolean>;
}

/** 属性分类的基类实现 */
export class PropClass extends SpeciesItem implements IPropClass {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: IPropClass) {
    super(_metadata, _current, _parent);
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
  async createProperty(data: model.PropertyModel): Promise<schema.XProperty | undefined> {
    data.speciesId = this.metadata.id;
    const res = await kernel.createProperty(data);
    if (res.success && res.data.id) {
      this.propertys.push(res.data);
      return res.data;
    }
  }
  async updateProperty(data: model.PropertyModel): Promise<boolean> {
    const index = this.propertys.findIndex((i) => i.id === data.id);
    if (index > -1) {
      data.speciesId = this.metadata.id;
      const res = await kernel.updateProperty(data);
      if (res.success && res.data.id) {
        this.propertys[index] = res.data;
      }
      return res.success;
    }
    return false;
  }
  async deleteProperty(data: schema.XProperty): Promise<boolean> {
    const index = this.propertys.findIndex((i) => i.id === data.id);
    if (index > -1) {
      const res = await kernel.deleteProperty({
        id: data.id,
        page: PageAll,
      });
      if (res.success) {
        this.propertys.splice(index, 1);
      }
      return res.success;
    }
    return false;
  }
}
