import { schema } from '../../../../base';
import { ITarget } from '../../../target/base/target';
import { IForm, Form } from '../../base/form';
import { IAppModule } from '../appmodule';
export interface IWorkForm extends IForm {}

export class WorkForm extends Form implements IWorkForm {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent: IAppModule) {
    super(_metadata, _current, _parent);
    this.speciesTypes = [];
  }
}
