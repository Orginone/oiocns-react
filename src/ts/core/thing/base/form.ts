import { PageAll } from '@/ts/core/public/consts';
import { SpeciesType } from '@/ts/core/public/enums';
import { ISpeciesItem } from './species';
import { common, kernel, model, schema } from '@/ts/base';
import { IPropClass } from '../store/propclass';
import { IWorkThing } from '../app/workthing';
import { XProperty } from '@/ts/base/schema';
export interface IForm extends common.IEntity {
  /** 唯一标识 */
  id: string;
  /** 表单元数据 */
  metadata: schema.XForm;
  /** 表单分类 */
  species: ISpeciesItem;
  /** 表单特性 */
  attributes: schema.XAttribute[];
  /** 更新表单 */
  update(data: model.FormModel): Promise<boolean>;
  /** 删除表单 */
  delete(): Promise<boolean>;
  /** 加载可选属性 */
  loadPropertys(): Promise<schema.XProperty[]>;
  /** 加载表单特性 */
  loadAttributes(reload?: boolean): Promise<schema.XAttribute[]>;
  /** 新建表单特性 */
  createAttribute(
    data: model.AttributeModel,
    property: XProperty,
  ): Promise<schema.XAttribute | undefined>;
  /** 更新表单特性 */
  updateAttribute(
    data: model.AttributeModel,
    property?: schema.XProperty,
  ): Promise<boolean>;
  /** 删除表单特性 */
  deleteAttribute(data: schema.XAttribute): Promise<boolean>;
}

export class Form extends common.Entity implements IForm {
  constructor(_metadata: schema.XForm, _species: ISpeciesItem) {
    super();
    this.metadata = _metadata;
    this.species = _species;
  }
  metadata: schema.XForm;
  species: ISpeciesItem;
  attributes: schema.XAttribute[] = [];
  private _attributeLoaded: boolean = false;
  get id(): string {
    return this.metadata.id;
  }
  async loadPropertys(): Promise<schema.XProperty[]> {
    const result = [];
    for (const item of this.species.current.space.species) {
      switch (item.metadata.typeName) {
        case SpeciesType.Store:
          result.push(...(await (item as IPropClass).loadAllProperty()));
      }
    }
    return result;
  }
  async update(data: model.FormModel): Promise<boolean> {
    data.shareId = this.metadata.shareId;
    data.speciesId = this.metadata.speciesId;
    const res = await kernel.updateForm(data);
    if (res.success && res.data.id) {
      this.metadata = res.data;
    }
    return res.success;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteForm({
      id: this.id,
      page: PageAll,
    });
    if (res.success) {
      if (this.species.metadata.typeName === SpeciesType.WorkThing) {
        const species = this.species as IWorkThing;
        species.forms = species.forms.filter((i) => i.key != this.key);
      }
    }
    return res.success;
  }
  async loadAttributes(reload: boolean = false): Promise<schema.XAttribute[]> {
    if (!this._attributeLoaded || reload) {
      const res = await kernel.queryFormAttributes({
        id: this.id,
        subId: this.species.belongId,
      });
      if (res.success) {
        this._attributeLoaded = true;
        this.attributes = res.data.result || [];
      }
    }
    return this.attributes;
  }
  async createAttribute(
    data: model.AttributeModel,
    property: XProperty,
  ): Promise<schema.XAttribute | undefined> {
    data.formId = this.id;
    data.propId = property.id;
    if (!data.authId || data.authId.length < 5) {
      data.authId = this.species.metadata.authId;
    }
    const res = await kernel.createAttribute(data);
    if (res.success && res.data.id) {
      res.data.property = property;
      res.data.linkPropertys = [property];
      this.attributes.push(res.data);
      return res.data;
    }
  }
  async updateAttribute(
    data: model.AttributeModel,
    property?: schema.XProperty,
  ): Promise<boolean> {
    const index = this.attributes.findIndex((i) => i.id === data.id);
    if (index > -1) {
      data.formId = this.id;
      if (property) {
        data.propId = property.id;
      }
      const res = await kernel.updateAttribute(data);
      if (res.success && res.data.id) {
        res.data.property = this.attributes[index].property;
        res.data.linkPropertys = this.attributes[index].linkPropertys;
        if (property) {
          res.data.linkPropertys = [property];
        }
        this.attributes[index] = res.data;
      }
      return res.success;
    }
    return false;
  }
  async deleteAttribute(data: schema.XAttribute): Promise<boolean> {
    const index = this.attributes.findIndex((i) => i.id === data.id);
    if (index > -1) {
      const res = await kernel.deleteAttribute({
        id: data.id,
        page: PageAll,
      });
      if (res.success) {
        this.attributes.splice(index, 1);
      }
      return res.success;
    }
    return false;
  }
}
