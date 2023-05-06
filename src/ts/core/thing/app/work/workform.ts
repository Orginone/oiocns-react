import { PageAll } from '@/ts/core/public/consts';
import { kernel, model, schema } from '../../../../base';
import { ITarget } from '../../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../../base/species';
import { IAppModule } from '../appmodule';
import { TargetType } from '@/ts/core/public/enums';
export interface IWorkForm extends ISpeciesItem {
  /** 表单 */
  forms: schema.XForm[];
  /** 表单特性 */
  attributes: schema.XAttribute[];
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

export class WorkForm extends SpeciesItem implements IWorkForm {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent: IAppModule) {
    super(_metadata, _current, _parent);
    this.speciesTypes = [];
  }
  forms: schema.XForm[] = [];
  attributes: schema.XAttribute[] = [];
  private _formLoaded: boolean = false;
  private _attributeLoaded: boolean = false;
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
        this.forms = res.data.result || [];
      }
    }
    return this.forms;
  }
  async createForm(data: model.FormModel): Promise<schema.XForm | undefined> {
    data.shareId = this.current.metadata.id;
    data.speciesId = this.metadata.id;
    const res = await kernel.createFrom(data);
    if (res.success && res.data.id) {
      this.forms.push(res.data);
      return res.data;
    }
  }
  async updateForm(data: model.FormModel): Promise<boolean> {
    const index = this.forms.findIndex((i) => i.id === data.id);
    if (index > -1) {
      data.shareId = this.current.metadata.id;
      data.speciesId = this.metadata.id;
      const res = await kernel.updateFrom(data);
      if (res.success && res.data.id) {
        this.forms[index] = res.data;
      }
      return res.success;
    }
    return false;
  }
  async deleteForm(data: schema.XForm): Promise<boolean> {
    const index = this.forms.findIndex((i) => i.id === data.id);
    if (index > -1) {
      const res = await kernel.deleteFrom({
        id: data.id,
        page: PageAll,
      });
      if (res.success) {
        this.forms.splice(index, 1);
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
        this.attributes = res.data.result || [];
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
      this.attributes.push(res.data);
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
