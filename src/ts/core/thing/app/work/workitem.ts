import { schema } from '../../../../base';
import { ITarget } from '../../../target/base/target';
import { IAppModule } from '../appmodule';
import { IWork, Work } from '../../base/work';
export interface IWorkItem extends IWork {}

export class WorkItem extends Work implements IWorkItem {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent: IAppModule) {
    super(_metadata, _current, _parent);
    this.speciesTypes = [];
  }
}
