import { schema } from '../../../base';
import { IDirectory } from '../directory';
import { IStandardFileInfo, StandardFileInfo } from '../fileinfo';

/** 元数据分类接口 */
export interface ISpecies extends IStandardFileInfo<schema.XSpecies> {
  /** 类目项 */
  items: schema.XSpeciesItem[];
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
export class Species extends StandardFileInfo<schema.XSpecies> implements ISpecies {
  constructor(_metadata: schema.XSpecies, _directory: IDirectory) {
    super(_metadata, _directory, _directory.resource.speciesColl);
  }
  canDesign: boolean = true;
  items: schema.XSpeciesItem[] = [];
  private _itemLoaded: boolean = false;
  get cacheFlag(): string {
    return 'species';
  }
  override async delete(): Promise<boolean> {
    if (this.directory) {
      let success = true;
      if (this.items.length > 0) {
        success = await this.directory.resource.speciesItemColl.deleteMatch({
          speciesId: this.id,
        });
      }
      return success && super.delete();
    }
    return false;
  }
  async loadContent(_: boolean = false): Promise<boolean> {
    await this.loadItems(true);
    return true;
  }
  async loadItems(reload: boolean = false): Promise<schema.XSpeciesItem[]> {
    if (!this._itemLoaded || reload) {
      const res = await this.directory.resource.speciesItemColl.loadSpace({
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
    }
    return res;
  }
  async deleteItem(item: schema.XSpeciesItem): Promise<boolean> {
    const success = await this.directory.resource.speciesItemColl.delete(item);
    if (success) {
      this.items = this.items.filter((i) => i.id != item.id);
    }
    return success;
  }
  async updateItem(data: schema.XSpeciesItem): Promise<boolean> {
    const res = await this.directory.resource.speciesItemColl.replace({
      ...data,
      speciesId: this.id,
    });
    if (res) {
      const index = this.items.findIndex((i) => i.id === data.id);
      if (index > -1) {
        this.items[index] = res;
      }
      return true;
    }
    return false;
  }
  override async copy(destination: IDirectory): Promise<boolean> {
    if (this.allowCopy(destination)) {
      await super.copyTo(destination.id, destination.resource.speciesColl);
      const items = await this.directory.resource.speciesItemColl.loadSpace({
        options: {
          match: {
            speciesId: this.id,
          },
        },
      });
      await destination.resource.speciesItemColl.replaceMany(items);
      return true;
    }
    return false;
  }
  override async move(destination: IDirectory): Promise<boolean> {
    if (this.allowMove(destination)) {
      return await super.moveTo(destination.id, destination.resource.speciesColl);
    }
    return false;
  }
}
