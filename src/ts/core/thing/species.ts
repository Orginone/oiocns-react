import { kernel, model, schema } from '../../base';
import { PageAll } from '../public';
import { IDirectory } from './directory';
import { FileInfo, IFileInfo } from './fileinfo';

/** 元数据分类接口 */
export interface ISpecies extends IFileInfo<schema.XSpecies> {
  /** 类目项 */
  items: schema.XSpeciesItem[];
  /** 更新类目 */
  update(data: model.SpeciesModel): Promise<boolean>;
  /** 删除类目 */
  delete(): Promise<boolean>;
  /** 加载类目项 */
  loadItems(reload?: boolean): Promise<schema.XSpeciesItem[]>;
  /** 新增类目项 */
  createItem(data: model.SpeciesItemModel): Promise<schema.XSpeciesItem | undefined>;
  /** 删除类目项 */
  deleteItem(item: schema.XSpeciesItem): Promise<boolean>;
  /** 更新类目项 */
  updateItem(data: model.SpeciesItemModel): Promise<boolean>;
}

/** 元数据分类实现 */
export class Species extends FileInfo<schema.XSpecies> implements ISpecies {
  constructor(_metadata: schema.XSpecies, _directory: IDirectory) {
    super(_metadata, _directory);
  }
  items: schema.XSpeciesItem[] = [];
  private _itemLoaded: boolean = false;
  async rename(name: string): Promise<boolean> {
    return await this.update({ ...this.metadata, name: name });
  }
  async copy(destination: IDirectory): Promise<boolean> {
    if (destination.id != this.directory.id) {
      const res = await destination.createSpecies({
        ...this.metadata,
        sourceId: this.metadata.belongId,
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
        this.directory.specieses = this.directory.specieses.filter(
          (i) => i.key != this.key,
        );
        this.directory = destination;
        destination.specieses.push(this);
      } else {
        this.setMetadata({ ...this.metadata, directoryId: this.directory.id });
      }
      return success;
    }
    return false;
  }
  async update(data: model.SpeciesModel): Promise<boolean> {
    data.id = this.id;
    data.directoryId = this.metadata.directoryId;
    const res = await kernel.updateSpecies(data);
    if (res.success && res.data?.id) {
      this.setMetadata(res.data);
    }
    return res.success;
  }
  async delete(): Promise<boolean> {
    if (this.directory) {
      const res = await kernel.deleteSpecies({
        id: this.id,
      });
      if (res.success) {
        this.directory.specieses = this.directory.specieses.filter(
          (i) => i.key != this.key,
        );
      }
      return res.success;
    }
    return false;
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadItems(reload);
    return true;
  }
  async loadItems(reload: boolean = false): Promise<schema.XSpeciesItem[]> {
    if (!this._itemLoaded || reload) {
      const res = await kernel.querySpeciesItems({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this._itemLoaded = true;
        this.items = res.data.result || [];
      }
    }
    return this.items;
  }
  async createItem(
    data: model.SpeciesItemModel,
  ): Promise<schema.XSpeciesItem | undefined> {
    data.speciesId = this.id;
    const res = await kernel.createSpeciesItem(data);
    if (res.success && res.data?.id) {
      this.items.push(res.data);
      return res.data;
    }
  }
  async deleteItem(item: schema.XSpeciesItem): Promise<boolean> {
    const res = await kernel.deleteSpeciesItem({
      id: item.id,
    });
    if (res.success) {
      this.items = this.items.filter((i) => i.id != item.id);
    }
    return res.success;
  }
  async updateItem(data: model.SpeciesItemModel): Promise<boolean> {
    data.speciesId = this.id;
    const res = await kernel.updateSpeciesItem(data);
    if (res.success) {
      this.items = this.items.filter((i) => i.id != data.id);
      this.items.push(res.data);
    }
    return res.success;
  }
}
