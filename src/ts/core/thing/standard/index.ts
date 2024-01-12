import { model, schema } from '../../../base';
import { Directory, IDirectory } from '../directory';
import { IStandard } from '../fileinfo';
import { DataResource } from '../resource';
import { Application, IApplication } from './application';
import { Form, IForm } from './form';
import { IPageTemplate, PageTemplate } from './page';
import { IProperty, Property } from './property';
import { ISpecies, Species } from './species';
import { ITransfer, Transfer } from './transfer';

export class StandardFiles {
  /** 目录对象 */
  directory: IDirectory;
  /** 表单 */
  forms: IForm[] = [];
  /** 迁移配置 */
  transfers: ITransfer[] = [];
  /** 属性 */
  propertys: IProperty[] = [];
  /** 分类字典 */
  specieses: ISpecies[] = [];
  /** 目录 */
  directorys: IDirectory[] = [];
  /** 应用 */
  applications: IApplication[] = [];
  /** 目录下级应用实体 */
  xApplications: schema.XApplication[] = [];
  /** 页面模板 */
  templates: IPageTemplate[] = [];
  /** 表单加载完成标志 */
  formLoaded: boolean = false;
  /** 迁移配置加载完成标志 */
  transfersLoaded: boolean = false;
  /** 分类字典加载完成标志 */
  speciesesLoaded: boolean = false;
  /** 属性加载完成标志 */
  propertysLoaded: boolean = false;
  constructor(_directory: IDirectory) {
    this.directory = _directory;
    if (this.directory.parent === undefined) {
      subscribeNotity(this.directory);
    }
  }
  get id(): string {
    return this.directory.directoryId;
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
      ...this.directorys,
      ...this.applications,
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
      const data = await this.resource.formColl.loadSpace({
        options: { match: { directoryId: this.id } },
      });
      this.forms = data.map((i) => new Form(i, this.directory));
    }
    return this.forms;
  }
  async loadPropertys(reload: boolean = false): Promise<IProperty[]> {
    if (this.propertysLoaded === false || reload) {
      this.propertysLoaded = true;
      const data = await this.resource.propertyColl.loadSpace({
        options: { match: { directoryId: this.id } },
      });
      this.propertys = data.map((i) => new Property(i, this.directory));
    }
    return this.propertys;
  }
  async loadSpecieses(reload: boolean = false): Promise<ISpecies[]> {
    if (this.speciesesLoaded === false || reload) {
      this.speciesesLoaded = true;
      const data = await this.resource.speciesColl.loadSpace({
        options: { match: { directoryId: this.id } },
      });
      this.specieses = data.map((i) => new Species(i, this.directory));
    }
    return this.specieses;
  }
  async loadTransfers(reload: boolean = false): Promise<ITransfer[]> {
    if (this.transfersLoaded === false || reload) {
      this.transfersLoaded = true;
      const data = await this.resource.transferColl.loadSpace({
        options: { match: { directoryId: this.id } },
      });
      this.transfers = data.map((i) => new Transfer(i, this.directory));
    }
    return this.transfers;
  }
  async loadApplications(_: boolean = false): Promise<IApplication[]> {
    this.xApplications = this.resource.applicationColl.cache.filter(
      (i) => i.directoryId === this.id,
    );
    this.applications = this.xApplications
      .filter((a) => !(a.parentId && a.parentId.length > 5))
      .map((a) => new Application(a, this.directory, undefined, this.xApplications));
    return this.applications;
  }
  async loadDirectorys(_: boolean = false): Promise<IDirectory[]> {
    var dirs = this.resource.directoryColl.cache.filter((i) => i.directoryId === this.id);
    this.directorys = dirs.map(
      (a) => new Directory(a, this.directory.target, this.directory),
    );
    for (const dir of this.directorys) {
      await dir.loadDirectoryResource();
    }
    return this.directorys;
  }
  async loadTemplates(_: boolean = false): Promise<IPageTemplate[]> {
    let templates = this.resource.templateColl.cache.filter(
      (i) => i.directoryId === this.id,
    );
    this.templates = templates.map((i) => new PageTemplate(i, this.directory));
    return this.templates;
  }
  async createForm(data: schema.XForm): Promise<schema.XForm | undefined> {
    const result = await this.resource.formColl.insert({
      ...data,
      attributes: [],
      directoryId: this.id,
    });
    if (result) {
      await this.resource.formColl.notity({ data: result, operate: 'insert' });
      return result;
    }
  }
  async createSpecies(data: schema.XSpecies): Promise<schema.XSpecies | undefined> {
    const result = await this.resource.speciesColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (result) {
      await this.resource.speciesColl.notity({ data: result, operate: 'insert' });
      return result;
    }
  }
  async createProperty(data: schema.XProperty): Promise<schema.XProperty | undefined> {
    data.directoryId = this.id;
    const result = await this.resource.propertyColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (result) {
      await this.resource.propertyColl.notity({ data: result, operate: 'insert' });
      return result;
    }
  }
  async createTransfer(data: model.Transfer): Promise<model.Transfer | undefined> {
    const result = await this.resource.transferColl.insert({
      ...data,
      envs: [],
      nodes: [],
      edges: [],
      directoryId: this.id,
    });
    if (result) {
      await this.resource.transferColl.notity({ data: result, operate: 'insert' });
      return result;
    }
  }
  async createApplication(
    data: schema.XApplication,
  ): Promise<schema.XApplication | undefined> {
    const result = await this.resource.applicationColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (result) {
      await this.resource.applicationColl.notity({ data: result, operate: 'insert' });
      return result;
    }
  }
  async createTemplate(
    data: schema.XPageTemplate,
  ): Promise<schema.XPageTemplate | undefined> {
    const result = await this.resource.templateColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (result) {
      await this.resource.templateColl.notity({ data: result, operate: 'insert' });
      return result;
    }
  }
  async delete() {
    await this.resource.formColl.removeMany(this.forms.map((a) => a.metadata));
    await this.resource.transferColl.removeMany(this.transfers.map((a) => a.metadata));
    await this.resource.speciesColl.removeMany(this.specieses.map((a) => a.metadata));
    await this.resource.propertyColl.removeMany(this.propertys.map((a) => a.metadata));
    await this.resource.directoryColl.removeMany(this.directorys.map((a) => a.metadata));
    await this.resource.applicationColl.removeMatch({
      directoryId: this.id,
    });
    this.resource.applicationColl.removeCache((i) => i.directoryId != this.id);
    await this.resource.speciesItemColl.removeMatch({
      speciesId: {
        _in_: this.specieses.map((a) => a.id),
      },
    });
  }
  async moveStandradFile(resource: DataResource): Promise<void> {
    await this.loadStandardFiles();
    await resource.formColl.replaceMany(this.forms.map((a) => a.metadata));
    await resource.transferColl.replaceMany(this.transfers.map((a) => a.metadata));
    await resource.speciesColl.replaceMany(this.specieses.map((a) => a.metadata));
    await resource.propertyColl.replaceMany(this.propertys.map((a) => a.metadata));
  }
  async copyStandradFile(
    to: DataResource,
    directoryId: string,
    isSameBelong: boolean,
  ): Promise<void> {
    await this.loadStandardFiles();
    await to.formColl.replaceMany(
      this.forms.map((a) => {
        return { ...a.metadata, id: isSameBelong ? 'snowId()' : a.id, directoryId };
      }),
    );
    await to.transferColl.replaceMany(
      this.transfers.map((a) => {
        return { ...a.metadata, id: isSameBelong ? 'snowId()' : a.id, directoryId };
      }),
    );
    await to.speciesColl.replaceMany(
      this.specieses.map((a) => {
        return { ...a.metadata, id: isSameBelong ? 'snowId()' : a.id, directoryId };
      }),
    );
    await to.propertyColl.replaceMany(
      this.propertys.map((a) => {
        return { ...a.metadata, id: isSameBelong ? 'snowId()' : a.id, directoryId };
      }),
    );
    if (!isSameBelong) {
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
    // TODO 同归属拷贝
  }
  async operateStandradFile(to: DataResource): Promise<void> {
    await this.loadStandardFiles();
    await to.formColl.replaceMany(this.forms.map((a) => a.metadata));
    await to.transferColl.replaceMany(this.transfers.map((a) => a.metadata));
    await to.speciesColl.replaceMany(this.specieses.map((a) => a.metadata));
    await to.propertyColl.replaceMany(this.propertys.map((a) => a.metadata));
    await to.directoryColl.replaceMany(this.directorys.map((a) => a.metadata));
    var apps = this.resource.applicationColl.cache.filter(
      (i) => i.directoryId === this.id,
    );
    this.resource.applicationColl.removeCache((i) => i.directoryId === this.id);
    const data = await to.applicationColl.replaceMany(apps);
    to.applicationColl.cache.push(...data);
  }
}

/** 订阅标准文件变更通知 */
const subscribeNotity = (directory: IDirectory) => {
  directory.resource.formColl.subscribe([directory.key], (data) => {
    subscribeCallback<schema.XForm>(directory, '表单', data);
  });
  directory.resource.directoryColl.subscribe([directory.key], (data) => {
    subscribeCallback<schema.XDirectory>(directory, '目录', data);
  });
  directory.resource.propertyColl.subscribe([directory.key], (data) => {
    subscribeCallback<schema.XProperty>(directory, '属性', data);
  });
  directory.resource.speciesColl.subscribe([directory.key], (data) => {
    subscribeCallback<schema.XSpecies>(directory, '分类', data);
  });
  directory.resource.transferColl.subscribe([directory.key], (data) => {
    subscribeCallback<model.Transfer>(directory, '迁移', data);
  });
  directory.resource.applicationColl.subscribe([directory.key], (data) => {
    subscribeCallback<schema.XApplication>(directory, '应用', data);
  });
  directory.resource.templateColl.subscribe([directory.key], (data) => {
    subscribeCallback<schema.XPageTemplate>(directory, '模板', data);
  });
};

/** 订阅回调方法 */
function subscribeCallback<T extends schema.XStandard>(
  directory: IDirectory,
  typeName: string,
  data?: { operate?: string; data?: T },
): boolean {
  if (data && data.operate && data.data) {
    const entity = data.data;
    const operate = data.operate;
    if (directory.id === entity.directoryId) {
      switch (data.operate) {
        case 'insert':
        case 'remove':
          standardFilesChanged(directory, typeName, operate, entity);
          break;
        case 'reload':
          directory.loadContent(true).then(() => {
            directory.changCallback();
          });
          return true;
        case 'reloadFiles':
          directory.loadFiles(true).then(() => {
            directory.changCallback();
          });
          return true;
        default:
          directory.standard.standardFiles
            .find((i) => i.id === entity.id)
            ?.receive(operate, entity);
          if (entity.typeName === '模块' || entity.typeName === '办事') {
            directory.standard.applications.forEach((i) => i.receive(operate, entity));
          }
          break;
      }
      directory.changCallback();
      return true;
    }
    for (const subdir of directory.standard.directorys) {
      if (subscribeCallback(subdir, typeName, data)) {
        return true;
      }
    }
  }
  return false;
}

/** 目录中标准文件的变更 */
function standardFilesChanged(
  directory: IDirectory,
  typeName: string,
  operate: string,
  data: any,
): void {
  switch (typeName) {
    case '表单':
      directory.standard.forms = ArrayChanged(
        directory.standard.forms,
        operate,
        data,
        () => new Form(data, directory),
      );
      break;
    case '属性':
      directory.standard.propertys = ArrayChanged(
        directory.standard.propertys,
        operate,
        data,
        () => new Property(data, directory),
      );
      break;
    case '分类':
      directory.standard.specieses = ArrayChanged(
        directory.standard.specieses,
        operate,
        data,
        () => new Species(data, directory),
      );
      break;
    case '迁移':
      directory.standard.transfers = ArrayChanged(
        directory.standard.transfers,
        operate,
        data,
        () => new Transfer(data, directory),
      );
      break;
    case '模板':
      directory.standard.templates = ArrayChanged(
        directory.standard.templates,
        operate,
        data,
        () => new PageTemplate(data, directory),
      );
      if (operate === 'insert') {
        directory.resource.templateColl.cache.push(data);
      } else {
        directory.resource.templateColl.removeCache((i) => i.id != data.id);
      }
      break;
    case '目录':
      directory.standard.directorys = ArrayChanged(
        directory.standard.directorys,
        operate,
        data,
        () => new Directory(data, directory.target, directory),
      );
      if (operate === 'insert') {
        directory.resource.directoryColl.cache.push(data);
      } else {
        directory.resource.directoryColl.removeCache((i) => i.id != data.id);
      }
      break;
    case '应用':
      if (data.typeName === '模块') {
        directory.standard.applications.forEach((i) => i.receive(operate, data));
      } else {
        var modules: schema.XApplication[] = [];
        if ('children' in data && Array.isArray(data.children)) {
          modules = data.children as schema.XApplication[];
        }
        directory.standard.applications = ArrayChanged(
          directory.standard.applications,
          operate,
          data,
          () => new Application(data, directory, undefined, modules),
        );
        if (operate === 'insert') {
          directory.resource.applicationColl.cache.push(data, ...modules);
        } else {
          directory.resource.applicationColl.removeCache((i) => i.id != data.id);
        }
      }
      break;
  }
}

/** 数组元素操作 */
function ArrayChanged<T extends IStandard>(
  arr: T[],
  operate: string,
  data: schema.XStandard,
  create: () => T,
): T[] {
  if (operate === 'remove') {
    return arr.filter((i) => i.id != data.id);
  }
  if (operate === 'insert') {
    const index = arr.findIndex((i) => i.id === data.id);
    if (index > -1) {
      arr[index].setMetadata(data);
    } else {
      arr.push(create());
    }
  }
  return arr;
}
