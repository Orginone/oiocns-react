import { schema, model, kernel } from '../../base';
import { Entity, IEntity, orgAuth } from '../../core/public';
import { IDirectory } from './directory';
import { FileInfo, IFileInfo } from './fileinfo';

/** 表单类只读接口 */
export interface IFormView extends IEntity<schema.XForm> {
  /** 目录 */
  directory: IDirectory | undefined;
  /** 表单特性 */
  attributes: schema.XAttribute[];
  /** 加载表单特性 */
  loadAttributes(reload?: boolean): Promise<schema.XAttribute[]>;
}

/** 表单类接口 */
export interface IForm extends IFileInfo<schema.XForm> {
  /** 表单特性 */
  attributes: schema.XAttribute[];
  /** 更新表单 */
  update(data: model.FormModel): Promise<boolean>;
  /** 删除表单 */
  delete(): Promise<boolean>;
  /** 加载表单特性 */
  loadAttributes(reload?: boolean): Promise<schema.XAttribute[]>;
  /** 新建表单特性 */
  createAttribute(
    data: model.AttributeModel,
    property?: schema.XProperty,
  ): Promise<schema.XAttribute | undefined>;
  /** 更新表单特性 */
  updateAttribute(
    data: model.AttributeModel,
    property?: schema.XProperty,
  ): Promise<boolean>;
  /** 删除表单特性 */
  deleteAttribute(data: schema.XAttribute): Promise<boolean>;
}

export class FormView extends Entity<schema.XForm> implements IFormView {
  constructor(_metadata: schema.XForm, _directory?: IDirectory) {
    super(_metadata);
    this.directory = _directory;
  }
  directory: IDirectory | undefined;
  attributes: schema.XAttribute[] = [];
  private _attributeLoaded: boolean = false;
  async loadAttributes(reload: boolean = false): Promise<schema.XAttribute[]> {
    if (!this._attributeLoaded || reload) {
      const res = await kernel.queryFormAttributes({
        id: this.id,
        subId: this.metadata.belongId,
      });
      if (res.success) {
        this._attributeLoaded = true;
        this.attributes = res.data.result || [];
      }
    }
    return this.attributes;
  }
}

export class Form extends FileInfo<schema.XForm> implements IForm {
  constructor(_metadata: schema.XForm, _directory: IDirectory) {
    super(_metadata, _directory);
  }
  attributes: schema.XAttribute[] = [];
  private _attributeLoaded: boolean = false;
  async rename(name: string): Promise<boolean> {
    return await this.update({ ...this.metadata, name: name });
  }
  async copy(destination: IDirectory): Promise<boolean> {
    if (destination.id != this.directory.id) {
      const res = await destination.createForm({
        ...this.metadata,
        directoryId: destination.id,
      });
      return res != undefined;
    }
    return false;
  }
  async move(destination: IDirectory): Promise<boolean> {
    if (
      destination.id != this.directory.id &&
      destination.metadata.belongId === this.directory.metadata.belongId
    ) {
      this.setMetadata({ ...this.metadata, directoryId: destination.id });
      const success = await this.update(this.metadata);
      if (success) {
        this.directory.forms = this.directory.forms.filter((i) => i.key != this.key);
        this.directory = destination;
        destination.forms.push(this);
      } else {
        this.setMetadata({ ...this.metadata, directoryId: this.directory.id });
      }
      return success;
    }
    return false;
  }
  async update(data: model.FormModel): Promise<boolean> {
    data.id = this.id;
    data.directoryId = this.metadata.directoryId;
    data.typeName = this.metadata.typeName;
    const res = await kernel.updateForm(data);
    if (res.success && res.data.id) {
      this.setMetadata(res.data);
    }
    return res.success;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteForm({
      id: this.id,
    });
    if (res.success) {
      this.directory.forms = this.directory.forms.filter((i) => i.key != this.key);
    }
    return res.success;
  }
  async loadAttributes(reload: boolean = false): Promise<schema.XAttribute[]> {
    if (!this._attributeLoaded || reload) {
      const res = await kernel.queryFormAttributes({
        id: this.id,
        subId: this.metadata.belongId,
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
    property?: schema.XProperty,
  ): Promise<schema.XAttribute | undefined> {
    data.formId = this.id;
    if (property) {
      data.propId = property.id;
    }
    if (!data.authId || data.authId.length < 5) {
      data.authId = orgAuth.SuperAuthId;
    }
    const res = await kernel.createAttribute(data);
    if (res.success && res.data.id) {
      if (property) {
        res.data.property = property;
        res.data.linkPropertys = [property];
      }
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
      });
      if (res.success) {
        this.attributes.splice(index, 1);
      }
      return res.success;
    }
    return false;
  }
}
