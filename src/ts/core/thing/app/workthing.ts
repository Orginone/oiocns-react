import { TargetType } from '@/ts/core/public/enums';
import { kernel, model, schema } from '../../../base';
import { Form, IForm } from '../base/form';
import { ISpeciesItem, SpeciesItem } from '../base/species';
import { PageAll } from '@/ts/core/public/consts';
import { IApplication } from './application';
import { ITarget } from '../../target/base/target';
export interface IWorkThing extends ISpeciesItem {
  /** 对应的应用 */
  app: IApplication;
  /** 分类下的表单 */
  forms: IForm[];
  /** 加载表单 */
  loadForms(reload?: boolean): Promise<IForm[]>;
  /** 新建表单 */
  createForm(data: model.FormModel): Promise<IForm | undefined>;
  /** 加载所有的办事 */
  loadAllForms(reload?: boolean): Promise<IForm[]>;
}

export class WorkThing extends SpeciesItem implements IWorkThing {
  constructor(_metadata: schema.XSpecies, _app: IApplication, _parent?: IWorkThing) {
    super(_metadata, _app.current, _parent);
    this.app = _app;
    for (const item of _metadata.nodes || []) {
      this.children.push(new WorkThing(item, this.app, this));
    }
    this.speciesTypes = [_metadata.typeName];
  }
  app: IApplication;
  forms: IForm[] = [];
  private _formLoaded: boolean = false;
  async loadForms(reload: boolean = false): Promise<IForm[]> {
    if (!this._formLoaded || reload) {
      const res = await kernel.querySpeciesForms({
        id: this.current.id,
        speciesId: this.id,
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
    data.shareId = this.current.id;
    data.speciesId = this.id;
    const res = await kernel.createForm(data);
    if (res.success && res.data.id) {
      const form = new Form(res.data, this);
      this.forms.push(form);
      return form;
    }
  }
  async loadAllForms(): Promise<IForm[]> {
    const result = [...(await this.loadForms())];
    for (const item of this.children) {
      result.push(...(await (item as IWorkThing).loadAllForms()));
    }
    return result;
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    return new WorkThing(_metadata, this.app, this);
  }
}
