import { XDictItem } from '@/ts/base/schema';
import { kernel, parseAvatar, schema } from '../../base';
import { DictItemModel, PageRequest, TargetShare } from '../../base/model';
import { IDict } from './idict';
/**
 * 分类系统项实现
 */
export class Dict implements IDict {
  id: string;
  name: string;
  target: schema.XDict;
  belongInfo: TargetShare;
  curSpaceId: string;
  items?: XDictItem[];

  constructor(target: schema.XDict, curSpaceId: string) {
    this.target = target;
    this.id = target.id;
    this.name = target.name;
    this.curSpaceId = curSpaceId;
    this.belongInfo = { name: '奥集能平台', typeName: '平台' };
  }
  async loadItems(reload: boolean = false): Promise<XDictItem[]> {
    if (this.items == undefined || reload) {
      const res = await kernel.queryDictItems({
        id: this.target.id,
        spaceId: this.curSpaceId,
        page: {
          offset: 0,
          limit: 1000,
          filter: '',
        },
      });
      this.items = res.data.result || [];
    }
    return this.items;
  }
  async loadItemsByPage(
    spaceId: string,
    page: PageRequest,
  ): Promise<schema.XDictItemArray> {
    const res = await kernel.queryDictItems({
      id: this.target.id,
      spaceId: spaceId,
      page: {
        offset: page.offset,
        limit: page.limit,
        filter: '',
      },
    });
    return res.data;
  }

  async loadInfo(info: TargetShare): Promise<IDict> {
    if (info.typeName != '未知') {
      this.belongInfo = info;
    }
    if (!this.belongInfo && this.target.belongId) {
      const res = await kernel.queryNameBySnowId(this.target.belongId);
      if (res.success && res.data) {
        this.belongInfo = { name: res.data.name, typeName: '未知' } as TargetShare;
        const avator = parseAvatar(res.data.photo);
        if (avator) {
          this.belongInfo = { ...avator, name: res.data.name, typeName: '未知' };
        }
      }
    }
    return this;
  }

  async createItem(data: Omit<DictItemModel, 'id' | 'dictId'>): Promise<boolean> {
    const res = await kernel.createDictItem({
      ...data,
      id: undefined,
      dictId: this.target.id,
    });
    if (res.success) {
      if (this.items) {
        this.items.push(res.data);
      }
    }
    return res.success;
  }
  async updateItem(data: DictItemModel): Promise<boolean> {
    const res = await kernel.updateDictItem({
      ...data,
    });
    if (this.items && res.success) {
      this.items = this.items.map((item: any) => {
        if (item.id == res.data.id) {
          return res.data;
        }
        return item;
      });
    }
    return res.success;
  }
  async deleteItem(id: string): Promise<boolean> {
    const res = await kernel.deleteDictItem({
      id: id,
      typeName: '',
    });
    if (this.items && res.success) {
      this.items = this.items.filter((item: any) => item.id != id);
    }
    return res.success;
  }
}
