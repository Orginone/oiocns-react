import { DictItemModel, DictModel, PageRequest } from '../../base/model';
import { XDict, XDictArray, XDictItem, XDictItemArray } from '../../base/schema';
import { kernel } from '../../base';

export class Dict {
  belongId: string;
  constructor(id: string) {
    this.belongId = id;
  }

  /* 加载字典 */
  async loadDict(page: PageRequest): Promise<XDictArray> {
    const res = await kernel.queryDict({
      id: this.belongId,
      page: page,
    });
    return res.data;
  }
  /* 创建字典  */
  async createDict(data: DictModel): Promise<XDict> {
    data.belongId = this.belongId;
    const res = await kernel.createDict(data);
    return res.data;
  }
  /* 更新字典  */
  async updateDict(data: DictModel): Promise<XDict> {
    data.belongId = this.belongId;
    const res = await kernel.updateDict(data);
    return res.data;
  }

  /* 删除字典  */
  async deleteDict(id: string): Promise<boolean> {
    const res = await kernel.deleteDict(id);
    return res.data;
  }

  /* 加载字典项 */
  async loadDictItem(id: string, page: PageRequest): Promise<XDictItemArray> {
    const res = await kernel.queryDictItems({
      id: id,
      spaceId: this.belongId,
      page: page,
      spaceId: this.belongId,
    });
    return res.data;
  }
  /* 创建字典项  */
  async createDictItem(data: DictItemModel): Promise<XDictItem> {
    data.belongId = this.belongId;
    const res = await kernel.createDictItem(data);
    return res.data;
  }
  /* 更新字典项  */
  async updateDictItem(data: DictItemModel): Promise<XDictItem> {
    data.belongId = this.belongId;
    const res = await kernel.updateDictItem(data);
    return res.data;
  }

  /* 删除字典项  */
  async deleteDictItem(id: string): Promise<boolean> {
    const res = await kernel.deleteDictItem(id);
    return res.data;
  }
}
