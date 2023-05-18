import { XWorkDefine } from '@/ts/base/schema';
import { kernel, model, schema } from '../../../base';
import { PageAll } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { ISpeciesItem, SpeciesItem } from './species';
import { ShareIcon } from '@/ts/base/model';
import { IForm } from './form';
import { IApplication } from '../app/application';
import { ITarget } from '../../target/base/target';
import { Entity, IEntity } from '../../public';

export interface IWorkDefine extends IEntity<schema.XWorkDefine> {
  /** 办事分类 */
  workItem: IWork;
  /** 共享信息 */
  share: ShareIcon;
  /** 更新办事定义 */
  updateDefine(req: model.WorkDefineModel): Promise<boolean>;
  /** 加载事项定义节点 */
  loadWorkNode(): Promise<model.WorkNodeModel | undefined>;
  /** 删除办事定义 */
  deleteDefine(): Promise<boolean>;
  /** 删除办事实例 */
  deleteInstance(id: string): Promise<boolean>;
  /** 新建办事实例 */
  createWorkInstance(
    data: model.WorkInstanceModel,
  ): Promise<schema.XWorkInstance | undefined>;
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
  async createWorkInstance(
    data: model.WorkInstanceModel,
  ): Promise<schema.XWorkInstance | undefined> {
    let result = await kernel.createWorkInstance(data);
    if (result.success) {
      return result.data;
    }
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
  async deleteInstance(id: string): Promise<boolean> {
    return (await kernel.recallWorkInstance({ id, page: PageAll })).success;
  }
}

export interface IWork extends ISpeciesItem {
  /** 对应的应用 */
  app: IApplication;
  /** 流程定义 */
  defines: IWorkDefine[];
  /** 加载所有可选表单 */
  loadForms(): Promise<IForm[]>;
  /** 加载办事 */
  loadWorkDefines(reload?: boolean): Promise<IWorkDefine[]>;
  /** 新建办事 */
  createWorkDefine(data: model.WorkDefineModel): Promise<IWorkDefine | undefined>;
  /** 删除办事实例 */
  deleteInstance(id: string): Promise<boolean>;
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
  /** 删除办事实例 */
  async deleteInstance(id: string): Promise<boolean> {
    return (
      await kernel.recallWorkInstance({
        id,
        page: PageAll,
      })
    ).data;
  }
  abstract loadForms(): Promise<IForm[]>;
}
