import { TargetType } from '@/ts/core/public/enums';
import { kernel, model, schema } from '../../../../base';
import { ITarget } from '../../../target/base/target';
import { Form, IForm } from '../../base/form';
import { ISpeciesItem, SpeciesItem } from '../../base/species';
import { PageAll } from '@/ts/core/public/consts';
export interface IWorkForm extends ISpeciesItem {
  /** 分类下的表单 */
  forms: IForm[];
  /** 加载表单 */
  loadForms(reload?: boolean): Promise<IForm[]>;
  /** 新建表单 */
  createForm(data: model.FormModel): Promise<IForm | undefined>;
}

export class WorkForm extends SpeciesItem implements IWorkForm {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent: ISpeciesItem) {
    super(_metadata, _current, _parent);
    this.speciesTypes = [];
  }
  forms: IForm[] = [];
  private _formLoaded: boolean = false;
  async loadForms(reload: boolean = false): Promise<IForm[]> {
    if (!this._formLoaded || reload) {
      const res = await kernel.querySpeciesForms({
        id: this.current.metadata.id,
        speciesId: this.metadata.id,
        belongId: this.belongId,
        upTeam: this.current.metadata.typeName === TargetType.Group,
        page: PageAll,
      });
      if (res.success) {
        this._formLoaded = true;
        this.forms = (res.data.result || []).map((i) => new Form(i, this));
      }
    }
    return this.forms;
  }
  async createForm(data: model.FormModel): Promise<IForm | undefined> {
    data.shareId = this.current.metadata.id;
    data.speciesId = this.metadata.id;
    const res = await kernel.createForm(data);
    if (res.success && res.data.id) {
      const form = new Form(res.data, this);
      this.forms.push(form);
      return form;
    }
  }
}
