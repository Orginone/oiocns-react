import {
  FlowNode,
  XAttribute,
  XAttributeArray,
  XFlowDefine,
  XFlowDefineArray,
} from '@/ts/base/schema';
import { kernel, model, schema } from '@/ts/base';
import {
  AttributeModel,
  OperationModel,
  PageRequest,
  SpeciesModel,
} from '@/ts/base/model';
import { INullSpeciesItem, ISpeciesItem } from './ispecies';
import { ITarget } from '../itarget';
/**
 * 分类系统项实现
 */
export class SpeciesItem implements ISpeciesItem {
  key: string;
  id: string;
  name: string;
  isRoot: boolean;
  target: schema.XSpecies;
  parent: INullSpeciesItem;
  children: ISpeciesItem[];
  attrs?: XAttribute[];
  defines?: XFlowDefine[];
  instances?: schema.XFlowInstance[];
  team: ITarget;

  constructor(target: schema.XSpecies, parent: INullSpeciesItem, team: ITarget) {
    this.children = [];
    this.target = target;
    this.parent = parent;
    this.id = target.id;
    this.name = target.name;
    this.isRoot = parent === undefined;
    this.team = team;
    this.key = team.key + '-' + this.target.id;
    if (target.nodes && target.nodes.length > 0) {
      for (const item of target.nodes) {
        this.children.push(new SpeciesItem(item, this, team));
      }
    }
  }
  async loadAttrs(reload: boolean = false): Promise<XAttribute[]> {
    if (this.attrs == undefined || this.attrs.length == 0 || reload) {
      const res = await kernel.querySpeciesAttrs({
        id: this.id,
        spaceId: this.team.space.id,
        recursionOrg: true,
        recursionSpecies: true,
        page: {
          offset: 0,
          limit: 100000,
          filter: '',
        },
      });
      this.attrs = res.data.result || [];
    }
    return this.attrs;
  }

  async loadAttrsByPage(
    id: string,
    recursionOrg: boolean,
    recursionSpecies: boolean,
    page: PageRequest,
  ): Promise<XAttributeArray> {
    const res = await kernel.querySpeciesAttrs({
      id: this.id,
      spaceId: id,
      recursionOrg: recursionOrg,
      recursionSpecies: recursionSpecies,
      page: {
        offset: page.offset,
        limit: page.limit,
        filter: '',
      },
    });
    return res.data;
  }

  async loadOperations(
    id: string,
    filterAuth: boolean,
    recursionOrg: boolean,
    recursionSpecies: boolean,
    page: PageRequest,
  ): Promise<schema.XOperationArray> {
    const res = await kernel.querySpeciesOperation({
      id: this.id,
      spaceId: id,
      filterAuth,
      recursionOrg,
      recursionSpecies,
      page: {
        offset: page.offset,
        limit: page.limit,
        filter: '',
      },
    });
    return res.data;
  }

  async loadWork(page: PageRequest): Promise<XFlowDefineArray> {
    let res = (
      await kernel.queryDefine({
        spaceId: this.team.id,
        speciesId: this.id,
      })
    ).data;
    return {
      result: res.result,
      offset: page.offset,
      limit: page.limit,
      total: res.total,
    };
  }

  async loadWorkNode(id: string): Promise<FlowNode> {
    return (await kernel.queryNodes({ id: id })).data;
  }

  async create(data: Omit<SpeciesModel, 'id' | 'parentId'>): Promise<INullSpeciesItem> {
    console.log(data);
    const res = await kernel.createSpecies({
      parentId: this.id,
      ...data,
    });
    if (res.success) {
      const newItem = new SpeciesItem(res.data, this, this.team);
      this.children.push(newItem);
      return newItem;
    }
    return;
  }

  async update(
    data: Omit<SpeciesModel, 'id' | 'parentId' | 'code'>,
  ): Promise<ISpeciesItem> {
    const res = await kernel.updateSpecies({
      ...data,
      id: this.id,
      code: this.target.code,
      parentId: this.target.parentId,
    });
    if (res.success) {
      this.name = data.name;
      this.target.name = data.name;
      this.target.public = data.public;
      this.target.authId = data.authId;
      this.target.belongId = data.belongId;
      this.target.remark = data.remark;
    }
    return this;
  }

  async delete(): Promise<boolean> {
    const res = await kernel.deleteSpecies({
      id: this.id,
      typeName: '',
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
    if (res.success) {
      if (this.attrs) {
        this.attrs.push(res.data);
      }
    }
    return res.success;
  }

  async updateAttr(
    data: Omit<AttributeModel, 'speciesId' | 'speciesCode'>,
  ): Promise<boolean> {
    const res = await kernel.updateAttribute({
      ...data,
      speciesId: this.target.id,
      speciesCode: this.target.code,
    });
    if (this.attrs && res.success) {
      this.attrs = this.attrs.map((item: any) => {
        if (item.id == res.data.id) {
          return res.data;
        }
        return item;
      });
    }
    return res.success;
  }

  async deleteAttr(id: string): Promise<boolean> {
    const res = await kernel.deleteAttribute({
      id: id,
      typeName: '',
    });
    if (this.attrs && res.success) {
      this.attrs = this.attrs.filter((item: any) => item.id != id);
    }
    return res.success;
  }

  async createOperation(
    data: Omit<OperationModel, 'id' | 'speciesId' | 'speciesCode'>,
  ): Promise<model.ResultType<schema.XOperation>> {
    return await kernel.createOperation({
      id: undefined,
      speciesId: this.id,
      ...data,
    });
  }

  async updateOperation(data: OperationModel): Promise<boolean> {
    const res = await kernel.updateOperation({
      ...data,
      speciesId: data.speciesId || this.target.id,
    });
    return res.success;
  }

  async deleteOperation(id: string): Promise<boolean> {
    const res = await kernel.deleteOperation({
      id: id,
      typeName: '',
    });
    return res.success;
  }

  async publishWork(data: model.CreateDefineReq): Promise<schema.XFlowDefine> {
    return (await kernel.publishDefine({ ...data, speciesId: this.id })).data;
  }

  async deleteWork(id: string): Promise<boolean> {
    return (await kernel.deleteDefine({ id })).success;
  }
}
