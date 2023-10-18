import { model, schema } from '../../../base';
import { IDirectory } from '../directory';
import { IStandard } from '../fileinfo';
import { DataResource } from '../resource';
import { Form, IForm } from './form';
import { IPageTemplate, PageTemplate } from './page';
import { IProperty, Property } from './property';
import { ISpecies, Species } from './species';
import { ITransfer, Transfer } from './transfer';

export class StandardFiles {
  directory: IDirectory;
  /** 表单 */
  forms: IForm[] = [];
  /** 迁移配置 */
  transfers: ITransfer[] = [];
  /** 属性 */
  propertys: IProperty[] = [];
  /** 分类字典 */
  specieses: ISpecies[] = [];
  /** 页面模板 */
  templates: IPageTemplate[] = [];
  formLoaded: boolean = false;
  transfersLoaded: boolean = false;
  speciesesLoaded: boolean = false;
  propertysLoaded: boolean = false;
  templatesLoaded: boolean = false;
  constructor(_directory: IDirectory) {
    this.directory = _directory;
  }
  get id(): string {
    return this.directory.id;
  }
  get resource(): DataResource {
    return this.directory.resource;
  }
  get standardFiles(): IStandard[] {
    return [
      ...this.forms,
      ...this.transfers,
      ...this.propertys,
      ...this.specieses,
      ...this.templates,
    ];
  }
  async loadStandardFiles(reload: boolean = false): Promise<IStandard[]> {
    await Promise.all([
      this.loadForms(reload),
      this.loadTransfers(reload),
      this.loadPropertys(reload),
      this.loadSpecieses(reload),
      this.loadTemplates(reload),
    ]);
    return this.standardFiles;
  }
  async loadForms(reload: boolean = false): Promise<IForm[]> {
    if (this.formLoaded === false || reload) {
      this.formLoaded = true;
      const data = await this.resource.formColl.load({
        options: { match: { directoryId: this.id } },
      });
      this.forms = data.map((i) => new Form(i, this.directory));
    }
    return this.forms;
  }
  async loadPropertys(reload: boolean = false): Promise<IProperty[]> {
    if (this.propertysLoaded === false || reload) {
      this.propertysLoaded = true;
      const data = await this.resource.propertyColl.load({
        options: { match: { directoryId: this.id } },
      });
      this.propertys = data.map((i) => new Property(i, this.directory));
    }
    return this.propertys;
  }
  async loadSpecieses(reload: boolean = false): Promise<ISpecies[]> {
    if (this.speciesesLoaded === false || reload) {
      this.speciesesLoaded = true;
      const data = await this.resource.speciesColl.load({
        options: { match: { directoryId: this.id } },
      });
      this.specieses = data.map((i) => new Species(i, this.directory));
    }
    return this.specieses;
  }
  async loadTransfers(reload: boolean = false): Promise<ITransfer[]> {
    if (this.transfersLoaded === false || reload) {
      this.transfersLoaded = true;
      const data = await this.resource.transferColl.load({
        options: { match: { directoryId: this.id } },
      });
      this.transfers = data.map((i) => new Transfer(i, this.directory));
    }
    return this.transfers;
  }
  async loadTemplates(reload: boolean = false): Promise<IPageTemplate[]> {
    if (this.templatesLoaded === false || reload) {
      this.templatesLoaded = true;
      const data = await this.resource.templateColl.load({
        options: { match: { directoryId: this.id } },
      });
      this.templates = data.map((i) => new PageTemplate(i, this.directory));
    }
    return this.templates;
  }
  async createForm(data: schema.XForm): Promise<schema.XForm | undefined> {
    const res = await this.resource.formColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      await this.resource.formColl.notity({ data: [res], operate: 'insert' });
      return res;
    }
  }
  async createSpecies(data: schema.XSpecies): Promise<schema.XSpecies | undefined> {
    const res = await this.resource.speciesColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      await this.resource.speciesColl.notity({ data: [res], operate: 'insert' });
      return res;
    }
  }
  async createProperty(data: schema.XProperty): Promise<schema.XProperty | undefined> {
    data.directoryId = this.id;
    const res = await this.resource.propertyColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      await this.resource.propertyColl.notity({ data: [res], operate: 'insert' });
      return res;
    }
  }
  async createTransfer(data: model.Transfer): Promise<ITransfer | undefined> {
    const res = await this.resource.transferColl.insert({
      ...data,
      envs: [],
      nodes: [],
      edges: [],
      directoryId: this.id,
    });
    if (res) {
      const link = new Transfer(res, this.directory);
      this.transfers.push(link);
      await this.resource.transferColl.notity({ data: [res], operate: 'insert' });
      return link;
    }
  }
  async createTemplate(data: schema.XPageTemplate): Promise<IPageTemplate | undefined> {
    const res = await this.resource.templateColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      const template = new PageTemplate(res, this.directory);
      this.templates.push(template);
      await this.resource.templateColl.notity({ data: [res], operate: 'insert' });
      return template;
    }
  }
  async operateStandradFile(
    to: DataResource,
    action: 'replaceMany' | 'removeMany',
    move?: boolean,
  ): Promise<void> {
    await this.loadStandardFiles();
    await to.formColl[action](this.forms.map((a) => a.metadata));
    await to.transferColl[action](this.transfers.map((a) => a.metadata));
    await to.speciesColl[action](this.specieses.map((a) => a.metadata));
    await to.propertyColl[action](this.propertys.map((a) => a.metadata));
    if (action == 'removeMany') {
      await to.speciesItemColl.removeMatch({
        speciesId: {
          _in_: this.specieses.map((a) => a.id),
        },
      });
    }
    if (
      !move &&
      action == 'replaceMany' &&
      to.targetMetadata.belongId != this.resource.targetMetadata.belongId
    ) {
      const items = await this.resource.speciesItemColl.loadSpace({
        options: {
          match: {
            speciesId: {
              _in_: this.specieses.map((a) => a.id),
            },
          },
        },
      });
      await to.speciesItemColl.replaceMany(items);
    }
  }
}
