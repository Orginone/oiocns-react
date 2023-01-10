import { kernel, parseAvatar, schema } from '../../../base';
import { DictItemModel, PageRequest, DictModel, TargetShare } from '../../../base/model';
import { INullDict, IDict } from './idict';
/**
 * 分类系统项实现
 */
export class Dict implements IDict {
  id: string;
  name: string;
  target: schema.XDict;
  belongInfo: TargetShare;

  constructor(target: schema.XDict) {
    this.target = target;
    this.id = target.id;
    this.name = target.name;
    this.belongInfo = { name: '奥集能平台', typeName: '平台' };
  }
  async loadItems(spaceId: string, page: PageRequest): Promise<schema.XDictItemArray> {
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

  async create(data: Omit<DictModel, 'id' | 'parentId'>): Promise<INullDict> {
    const res = await kernel.createDict({
      ...data,
      id: undefined,
    });
    if (res.success) {
      const newItem = new Dict(res.data);
      return newItem;
    }
    return;
  }
  async update(data: Omit<DictModel, 'id' | 'parentId' | 'code'>): Promise<IDict> {
    const res = await kernel.updateDict({
      ...data,
      id: this.id,
      code: this.target.code,
    });
    if (res.success) {
      this.target.name = data.name;
      this.target.public = data.public;
      this.target.belongId = data.belongId;
      this.target.remark = data.remark;
    }
    return this;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteDict({
      id: this.id,
      typeName: '',
    });
    return res.success;
  }
  async createItem(data: Omit<DictItemModel, 'id' | 'dictId'>): Promise<boolean> {
    const res = await kernel.createDictItem({
      ...data,
      id: undefined,
      dictId: this.target.id,
    });
    return res.success;
  }
  async updateItem(data: DictItemModel): Promise<boolean> {
    const res = await kernel.updateDictItem({
      ...data,
    });
    return res.success;
  }
  async deleteItem(id: string): Promise<boolean> {
    const res = await kernel.deleteDictItem({
      id: id,
      typeName: '',
    });
    return res.success;
  }
}
