import { model, schema } from '../../../../base';
import { ITarget } from '../../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../../base/species';
import { IAppModule } from '../appmodule';
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
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: IAppModule) {
    super(_metadata, _current);
    this.speciesTypes = [];
  }
  defines: schema.XWorkDefine[] = [];
  async loadWorkDefines(reload?: boolean | undefined): Promise<schema.XWorkDefine[]> {
    throw new Error('Method not implemented.');
  }
  async createWorkDefine(
    data: model.WorkDefineModel,
  ): Promise<schema.XWorkDefine | undefined> {
    throw new Error('Method not implemented.');
  }
  async updateWorkDefine(data: model.WorkDefineModel): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async deleteWorkDefine(data: schema.XWorkDefine): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
