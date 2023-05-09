import { XWorkDefine } from '@/ts/base/schema';
import { common, kernel, model, parseAvatar, schema } from '../../../base';
import { PageAll } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from './species';
import { ShareIcon } from '@/ts/base/model';

export interface IWorkDefine extends common.IEntity {
  /** 办事分类 */
  workItem: IWork;
  /** 数据 */
  metadata: XWorkDefine;
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

export class FlowDefine extends common.Entity implements IWorkDefine {
  workItem: IWork;
  metadata: XWorkDefine;
  constructor(define: XWorkDefine, work: IWork) {
    super();
    this.workItem = work;
    this.metadata = define;
    this.share = {
      name: this.metadata.name,
      typeName: '办事项',
      avatar: parseAvatar(this.metadata.icon),
    };
  }
  share: model.ShareIcon;
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
    data.speciesId = this.metadata.speciesId;
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
  async deleteInstance(id: string): Promise<boolean> {
    return (await kernel.recallWorkInstance({ id, page: PageAll })).success;
  }
}

export interface IWork extends ISpeciesItem {
  /** 流程定义 */
  defines: IWorkDefine[];
  /** 加载所有可选表单 */
  loadForms(): Promise<schema.XForm[]>;
  /** 表单特性 */
  loadAttributes(): Promise<schema.XAttribute[]>;
  /** 加载办事 */
  loadWorkDefines(reload?: boolean): Promise<IWorkDefine[]>;
  /** 新建办事 */
  createWorkDefine(data: model.WorkDefineModel): Promise<IWorkDefine | undefined>;
}

export abstract class Work extends SpeciesItem implements IWork {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: ISpeciesItem) {
    super(_metadata, _current, _parent);
  }
  defines: IWorkDefine[] = [];
  private _defineLoaded: boolean = false;
  async loadWorkDefines(reload: boolean = false): Promise<IWorkDefine[]> {
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
  async createWorkDefine(data: model.WorkDefineModel): Promise<IWorkDefine | undefined> {
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
