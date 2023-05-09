import { XWorkDefine, XWorkInstanceArray } from '@/ts/base/schema';
import { kernel, model, schema } from '../../../base';
import { PageAll } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from './species';

export interface IFlowDefine {
  /** 办事分类 */
  workItem: IWork;
  /** 数据 */
  metadata: XWorkDefine;
  /** 更新办事定义 */
  updateDefine(req: model.WorkDefineModel): Promise<boolean>;
  /** 加载事项定义节点 */
  loadWorkNode(): Promise<model.WorkNodeModel | undefined>;
  /** 加载办事实例 */
  loadInstance(page: model.PageModel): Promise<schema.XWorkInstanceArray>;
  /** 删除办事定义 */
  deleteDefine(): Promise<boolean>;
  /** 删除办事实例 */
  deleteInstance(id: string): Promise<boolean>;
  /** 新建办事实例 */
  createWorkInstance(
    data: model.WorkInstanceModel,
  ): Promise<schema.XWorkInstance | undefined>;
}

export class FlowDefine implements IFlowDefine {
  workItem: IWork;
  metadata: XWorkDefine;
  constructor(define: XWorkDefine, work: IWork) {
    this.workItem = work;
    this.metadata = define;
  }
  async createWorkInstance(
    data: model.WorkInstanceModel,
  ): Promise<schema.XWorkInstance | undefined> {
    return (await kernel.createWorkInstance(data)).data;
  }
  async deleteDefine(): Promise<boolean> {
    const res = await kernel.deleteWorkDefine({
      id: this.metadata.id,
      page: PageAll,
    });
    if (res.success) {
      this.workItem.defines = this.workItem.defines.filter(
        (a) => a.metadata.id != this.metadata.id,
      );
    }
    return res.success;
  }
  async updateDefine(data: model.WorkDefineModel): Promise<boolean> {
    data.shareId = this.workItem.current.metadata.id;
    data.speciesId = this.metadata.id;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      this.metadata = res.data;
    }
    return res.success;
  }
  async loadWorkNode(): Promise<model.WorkNodeModel | undefined> {
    const res = await kernel.queryWorkNodes({ id: this.metadata.id, page: PageAll });
    if (res.success) {
      return res.data;
    }
  }
  async loadInstance(page: model.PageModel): Promise<XWorkInstanceArray> {
    return (
      await kernel.queryWorkApply({
        defineId: this.metadata.id,
        shareId: this.workItem.current.metadata.id,
        page,
      })
    ).data;
  }
  async deleteInstance(id: string): Promise<boolean> {
    return (await kernel.recallWorkInstance({ id, page: PageAll })).success;
  }
}

export interface IWork extends ISpeciesItem {
  /** 流程定义 */
  defines: IFlowDefine[];
  /** 加载所有可选表单 */
  loadForms(): Promise<schema.XForm[]>;
  /** 表单特性 */
  loadAttributes(): Promise<schema.XAttribute[]>;
  /** 加载办事 */
  loadWorkDefines(reload?: boolean): Promise<IFlowDefine[]>;
  /** 新建办事 */
  createWorkDefine(data: model.WorkDefineModel): Promise<IFlowDefine | undefined>;
}

export abstract class Work extends SpeciesItem implements IWork {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: ISpeciesItem) {
    super(_metadata, _current, _parent);
  }
  defines: IFlowDefine[] = [];
  private _defineLoaded: boolean = false;
  async loadWorkDefines(reload: boolean = false): Promise<IFlowDefine[]> {
    if (!this._defineLoaded || reload) {
      const res = await kernel.queryWorkDefine({
        id: this.current.metadata.id,
        speciesId: this.metadata.id,
        belongId: this.current.space.metadata.id,
        upTeam: this.current.metadata.typeName === TargetType.Group,
        upSpecies: true,
        page: PageAll,
      });
      if (res.success) {
        this._defineLoaded = true;
        this.defines = (res.data.result || []).map((a) => new FlowDefine(a, this));
      }
    }
    return this.defines;
  }
  async createWorkDefine(data: model.WorkDefineModel): Promise<IFlowDefine | undefined> {
    data.shareId = this.current.metadata.id;
    data.speciesId = this.metadata.id;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      let define = new FlowDefine(res.data, this);
      this.defines.push(define);
      return define;
    }
  }
  abstract loadForms(): Promise<schema.XForm[]>;
  abstract loadAttributes(): Promise<schema.XAttribute[]>;
}
