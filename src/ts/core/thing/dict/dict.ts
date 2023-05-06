import { common, kernel, model, parseAvatar, schema } from '../../../base';
import { PageAll, ShareIdSet } from '../../public/consts';
import { IBelong } from '../../target/base/belong';

/** 元数据字典接口 */
export interface IDict extends common.IEntity {
  /** 数据实体 */
  metadata: schema.XDict;
  /** 加载权限的自归属用户 */
  space: IBelong;
  /** 共享信息 */
  share: model.ShareIcon;
  /** 字典项 */
  items: schema.XDictItem[];
  /** 更新字典 */
  update(data: model.DictModel): Promise<boolean>;
  /** 删除字典 */
  delete(): Promise<boolean>;
  /** 加载字典项 */
  loadItems(reload?: boolean): Promise<schema.XDictItem[]>;
  /** 新增字典项 */
  createItem(data: model.DictItemModel): Promise<schema.XDictItem | undefined>;
  /** 删除字典项 */
  deleteItem(item: schema.XDictItem): Promise<boolean>;
  /** 更新字典项 */
  updateItem(data: model.DictItemModel): Promise<boolean>;
}

/** 元数据字典实现 */
export class Dict extends common.Entity implements IDict {
  constructor(_metadata: schema.XDict, _space: IBelong) {
    super();
    this.space = _space;
    this.metadata = _metadata;
    this.share = {
      name: this.metadata.name,
      typeName: '字典',
      avatar: parseAvatar(this.metadata.icon),
    };
    ShareIdSet.set(this.metadata.id, this.share);
  }
  space: IBelong;
  share: model.ShareIcon;
  metadata: schema.XDict;
  items: schema.XDictItem[] = [];
  private _itemLoaded: boolean = false;
  async update(data: model.DictModel): Promise<boolean> {
    data.id = this.metadata.id;
    data.belongId = this.space.metadata.id;
    const res = await kernel.updateDict(data);
    if (res.success && res.data?.id) {
      this.metadata = res.data;
    }
    return res.success;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteDict({
      id: this.metadata.id,
      page: PageAll,
    });
    if (res.success) {
      this.space.dicts = this.space.dicts.filter((i) => i.key != this.key);
    }
    return res.success;
  }
  async loadItems(reload: boolean = false): Promise<schema.XDictItem[]> {
    if (!this._itemLoaded || reload) {
      const res = await kernel.queryDictItems({
        id: this.metadata.id,
        page: PageAll,
      });
      if (res.success) {
        this.items = res.data.result || [];
      }
    }
    return this.items;
  }
  async createItem(data: model.DictItemModel): Promise<schema.XDictItem | undefined> {
    data.dictId = this.metadata.id;
    const res = await kernel.createDictItem(data);
    if (res.success && res.data?.id) {
      this.items.push(res.data);
      return res.data;
    }
  }
  async deleteItem(item: schema.XDictItem): Promise<boolean> {
    const res = await kernel.deleteDictItem({
      id: item.id,
      page: PageAll,
    });
    if (res.success) {
      this.items = this.items.filter((i) => i.id != item.id);
    }
    return res.success;
  }
  async updateItem(data: model.DictItemModel): Promise<boolean> {
    data.dictId = this.metadata.id;
    const res = await kernel.updateDictItem(data);
    if (res.success) {
      this.items = this.items.filter((i) => i.id != data.id);
      this.items.push(res.data);
    }
    return res.success;
  }
}
