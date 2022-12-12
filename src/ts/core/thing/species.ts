import { kernel, parseAvatar, schema } from '../../base';
import {
  AttributeModel,
  FileItemShare,
  PageRequest,
  SpeciesModel,
} from '../../base/model';
import { INullSpeciesItem, ISpeciesItem } from './ispecies';
/**
 * 分类系统项实现
 */
export class SpeciesItem implements ISpeciesItem {
  id: string;
  name: string;
  isRoot: boolean;
  target: schema.XSpecies;
  parent: INullSpeciesItem;
  children: ISpeciesItem[];
  belongInfo: FileItemShare | undefined;
  constructor(target: schema.XSpecies, parent: INullSpeciesItem) {
    this.children = [];
    this.target = target;
    this.parent = parent;
    this.id = target.id;
    this.name = target.name;
    this.isRoot = parent === undefined;
    if (target.nodes && target.nodes.length > 0) {
      for (const item of target.nodes) {
        this.children.push(new SpeciesItem(item, this));
      }
    }
  }
  async loadAttrs(id: string, page: PageRequest): Promise<schema.XAttributeArray> {
    const res = await kernel.querySpeciesAttrs({
      id: this.id,
      spaceId: id,
      page: {
        offset: page.offset,
        limit: page.limit,
        filter: '',
      },
    });
    return res.data;
  }

  async loadInfo(info: FileItemShare | undefined): Promise<ISpeciesItem> {
    if (info) {
      this.belongInfo = info;
    }
    if (!this.belongInfo && this.target.belongId) {
      const res = await kernel.queryNameBySnowId(this.target.belongId);
      if (res.success && res.data) {
        this.belongInfo = { name: res.data.name } as FileItemShare;
        const avator = parseAvatar(res.data.photo);
        if (avator) {
          this.belongInfo = { ...avator, name: res.data.name };
        }
      }
    }
    return this;
  }

  async create(data: Omit<SpeciesModel, 'id' | 'parentId'>): Promise<INullSpeciesItem> {
    const res = await kernel.createSpecies({
      parentId: this.id,
      ...data,
      id: undefined,
    });
    if (res.success) {
      const newItem = new SpeciesItem(res.data, this);
      this.children.push(newItem);
      return newItem;
    }
    return;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteSpecies({
      id: this.id,
      typeName: '',
      belongId: '0',
    });
    if (res.success && this.parent) {
      this.parent.children = this.parent.children.filter((i) => {
        return i.id != this.id;
      });
    }
    return res.success;
  }
  async createAttr(
    data: Omit<AttributeModel, 'id' | 'speciesId' | 'speciesCode'>,
  ): Promise<boolean> {
    const res = await kernel.createAttribute({
      id: undefined,
      speciesId: this.id,
      speciesCode: this.target.code,
      ...data,
    });
    return res.success;
  }
  async deleteAttr(id: string): Promise<boolean> {
    const res = await kernel.deleteAttribute({
      id: id,
      typeName: '',
      belongId: '',
    });
    return res.success;
  }
}
