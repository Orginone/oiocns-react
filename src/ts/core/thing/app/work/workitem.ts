import { kernel, schema } from '../../../../base';
import { ITarget } from '../../../target/base/target';
import { IAppModule } from '../appmodule';
import { IWork, Work } from '../../base/work';
import { PageAll } from '@/ts/core/public/consts';
import { IForm } from '../../base/form';
export interface IWorkItem extends IWork {
  /** 对应的模块/应用 */
  appModule: IAppModule;
  /** 删除办事实例 */
  deleteInstance(id: string): Promise<boolean>;
}

export class WorkItem extends Work implements IWorkItem {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent: IAppModule) {
    super(_metadata, _current, _parent);
    this.speciesTypes = [];
    this.appModule = _parent;
  }
  appModule: IAppModule;
  async loadForms(): Promise<IForm[]> {
    return await this.appModule.loadForms();
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
}
