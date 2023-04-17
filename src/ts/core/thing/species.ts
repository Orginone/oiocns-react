import {
  XAttribute,
  XAttributeArray,
  XFlowDefine,
  XFlowInstance,
} from '@/ts/base/schema';
import { kernel, model, parseAvatar, schema } from '../../base';
import {
  AttributeModel,
  CreateDefineReq,
  OperationModel,
  PageRequest,
  SpeciesModel,
  TargetShare,
} from '../../base/model';
import { INullSpeciesItem, ISpeciesItem } from './ispecies';
import { FlowDefine } from './flowDefine';
import { IFlowDefine } from './iflowDefine';
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
  belongInfo: TargetShare;
  curSpaceId: string;
  attrs?: XAttribute[];
  defines?: IFlowDefine[];
  // instances?: XFlowInstance[];

  constructor(target: schema.XSpecies, parent: INullSpeciesItem, curSpaceId: string) {
    this.children = [];
    this.target = target;
    this.parent = parent;
    this.id = target.id;
    this.name = target.name;
    this.isRoot = parent === undefined;
    this.curSpaceId = curSpaceId;
    if (target.nodes && target.nodes.length > 0) {
      for (const item of target.nodes) {
        this.children.push(new SpeciesItem(item, this, curSpaceId));
      }
    }
    this.belongInfo = { name: '奥集能平台', typeName: '平台' };
  }
  async loadAttrs(reload: boolean = false): Promise<XAttribute[]> {
    if (this.attrs == undefined || this.attrs.length == 0 || reload) {
      const res = await kernel.querySpeciesAttrs({
        id: this.id,
        spaceId: this.curSpaceId,
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

  async loadFlowDefines(reload: boolean = false): Promise<IFlowDefine[]> {
    if (this.defines == undefined || this.defines.length == 0 || reload) {
      const res = await kernel.queryDefine({
        speciesId: this.target.id,
        spaceId: this.curSpaceId,
      });
      this.defines =
        res.data.result?.map((item: XFlowDefine) => {
          return new FlowDefine(item, this.curSpaceId);
        }) || [];
    }
    return this.defines;
  }

  async loadFlowInstances(status: number[], page: PageRequest): Promise<XFlowInstance[]> {
    let res = await kernel.queryInstanceByApply({
      speciesId: this.id,
      spaceId: this.curSpaceId,
      status,
      page,
    });
    return res.data.result || [];
  }

  async loadInfo(info: TargetShare): Promise<ISpeciesItem> {
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

  async create(data: Omit<SpeciesModel, 'id' | 'parentId'>): Promise<INullSpeciesItem> {
    const res = await kernel.createSpecies({
      parentId: this.id,
      ...data,
      id: undefined,
    });
    if (res.success) {
      const newItem = new SpeciesItem(res.data, this, this.curSpaceId);
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

  async createFlowDefine(
    data: Omit<CreateDefineReq, 'id' | 'speciesId'>,
  ): Promise<XFlowDefine> {
    const res = await kernel.publishDefine({ ...data, speciesId: this.id });
    if (res.success) {
      const newItem = new FlowDefine(res.data, this.curSpaceId);
      if (this.defines) {
        this.defines.push(newItem);
      }
    }
    return res.data;
  }

  //错误返回
  async updateFlowDefine(data: CreateDefineReq): Promise<boolean> {
    const res = await kernel.publishDefine({
      ...data,
    });
    if (res.success && this.defines) {
      this.defines = this.defines.map((item: any) => {
        if (item.id == res.data.id) {
          return new FlowDefine(res.data, this.curSpaceId);
        }
        return item;
      });
    }
    return res.success;
  }

  async deleteFlowDefine(id: string): Promise<boolean> {
    const res = await kernel.deleteDefine({ id });
    if (this.defines && res.success) {
      this.defines = this.defines.filter((item: any) => item.id != id);
    }
    return res.success;
  }
}
