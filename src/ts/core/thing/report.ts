import { schema, model, kernel } from '../../base';
import { PageAll, orgAuth } from '../../core/public';
import { IDirectory } from './directory';
import { FileInfo, IFileInfo } from './fileinfo';

/** 报表类接口 */
export interface IReport extends IFileInfo<schema.XReport> {
  /** 报表特性 */
  attributes: schema.XAttribute[];
  /** 报表字段 */
  fields: model.FieldModel[];
  /** 更新报表 */
  update(data: model.FormModel): Promise<boolean>;
  /** 删除报表 */
  delete(): Promise<boolean>;
  /** 加载类目项 */
  loadFields(reload?: boolean): Promise<model.FieldModel[]>;
  /** 加载表单特性 */
  loadAttributes(reload?: boolean): Promise<schema.XAttribute[]>;
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

export class Report extends FileInfo<schema.XReport> implements IReport {
  constructor(_metadata: schema.XReport, _directory: IDirectory) {
    super(_metadata, _directory);
  }
  private _fieldsLoaded: boolean = false;
  fields: model.FieldModel[] = [];
  attributes: schema.XAttribute[] = [];
  private _attributeLoaded: boolean = false;
  get id(): string {
    return this._metadata.id.replace('_', '');
  }
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
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadAttributes(reload);
    await this.loadFields(reload);
    return true;
  }
  async loadFields(reload: boolean = false): Promise<model.FieldModel[]> {
    if (!this._fieldsLoaded || reload) {
      this.fields = [];
      await Promise.all(
        this.attributes.map(async (attr) => {
          if (attr.linkPropertys && attr.linkPropertys.length > 0) {
            const property = attr.linkPropertys[0];
            const field: model.FieldModel = {
              id: attr.id,
              rule: attr.rule,
              name: attr.name,
              code: property.code,
              remark: attr.remark,
              lookups: [],
              valueType: property.valueType,
            };
            if (property.speciesId && property.speciesId.length > 0) {
              const res = await kernel.querySpeciesItems({
                id: property.speciesId,
                page: PageAll,
              });
              if (res.success) {
                field.lookups = (res.data.result || []).map((i) => {
                  return {
                    id: i.id,
                    text: i.name,
                    value: i.code,
                    icon: i.icon,
                    parentId: i.parentId,
                  };
                });
              }
            }
            this.fields.push(field);
          }
        }),
      );
      this._fieldsLoaded = true;
    }
    return this.fields;
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
