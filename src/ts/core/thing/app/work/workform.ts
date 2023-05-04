import { model, schema } from '../../../../base';
import { ITarget } from '../../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../../base/species';
import { IAppModule } from '../appmodule';
export interface IWorkForm extends ISpeciesItem {
  /** 表单 */
  forms: schema.XForm[];
  /** 表单特性 */
  attributes: schema.XAttribute[];
  /** 加载表单 */
  loadForms(reload?: boolean): Promise<schema.XForm[]>;
  /** 新建表单 */
  createForm(data: model.FormModel): Promise<schema.XForm | undefined>;
  /** 更新表单 */
  updateForm(data: model.FormModel): Promise<boolean>;
  /** 删除表单 */
  deleteForm(data: schema.XForm): Promise<boolean>;
  /** 加载表单特性 */
  loadAttributes(reload?: boolean): Promise<schema.XAttribute[]>;
  /** 新建表单特性 */
  createAttribute(data: model.AttributeModel): Promise<schema.XAttribute | undefined>;
  /** 更新表单特性 */
  updateAttribute(data: model.AttributeModel): Promise<boolean>;
  /** 删除表单特性 */
  deleteAttribute(data: schema.XAttribute): Promise<boolean>;
}

export class WorkForm extends SpeciesItem implements IWorkForm {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: IAppModule) {
    super(_metadata, _current);
    this.speciesTypes = [];
  }
  forms: schema.XForm[] = [];
  attributes: schema.XAttribute[] = [];
  async loadForms(reload?: boolean | undefined): Promise<schema.XForm[]> {
    throw new Error('Method not implemented.');
  }
  async createForm(data: model.FormModel): Promise<schema.XForm | undefined> {
    throw new Error('Method not implemented.');
  }
  async updateForm(data: model.FormModel): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async deleteForm(data: schema.XForm): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async loadAttributes(reload: boolean = false): Promise<schema.XAttribute[]> {
    throw new Error('Method not implemented.');
  }
  async createAttribute(
    data: model.AttributeModel,
  ): Promise<schema.XAttribute | undefined> {
    throw new Error('Method not implemented.');
  }
  async updateAttribute(data: model.AttributeModel): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async deleteAttribute(data: schema.XAttribute): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
