import { model, schema } from '../../../base';
import { IDirectory } from '../directory';
import { FileInfo, IFileInfo } from '../fileinfo';

/** 元数据分类接口 */
export interface ISpecies extends IFileInfo<schema.XSpecies> {
  /** 类目项 */
  items: schema.XSpeciesItem[];
  /** 更新类目 */
  update(data: schema.XSpecies): Promise<boolean>;
  /** 删除类目 */
  delete(): Promise<boolean>;
  /** 加载类目项 */
  loadItems(reload?: boolean): Promise<schema.XSpeciesItem[]>;
  /** 新增类目项 */
  createItem(data: schema.XSpeciesItem): Promise<schema.XSpeciesItem | undefined>;
  /** 删除类目项 */
  deleteItem(item: schema.XSpeciesItem): Promise<boolean>;
  /** 更新类目项 */
  updateItem(data: schema.XSpeciesItem): Promise<boolean>;
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
    if (
      destination.id != this.directory.id &&
      destination.target.belongId != this.directory.target.belongId
    ) {
      const res = await destination.createSpecies({
        ...this.metadata,
        sourceId: this.metadata.belongId,
        directoryId: destination.id,
      });
      if (res) {
        this.items.forEach(async (a) => {
          await res.createItem(a);
        });
      }
      return res != undefined;
    }
    return false;
  }
  async move(destination: IDirectory): Promise<boolean> {
    if (
      destination.id != this.directory.id &&
      destination.metadata.belongId == this.directory.metadata.belongId
    ) {
      const data = { ...this.metadata, directoryId: destination.id };
      const species = await destination.resource.speciesColl.replace(data);
      if (species) {
        this.setMetadata(species);
        if (this.directory.target.id != destination.target.id) {
          destination.resource.speciesColl.cache.push(species);
          this.directory.resource.speciesColl.cache =
            this.directory.resource.speciesColl.cache.filter((a) => data.id != a.id);
        }
        this.directory.specieses = this.directory.specieses.filter(
          (i) => i.key != this.key,
        );
        this.directory = destination;
        destination.specieses.push(this);
        return true;
      }
    }
    return false;
  }
  async update(data: schema.XSpecies): Promise<boolean> {
    const res = await this.directory.resource.speciesColl.replace({
      ...this.metadata,
      ...data,
      id: this.id,
      directoryId: this.metadata.directoryId,
    });
    if (res) {
      this.setMetadata(res);
      return true;
    }
    return false;
  }
  async delete(): Promise<boolean> {
    if (this.directory) {
      const success =
        (await this.directory.resource.speciesItemColl.deleteMatch({
          speciesId: this.id,
        })) && (await this.directory.resource.speciesColl.delete(this.metadata));
      if (success) {
        this.directory.specieses = this.directory.specieses.filter(
          (i) => i.key != this.key,
        );
      }
      return success;
    }
    return false;
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadItems(reload);
    return true;
  }
  async loadItems(reload: boolean = false): Promise<schema.XSpeciesItem[]> {
    if (!this._itemLoaded || reload) {
      const res = await this.directory.resource.speciesItemColl.load({
        options: { match: { speciesId: this.id } },
      });
      this._itemLoaded = true;
      this.items = res || [];
    }
    return this.items;
  }
  async createItem(data: schema.XSpeciesItem): Promise<schema.XSpeciesItem | undefined> {
    const res = await this.directory.resource.speciesItemColl.insert({
      ...data,
      speciesId: this.id,
    });
    if (res) {
      this.items.push(res);
      return res;
    }
  }
  async deleteItem(item: schema.XSpeciesItem): Promise<boolean> {
    const res = await this.directory.resource.speciesItemColl.delete(item);
    if (res) {
      this.items = this.items.filter((i) => i.id != item.id);
    }
    return res;
  }
  async updateItem(data: schema.XSpeciesItem): Promise<boolean> {
    const res = await this.directory.resource.speciesItemColl.replace({
      ...data,
      speciesId: this.id,
    });
    data.speciesId = this.id;
    if (res) {
      this.items = this.items.filter((i) => i.id != data.id);
      this.items.push(res);
      return true;
    }
    return false;
  }
}
