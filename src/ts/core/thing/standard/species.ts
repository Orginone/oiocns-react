import { schema } from '../../../base';
import { XCollection } from '../../public/collection';
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
  itemColl: XCollection<schema.XSpeciesItem>;
  constructor(_metadata: schema.XSpecies, _directory: IDirectory) {
    super(_metadata, _directory, _directory.resource.speciesColl);
    this.itemColl = _directory.resource.speciesItemColl;
    this.itemColl.subscribe((res: { operate: string; data: schema.XSpeciesItem[] }) => {
      res.data.map((item) => this.receiveItems(res.operate, item));
    });
  }
  items: schema.XSpeciesItem[] = [];
  private _itemLoaded: boolean = false;
  override async delete(): Promise<boolean> {
    if (this.directory) {
      const success = await this.directory.resource.speciesItemColl.deleteMatch({
        speciesId: this.id,
      });
      if (success) {
        return super.delete();
      }
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
  receiveItems(operate: string, data: schema.XSpeciesItem): void {
    if (data.speciesId == this.id) {
      switch (operate) {
        case 'insert':
          this.itemColl.cache.push(data);
          this.items.push(data);
          break;
        case 'replace':
          const index = this.itemColl.cache.findIndex((a) => a.id == data.id);
          this.itemColl.cache[index] = data;
          const itemindex = this.items.findIndex((a) => a.id == data.id);
          this.items[itemindex] = data;
          break;
        case 'delete':
          this.itemColl.removeCache(data.id);
          this.items = this.items.filter((i) => i.id != data.id);
          break;
        default:
          break;
      }
    }
  }
  override copy(
    destination: IDirectory,
    _coll?: XCollection<schema.XSpecies>,
  ): Promise<boolean> {
    return super.copy(destination, destination.resource.speciesColl);
  }
}
