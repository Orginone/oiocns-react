import { schema, model } from '../../../base';
import { orgAuth } from '../../../core/public';
import { IDirectory } from '../directory';
import { IStandardFileInfo, StandardFileInfo } from '../fileinfo';

/** 表单类接口 */
export interface IForm extends IStandardFileInfo<schema.XForm> {
  /** 表单特性 */
  attributes: schema.XAttribute[];
  /** 表单字段 */
  fields: model.FieldModel[];
  /** 新建表单特性 */
  createAttribute(propertys: schema.XProperty[]): Promise<schema.XAttribute[]>;
  /** 更新表单特性 */
  updateAttribute(
    data: model.AttributeModel,
    property?: schema.XProperty,
  ): Promise<boolean>;
  /** 删除表单特性 */
  deleteAttribute(data: schema.XAttribute): Promise<boolean>;
}

export class Form extends StandardFileInfo<schema.XForm> implements IForm {
  constructor(_metadata: schema.XForm, _directory: IDirectory) {
    super(_metadata, _directory, _directory.resource.formColl);
    this.setEntity();
  }
  canDesign: boolean = true;
  private _fieldsLoaded: boolean = false;
  fields: model.FieldModel[] = [];
  get attributes(): schema.XAttribute[] {
    const attrs: schema.XAttribute[] = [];
    const prodIds: string[] = [];
    for (const item of this.metadata.attributes || []) {
      if (item.propId && item.propId.length > 0 && !prodIds.includes(item.propId)) {
        attrs.push(item);
        prodIds.push(item.propId);
      }
    }
    return attrs;
  }
  get id(): string {
    return this._metadata.id.replace('_', '');
  }
  get cacheFlag(): string {
    return 'forms';
  }
  get groupTags(): string[] {
    return ['表单', ...super.groupTags];
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadFields(reload);
    return true;
  }
  async loadFields(reload: boolean = false): Promise<model.FieldModel[]> {
    if (!this._fieldsLoaded || reload) {
      this.fields = [];
      const speciesIds = this.attributes
        .map((i) => i.property?.speciesId)
        .filter((i) => i && i.length > 0);
      const data = await this.directory.resource.speciesItemColl.loadSpace({
        options: { match: { speciesId: { _in_: speciesIds } } },
      });
      this.attributes.forEach(async (attr) => {
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
            field.lookups = data
              .filter((i) => i.speciesId === attr.property!.speciesId)
              .map((i) => {
                return {
                  id: i.id,
                  text: i.name,
                  value: i.code || `S${i.id}`,
                  icon: i.icon,
                  parentId: i.parentId,
                };
              });
          }
          this.fields.push(field);
        }
      });
      this._fieldsLoaded = true;
    }
    return this.fields;
  }
  async createAttribute(propertys: schema.XProperty[]): Promise<schema.XAttribute[]> {
    const data = propertys.map((prop) => {
      return {
        id: 'snowId()',
        propId: prop.id,
        name: prop.name,
        code: prop.code,
        rule: '{}',
        remark: prop.remark,
        property: prop,
        authId: orgAuth.SuperAuthId,
      } as schema.XAttribute;
    });
    await this.update({
      ...this.metadata,
      attributes: [...(this.metadata.attributes || []), ...data],
    });
    return data;
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
  override async copy(destination: IDirectory): Promise<boolean> {
    if (this.allowCopy(destination)) {
      return await super.copyTo(destination.id, destination.resource.formColl);
    }
    return false;
  }
  override async move(destination: IDirectory): Promise<boolean> {
    if (this.allowMove(destination)) {
      return await super.moveTo(destination.id, destination.resource.formColl);
    }
    return false;
  }
}
