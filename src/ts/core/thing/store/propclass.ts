import { kernel, model, schema } from '../../../base';
import { PageAll } from '../../public/consts';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';

/** 属性分类的抽象接口 */
export interface IPropClass extends ISpeciesItem {
  /** 类别属性 */
  propertys: schema.XProperty[];
  /** 加载所有属性 */
  loadAllProperty(): Promise<schema.XProperty[]>;
  /** 加载属性 */
  loadPropertys(reload?: boolean): Promise<schema.XProperty[]>;
  /** 新建表单特性 */
  createProperty(data: model.PropertyModel): Promise<schema.XProperty | undefined>;
  /** 更新表单特性 */
  updateProperty(data: model.PropertyModel): Promise<boolean>;
  /** 删除表单特性 */
  deleteProperty(data: schema.XProperty): Promise<boolean>;
  /** 加载属性关联的特性 */
  loadPropAttributes(data: schema.XProperty): Promise<schema.XAttribute[]>;
}

/** 属性分类的基类实现 */
export class PropClass extends SpeciesItem implements IPropClass {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: IPropClass) {
    super(_metadata, _current, _parent);
    if (_parent) {
      this.propertys.push(..._parent.propertys);
    }
    for (const item of _metadata.nodes || []) {
      this.children.push(new PropClass(item, this.current, this));
    }
    this.speciesTypes = [_metadata.typeName];
  }
  propertys: schema.XProperty[] = [];
  private _propertyLoaded: boolean = false;
  async loadAllProperty(): Promise<schema.XProperty[]> {
    const result = [];
    await this.loadPropertys();
    result.push(...this.propertys);
    for (const item of this.children) {
      const subPropertys = await (item as IPropClass).loadAllProperty();
      for (const sub of subPropertys) {
        if (result.findIndex((i) => i.id === sub.id) < 0) {
          result.push(sub);
        }
      }
    }
    return result;
  }
  async loadPropAttributes(data: schema.XProperty): Promise<schema.XAttribute[]> {
    const index = this.propertys.findIndex((i) => i.id === data.id);
    if (index > -1) {
      const res = await kernel.queryPropAttributes({
        id: data.id,
        page: PageAll,
      });
      if (res.success) {
        return res.data.result || [];
      }
    }
    return [];
  }
  async loadPropertys(reload: boolean = false): Promise<schema.XProperty[]> {
    if (!this._propertyLoaded || reload) {
      const res = await kernel.queryPropertys({
        id: this.metadata.id,
        page: PageAll,
      });
      if (res.success) {
        this._propertyLoaded = true;
        this.propertys = [];
        this._propertyChanged('added', res.data.result || []);
      }
    }
    return this.propertys;
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    return new PropClass(_metadata, _current, this);
  }
  async createProperty(data: model.PropertyModel): Promise<schema.XProperty | undefined> {
    data.speciesId = this.metadata.id;
    const res = await kernel.createProperty(data);
    if (res.success && res.data.id) {
      this._propertyChanged('added', [res.data]);
      return res.data;
    }
  }
  async updateProperty(data: model.PropertyModel): Promise<boolean> {
    const index = this.propertys.findIndex((i) => i.id === data.id);
    if (index > -1) {
      data.speciesId = this.metadata.id;
      const res = await kernel.updateProperty(data);
      if (res.success && res.data.id) {
        this._propertyChanged('updated', [res.data]);
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
        this._propertyChanged('deleted', [data]);
      }
      return res.success;
    }
    return false;
  }
  _propertyChanged(type: string, props: schema.XProperty[]) {
    if (this._propertyLoaded) {
      for (const item of props) {
        switch (type) {
          case 'deleted':
            this.propertys = this.propertys.filter((i) => i.id != item.id);
            break;
          case 'added':
            this.propertys.push(item);
            break;
          case 'updated':
            {
              const index = this.propertys.findIndex((i) => i.id === item.id);
              if (index > -1) {
                this.propertys[index] = item;
              }
            }
            break;
        }
      }
      for (const item of this.children) {
        (item as PropClass)._propertyChanged(type, props);
      }
    }
  }
}
