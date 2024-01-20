import { LoadResult } from '@/ts/base/model';
import { schema, model } from '../../../base';
import { entityOperates, fileOperates, orgAuth } from '../../../core/public';
import { IDirectory } from '../directory';
import { IStandardFileInfo, StandardFileInfo } from '../fileinfo';
import { formatDate } from '@/utils';
import { ITemporaryStorage, TemporaryStorage } from '../../work/storage';

/** 表单类接口 */
export interface IForm extends IStandardFileInfo<schema.XForm> {
  /** 表单特性 */
  attributes: schema.XAttribute[];
  /** 表单字段 */
  fields: model.FieldModel[];
  /** 暂存箱 */
  storage: ITemporaryStorage;
  /** 加载分类字典项 */
  loadItems(speciesIds: string[]): Promise<schema.XSpeciesItem[]>;
  /** 加载引用表单 */
  loadReferenceForm(formIs: string): Promise<schema.XForm>;
  /** 加载字段 */
  loadFields(reload?: boolean): Promise<model.FieldModel[]>;
  /** 保存 */
  save(): Promise<boolean>;
  /** 新建表单特性 */
  createAttribute(propertys: schema.XProperty[]): Promise<schema.XAttribute[]>;
  /** 更新表单特性 */
  updateAttribute(
    data: model.AttributeModel,
    property?: schema.XProperty,
  ): Promise<boolean>;
  /** 删除表单特性 */
  deleteAttribute(data: schema.XAttribute): Promise<boolean>;
  /** 查询表数据 */
  loadThing(loadOptions: any): Promise<LoadResult<any>>;
}

export class Form extends StandardFileInfo<schema.XForm> implements IForm {
  constructor(_metadata: schema.XForm, _directory: IDirectory) {
    super(_metadata, _directory, _directory.resource.formColl);
    this.canDesign = !_metadata.id.includes('_');
    this.setEntity();
    this.storage = new TemporaryStorage(this);
  }
  storage: ITemporaryStorage;
  canDesign: boolean;
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
  async save(): Promise<boolean> {
    return this.update(this.metadata);
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadFields(reload);
    return true;
  }
  async loadFields(reload: boolean = false): Promise<model.FieldModel[]> {
    if (!this._fieldsLoaded || reload) {
      const speciesIds = this.attributes
        .map((i) => i.property?.speciesId)
        .filter((i) => i && i.length > 0)
        .map((i) => i!);
      const data = await this.loadItems(speciesIds);
      this.fields = this.attributes
        .filter((i) => i.property && i.property.id)
        .map((attr) => {
          const field: model.FieldModel = {
            id: attr.id,
            rule: attr.rule,
            name: attr.name,
            widget: attr.widget,
            options: attr.options,
            code: `T${attr.propId}`,
            remark: attr.remark,
            lookups: [],
            valueType: attr.property!.valueType,
          };
          if (attr.property!.speciesId && attr.property!.speciesId.length > 0) {
            field.lookups = data
              .filter((i) => i.speciesId === attr.property!.speciesId)
              .map((i) => {
                return {
                  id: i.id,
                  text: i.name,
                  value: `S${i.id}`,
                  icon: i.icon,
                  parentId: i.parentId,
                };
              });
          }
          return field;
        });
      this._fieldsLoaded = true;
    }
    return this.fields;
  }
  async loadItems(speciesIds: string[]): Promise<schema.XSpeciesItem[]> {
    const ids = speciesIds.filter((i) => i && i.length > 0);
    if (ids.length < 1) return [];
    return await this.directory.resource.speciesItemColl.loadSpace({
      options: {
        match: {
          speciesId: { _in_: ids },
        },
      },
    });
  }
  async loadReferenceForm(formId: string): Promise<schema.XForm> {
    const data = await this.directory.resource.formColl.find([formId]);
    return data[0];
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
    var newMetaData = {
      ...this.metadata,
      directoryId: destination.id,
    };
    if (!this.allowCopy(destination)) {
      const uuid = formatDate(new Date(), 'yyyyMMddHHmmss');
      newMetaData.name = this.metadata.name + `-副本${uuid}`;
      newMetaData.code = this.metadata.code + uuid;
      newMetaData.id = 'snowId()';
    }
    const data = await destination.resource.formColl.replace(newMetaData);
    if (data) {
      return await destination.resource.formColl.notity({
        data: data,
        operate: 'insert',
      });
    }
    return false;
  }
  override async move(destination: IDirectory): Promise<boolean> {
    if (this.allowMove(destination)) {
      return await super.moveTo(destination.id, destination.resource.formColl);
    }
    return false;
  }
  override operates(): model.OperateModel[] {
    if (this.canDesign) {
      return super.operates();
    }
    return [fileOperates.Copy, entityOperates.Remark];
  }
  async loadThing(loadOptions: any): Promise<LoadResult<any>> {
    const res = await this.directory.resource.thingColl.loadResult(loadOptions);
    if (res.success && !Array.isArray(res.data)) {
      res.data = [];
    }
    res.totalCount = res.totalCount ?? 0;
    res.groupCount = res.groupCount ?? 0;
    res.summary = res.summary ?? [];
    return res;
  }
}
