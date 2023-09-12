import { schema, model } from '../../../base';
import { orgAuth } from '../../../core/public';
import { IDirectory } from '../directory';
import { FileInfo, IFileInfo } from '../fileinfo';

/** 表单类接口 */
export interface IForm extends IFileInfo<schema.XForm> {
  /** 表单特性 */
  attributes: schema.XAttribute[];
  /** 表单字段 */
  fields: model.FieldModel[];
  /** 更新表单 */
  update(data: schema.XForm): Promise<boolean>;
  /** 删除表单 */
  delete(): Promise<boolean>;
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

export class Form extends FileInfo<schema.XForm> implements IForm {
  constructor(_metadata: schema.XForm, _directory: IDirectory) {
    super(_metadata, _directory);
    this.setEntity();
  }
  private _fieldsLoaded: boolean = false;
  fields: model.FieldModel[] = [];
  get attributes(): schema.XAttribute[] {
    return this.metadata.attributes || [];
  }
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
  async update(data: schema.XForm): Promise<boolean> {
    const res = await this.directory.resource.formColl.replace({
      ...this.metadata,
      ...data,
      directoryId: this.metadata.directoryId,
      typeName: this.metadata.typeName,
    });
    if (res) {
      this.setMetadata(res);
      return true;
    }
    return false;
  }
  async delete(): Promise<boolean> {
    const res = await this.directory.resource.formColl.delete(this.metadata);
    if (res) {
      this.directory.forms = this.directory.forms.filter((i) => i.key != this.key);
    }
    return res;
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadFields(reload);
    return true;
  }
  async loadFields(reload: boolean = false): Promise<model.FieldModel[]> {
    if (!this._fieldsLoaded || reload) {
      this.fields = [];
      await Promise.all(
        this.attributes.map(async (attr) => {
          if (attr.property) {
            const field: model.FieldModel = {
              id: attr.id,
              rule: attr.rule,
              name: attr.name,
              code: 'T' + attr.property.id,
              remark: attr.remark,
              lookups: [],
              valueType: attr.property.valueType,
            };
            if (attr.property.speciesId && attr.property.speciesId.length > 0) {
              const data = await this.directory.resource.speciesItemColl.loadSpace({
                options: { match: { speciesId: attr.property.speciesId } },
              });
              if (data.length > 0) {
                field.lookups = data.map((i) => {
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
  async createAttribute(
    data: schema.XAttribute,
    property?: schema.XProperty,
  ): Promise<schema.XAttribute | undefined> {
    if (property) {
      data.property = property;
      data.propId = property.id;
    }
    if (!data.authId || data.authId.length < 5) {
      data.authId = orgAuth.SuperAuthId;
    }
    data.id = 'snowId()';
    const res = await this.update({
      ...this.metadata,
      attributes: [...(this.metadata.attributes || []), data],
    });
    if (res) {
      return data;
    }
  }
  async updateAttribute(
    data: schema.XAttribute,
    property?: schema.XProperty,
  ): Promise<boolean> {
    const oldData = this.attributes.find((i) => i.id === data.id);
    if (oldData) {
      data = { ...oldData, ...data };
      if (property) {
        data.propId = property.id;
        data.property = property;
      }
      const res = await this.update({
        ...this.metadata,
        attributes: [...this.attributes.filter((a) => a.id != data.id), data],
      });
      return res;
    }
    return false;
  }
  async deleteAttribute(data: schema.XAttribute): Promise<boolean> {
    const index = this.attributes.findIndex((i) => i.id === data.id);
    if (index > -1) {
      const res = await this.update({
        ...this.metadata,
        attributes: [...this.attributes.filter((a) => a.id != data.id)],
      });
      return res;
    }
    return false;
  }
}
