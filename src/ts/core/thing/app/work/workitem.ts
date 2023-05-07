import { schema } from '../../../../base';
import { ITarget } from '../../../target/base/target';
import { IAppModule } from '../appmodule';
import { IWork, Work } from '../../base/work';
export interface IWorkItem extends IWork {
  appModule: IAppModule;
}

export class WorkItem extends Work implements IWorkItem {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent: IAppModule) {
    super(_metadata, _current, _parent);
    this.speciesTypes = [];
    this.appModule = _parent;
  }
  appModule: IAppModule;
  async loadForms(): Promise<schema.XForm[]> {
    return await this.appModule.loadForms();
  }
  async loadAttributes(): Promise<schema.XAttribute[]> {
    return await this.appModule.loadAttributes();
  }
}
