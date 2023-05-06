import { PageAll } from '@/ts/core/public/consts';
import { kernel, model, schema } from '../../../../base';
import { ITarget } from '../../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../../base/species';
import { IAppModule } from '../appmodule';
import { TargetType } from '@/ts/core/public/enums';
export interface IWorkItem extends ISpeciesItem {
  /** 流程定义 */
  defines: schema.XWorkDefine[];
  /** 加载表单 */
  loadWorkDefines(reload?: boolean): Promise<schema.XWorkDefine[]>;
  /** 新建表单 */
  createWorkDefine(data: model.WorkDefineModel): Promise<schema.XWorkDefine | undefined>;
  /** 更新表单 */
  updateWorkDefine(data: model.WorkDefineModel): Promise<boolean>;
  /** 删除表单 */
  deleteWorkDefine(data: schema.XWorkDefine): Promise<boolean>;
}

export class WorkItem extends SpeciesItem implements IWorkItem {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent: IAppModule) {
    super(_metadata, _current, _parent);
    this.speciesTypes = [];
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
