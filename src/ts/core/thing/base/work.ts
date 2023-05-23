import { XWorkDefine } from '@/ts/base/schema';
import { kernel, model, schema } from '../../../base';
import { PageAll } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { ISpeciesItem, SpeciesItem } from './species';
import { IApplication } from '../app/application';
import { ITarget } from '../../target/base/target';
import { Entity, IEntity } from '../../public';

export interface IWorkDefine extends IEntity<schema.XWorkDefine> {
  /** 办事分类 */
  workItem: IWork;
  /** 更新办事定义 */
  updateDefine(req: model.WorkDefineModel): Promise<boolean>;
  /** 加载事项定义节点 */
  loadWorkNode(): Promise<model.WorkNodeModel | undefined>;
  /** 删除办事定义 */
  deleteDefine(): Promise<boolean>;
  /** 新建办事实例 */
  createWorkInstance(
    data: model.WorkInstanceModel,
  ): Promise<schema.XWorkInstance | undefined>;
  /** 删除办事实例 */
  deleteInstance(id: string): Promise<boolean>;
  /** 根据表单id查询表单特性 */
  loadAttributes(id: string): Promise<schema.XAttribute[]>;
  /** 根据字典id查询字典项 */
  loadItems(id: string): Promise<schema.XDictItem[]>;
}

export class FlowDefine extends Entity<schema.XWorkDefine> implements IWorkDefine {
  workItem: IWork;
  constructor(_metadata: XWorkDefine, work: IWork) {
    super({
      ..._metadata,
      typeName: '事项',
    });
    this.workItem = work;
  }
  async deleteDefine(): Promise<boolean> {
    const res = await kernel.deleteWorkDefine({
      id: this.id,
      page: PageAll,
    });
    if (res.success) {
      this.workItem.defines = this.workItem.defines.filter((a) => a.id != this.id);
    }
    return res.success;
  }
  async updateDefine(data: model.WorkDefineModel): Promise<boolean> {
    data.id = this.id;
    data.shareId = this.workItem.current.id;
    data.speciesId = this.metadata.speciesId;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      res.data.typeName = '事项';
      this.setMetadata(res.data);
    }
    return res.success;
  }
  async loadWorkNode(): Promise<model.WorkNodeModel | undefined> {
    const res = await kernel.queryWorkNodes({ id: this.id, page: PageAll });
    if (res.success) {
      return res.data;
    }
  }
  async createWorkInstance(
    data: model.WorkInstanceModel,
  ): Promise<schema.XWorkInstance | undefined> {
    let res = await kernel.createWorkInstance(data);
    if (res.success) {
      return res.data;
    }
  }
  async deleteInstance(id: string): Promise<boolean> {
    const res = await kernel.recallWorkInstance({ id, page: PageAll });
    return res.success;
  }
  async loadAttributes(id: string): Promise<schema.XAttribute[]> {
    const res = await kernel.queryFormAttributes({
      id: id,
      subId: this.workItem.belongId,
    });
    if (res.success) {
      return res.data.result || [];
    }
    return [];
  }
  async loadItems(id: string): Promise<schema.XDictItem[]> {
    const res = await kernel.queryDictItems({
      id: id,
      page: PageAll,
    });
    if (res.success) {
      return res.data.result || [];
    }
    return [];
  }
}

export interface IWork extends ISpeciesItem {
  /** 对应的应用 */
  app: IApplication;
  /** 流程定义 */
  defines: IWorkDefine[];
  /** 加载办事 */
  loadWorkDefines(reload?: boolean): Promise<IWorkDefine[]>;
  /** 新建办事 */
  createWorkDefine(data: model.WorkDefineModel): Promise<IWorkDefine | undefined>;
}

export abstract class Work extends SpeciesItem implements IWork {
  constructor(
    _metadata: schema.XSpecies,
    _current: ITarget,
    _app?: IApplication,
    _parent?: ISpeciesItem,
  ) {
    super(_metadata, _current, _parent);
    this.app = _app || this;
  }
  app: IApplication;
  defines: IWorkDefine[] = [];
  private _defineLoaded: boolean = false;
  async loadWorkDefines(reload: boolean = false): Promise<IWorkDefine[]> {
    if (!this._defineLoaded || reload) {
      const res = await kernel.queryWorkDefine({
        id: this.current.id,
        speciesId: this.id,
        belongId: this.belongId,
        upTeam: this.current.typeName === TargetType.Group,
        page: PageAll,
      });
      if (res.success) {
        this._defineLoaded = true;
        this.defines = (res.data.result || []).map((a) => new FlowDefine(a, this));
      }
    }
    return this.defines;
  }
  async createWorkDefine(data: model.WorkDefineModel): Promise<IWorkDefine | undefined> {
    data.shareId = this.current.id;
    data.speciesId = this.id;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      let define = new FlowDefine(res.data, this);
      this.defines.push(define);
      return define;
    }
  }
}
