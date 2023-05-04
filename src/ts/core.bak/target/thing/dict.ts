import { DictItemModel, DictModel, PageRequest } from '@/ts/base/model';
import { XDict, XDictArray, XDictItem, XDictItemArray } from '@/ts/base/schema';
import { kernel, pageAll } from '@/ts/base';

export class Dict {
  belongId: string;
  dicts: XDict[];
  constructor(id: string) {
    this.belongId = id;
    this.dicts = [];
  }

  /* 加载字典 */
  async loadDict(): Promise<XDictArray> {
    const res = await kernel.queryDict({
      id: this.belongId,
      page: pageAll(),
    });
    if (res.data && res.data.result) {
      this.dicts = res.data.result;
    }
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
  async loadDictItem(
    id: string,
    belongId: string,
    page: PageRequest,
  ): Promise<XDictItemArray> {
    const res = await kernel.queryDictItems({
      id: id,
      spaceId: belongId,
      page: page,
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
