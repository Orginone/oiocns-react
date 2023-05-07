import { kernel, model, schema } from '../../../base';
import { PageAll } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from './species';

export interface IWork extends ISpeciesItem {
  /** 流程定义 */
  defines: schema.XWorkDefine[];
  /** 加载办事 */
  loadWorkDefines(reload?: boolean): Promise<schema.XWorkDefine[]>;
  /** 加载办事节点 */
  loadWorkNode(id: string): Promise<model.WorkNodeModel>;
  /** 新建办事 */
  createWorkDefine(data: model.WorkDefineModel): Promise<schema.XWorkDefine | undefined>;
  /** 新建办事实例 */
  createWorkInstance(
    data: model.WorkInstanceModel,
  ): Promise<schema.XWorkInstance | undefined>;
  /** 更新办事 */
  updateWorkDefine(data: model.WorkDefineModel): Promise<boolean>;
  /** 删除办事 */
  deleteWorkDefine(data: schema.XWorkDefine): Promise<boolean>;
}

export class Work extends SpeciesItem implements IWork {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: ISpeciesItem) {
    super(_metadata, _current, _parent);
  }
  defines: schema.XWorkDefine[] = [];
  private _defineLoaded: boolean = false;
  async loadWorkDefines(reload: boolean = false): Promise<schema.XWorkDefine[]> {
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
        this.defines = res.data.result || [];
      }
    }
    return this.defines;
  }
  async loadWorkNode(id: string): Promise<model.WorkNodeModel> {
    return (
      await kernel.queryWorkNodes({
        id,
        page: PageAll,
      })
    ).data;
  }
  async createWorkDefine(
    data: model.WorkDefineModel,
  ): Promise<schema.XWorkDefine | undefined> {
    data.shareId = this.current.metadata.id;
    data.speciesId = this.metadata.id;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      this.defines.push(res.data);
      return res.data;
    }
  }
  async createWorkInstance(
    data: model.WorkInstanceModel,
  ): Promise<schema.XWorkInstance | undefined> {
    return (await kernel.createWorkInstance(data)).data;
  }
  async updateWorkDefine(data: model.WorkDefineModel): Promise<boolean> {
    const index = this.defines.findIndex((i) => i.id === data.id);
    if (index > -1) {
      data.shareId = this.current.metadata.id;
      data.speciesId = this.metadata.id;
      const res = await kernel.createWorkDefine(data);
      if (res.success && res.data.id) {
        this.defines[index] = res.data;
      }
      return res.success;
    }
    return false;
  }
  async deleteWorkDefine(data: schema.XWorkDefine): Promise<boolean> {
    const index = this.defines.findIndex((i) => i.id === data.id);
    if (index > -1) {
      const res = await kernel.deleteWorkDefine({
        id: data.id,
        page: PageAll,
      });
      if (res.success) {
        this.defines.splice(index, 1);
      }
      return res.success;
    }
    return false;
  }
}
