import { PageAll } from '@/ts/core/public/consts';
import { SpeciesType, TargetType } from '@/ts/core/public/enums';
import { ISpeciesItem, SpeciesItem } from './species';
import { kernel, model, schema } from '@/ts/base';
import { ITarget } from '../../target/base/target';
import { IPropClass } from '../store/propclass';
export interface IForm extends ISpeciesItem {
  /** 表单 */
  forms: schema.XForm[];
  /** 表单特性 */
  attributes: schema.XAttribute[];
  /** 加载可选属性 */
  loadPropertys(): Promise<schema.XProperty[]>;
  /** 加载表单 */
  loadForms(reload?: boolean): Promise<schema.XForm[]>;
  /** 新建表单 */
  createForm(data: model.FormModel): Promise<schema.XForm | undefined>;
  /** 更新表单 */
  updateForm(data: model.FormModel): Promise<boolean>;
  /** 删除表单 */
  deleteForm(data: schema.XForm): Promise<boolean>;
  /** 加载表单特性 */
  loadAttributes(reload?: boolean): Promise<schema.XAttribute[]>;
  /** 新建表单特性 */
  createAttribute(data: model.AttributeModel): Promise<schema.XAttribute | undefined>;
  /** 更新表单特性 */
  updateAttribute(data: model.AttributeModel): Promise<boolean>;
  /** 删除表单特性 */
  deleteAttribute(data: schema.XAttribute): Promise<boolean>;
}

export abstract class Form extends SpeciesItem implements IForm {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent: ISpeciesItem) {
    super(_metadata, _current, _parent);
  }
  forms: schema.XForm[] = [];
  attributes: schema.XAttribute[] = [];
  private _formLoaded: boolean = false;
  private _attributeLoaded: boolean = false;
  async loadPropertys(): Promise<schema.XProperty[]> {
    const result = [];
    for (const item of this.current.space.species) {
      switch (item.metadata.typeName) {
        case SpeciesType.Store:
          result.push(...(await (item as IPropClass).loadAllProperty()));
      }
    }
    return result;
  }
  async loadForms(reload: boolean = false): Promise<schema.XForm[]> {
    if (!this._formLoaded || reload) {
      const res = await kernel.querySpeciesForms({
        id: this.current.metadata.id,
        speciesId: this.metadata.id,
        belongId: this.current.space.metadata.id,
        upTeam: this.current.metadata.typeName === TargetType.Group,
        upSpecies: true,
        page: PageAll,
      });
      if (res.success) {
        this._formLoaded = true;
        this.forms = [];
        this._formChanged('added', res.data.result || []);
      }
    }
    return this.forms;
  }
  async createForm(data: model.FormModel): Promise<schema.XForm | undefined> {
    data.shareId = this.current.metadata.id;
    data.speciesId = this.metadata.id;
    const res = await kernel.createForm(data);
    if (res.success && res.data.id) {
      this._formChanged('added', [res.data]);
      return res.data;
    }
  }
  async updateForm(data: model.FormModel): Promise<boolean> {
    const index = this.forms.findIndex((i) => i.id === data.id);
    if (index > -1) {
      data.shareId = this.current.metadata.id;
      data.speciesId = this.metadata.id;
      const res = await kernel.updateForm(data);
      if (res.success && res.data.id) {
        this._formChanged('updated', [res.data]);
      }
      return res.success;
    }
    return false;
  }
  async deleteForm(data: schema.XForm): Promise<boolean> {
    const index = this.forms.findIndex((i) => i.id === data.id);
    if (index > -1) {
      const res = await kernel.deleteForm({
        id: data.id,
        page: PageAll,
      });
      if (res.success) {
        this._formChanged('deleted', [data]);
      }
      return res.success;
    }
    return false;
  }
  async loadAttributes(reload: boolean = false): Promise<schema.XAttribute[]> {
    if (!this._attributeLoaded || reload) {
      const res = await kernel.querySpeciesAttrs({
        id: this.current.metadata.id,
        speciesId: this.metadata.id,
        belongId: this.current.space.metadata.id,
        upTeam: this.current.metadata.typeName === TargetType.Group,
        upSpecies: true,
        page: PageAll,
      });
      if (res.success) {
        this._attributeLoaded = true;
        this.attributes = [];
        this._attributeChanged('added', res.data.result || []);
      }
    }
    return this.attributes;
  }
  async createAttribute(
    data: model.AttributeModel,
  ): Promise<schema.XAttribute | undefined> {
    data.shareId = this.current.metadata.id;
    data.speciesId = this.metadata.id;
    const res = await kernel.createAttribute(data);
    if (res.success && res.data.id) {
      this._attributeChanged('added', [res.data]);
      return res.data;
    }
  }
  async updateAttribute(data: model.AttributeModel): Promise<boolean> {
    const index = this.attributes.findIndex((i) => i.id === data.id);
    if (index > -1) {
      data.shareId = this.current.metadata.id;
      data.speciesId = this.metadata.id;
      const res = await kernel.updateAttribute(data);
      if (res.success && res.data.id) {
        this._attributeChanged('updated', [res.data]);
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
        this._attributeChanged('deleted', [data]);
      }
      return res.success;
    }
    return false;
  }
  _attributeChanged(type: string, props: schema.XAttribute[]) {
    if (this._attributeLoaded) {
      for (const item of props) {
        switch (type) {
          case 'deleted':
            this.attributes = this.attributes.filter((i) => i.id != item.id);
            break;
          case 'added':
            this.attributes.push(item);
            break;
          case 'updated':
            {
              const index = this.attributes.findIndex((i) => i.id === item.id);
              if (index > -1) {
                this.attributes[index] = item;
              }
            }
            break;
        }
      }
      for (const item of this.children) {
        switch (item.metadata.typeName) {
          case SpeciesType.Commodity:
          case SpeciesType.WorkForm:
            (item as Form)._attributeChanged(type, props);
            break;
        }
      }
    }
  }
  _formChanged(type: string, props: schema.XForm[]) {
    if (this._formLoaded) {
      for (const item of props) {
        switch (type) {
          case 'deleted':
            this.forms = this.forms.filter((i) => i.id != item.id);
            break;
          case 'added':
            this.forms.push(item);
            break;
          case 'updated':
            {
              const index = this.forms.findIndex((i) => i.id === item.id);
              if (index > -1) {
                this.forms[index] = item;
              }
            }
            break;
        }
      }
      for (const item of this.children) {
        switch (item.metadata.typeName) {
          case SpeciesType.Commodity:
          case SpeciesType.WorkForm:
            (item as Form)._formChanged(type, props);
            break;
        }
      }
    }
  }
}
