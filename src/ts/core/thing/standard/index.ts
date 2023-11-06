import { model, schema } from '../../../base';
import { Directory, IDirectory } from '../directory';
import { IStandard } from '../fileinfo';
import { DataResource } from '../resource';
import { Application, IApplication } from './application';
import { Form, IForm } from './form';
import { IProperty, Property } from './property';
import { ISpecies, Species } from './species';
import { ITransfer, Transfer } from './transfer';
import { Repository, IRepository } from './repository';

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
  /** 代码仓库 */
  repository: IRepository[] = [];
  /** 表单加载完成标志 */
  formLoaded: boolean = false;
  /** 迁移配置加载完成标志 */
  transfersLoaded: boolean = false;
  /** 分类字典加载完成标志 */
  speciesesLoaded: boolean = false;
  /** 属性加载完成标志 */
  propertysLoaded: boolean = false;
  /** 代码仓库加载完成标志 */
  repositoryLoaded: boolean = false;
  constructor(_directory: IDirectory) {
    this.directory = _directory;
    if (this.directory.parent === undefined) {
      subscribeNotity(this.directory);
    }
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
      ...this.directorys,
      ...this.applications,
      ...this.repository,
    ];
  }
  async loadStandardFiles(reload: boolean = false): Promise<IStandard[]> {
    await Promise.all([
      this.loadForms(reload),
      this.loadTransfers(reload),
      this.loadPropertys(reload),
      this.loadSpecieses(reload),
      this.loadRepository(reload),
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
  async loadRepository(reload: boolean = false): Promise<IRepository[]> {
    if (this.repositoryLoaded === false || reload) {
      this.repositoryLoaded = true;
      const data = await this.resource.repositoryColl.load({
        options: { match: { directoryId: this.id } },
      });
      this.repository = data.map((i) => new Repository(i, this.directory));
    }
    return this.repository;
  }
  async loadApplications(_: boolean = false): Promise<IApplication[]> {
    var apps = this.resource.applicationColl.cache.filter(
      (i) => i.directoryId === this.directory.id,
    );
    this.applications = apps
      .filter((a) => !(a.parentId && a.parentId.length > 5))
      .map((a) => new Application(a, this.directory, undefined, apps));
    return this.applications;
  }
  async loadDirectorys(_: boolean = false): Promise<IDirectory[]> {
    var dirs = this.resource.directoryColl.cache.filter(
      (i) => i.directoryId === this.directory.id,
    );
    this.directorys = dirs.map(
      (a) => new Directory(a, this.directory.target, this.directory),
    );
    for (const dir of this.directorys) {
      await dir.loadDirectoryResource();
    }
    return this.directorys;
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
  async createRepository(data: any): Promise<IRepository | undefined> {
    let colldata = data;
    let res1 = await Repository.createRepo(data, this.directory.target);
    colldata.HTTPS = res1.data.data.HTTPS;
    colldata.SSH = res1.data.data.SSH;
    const res = await this.resource.repositoryColl.insert({
      ...colldata,
      directoryId: this.id,
    });
    if (res) {
      await this.resource.repositoryColl.notity({ data: res, operate: 'insert' });
      return res;
    }
  }
  async createTransfer(data: model.Transfer): Promise<ITransfer | undefined> {
    const result = await this.resource.transferColl.insert({
      ...data,
      envs: [],
      nodes: [],
      edges: [],
      directoryId: this.id,
    });
    if (result) {
      const link = new Transfer(result, this.directory);
      this.transfers.push(link);
      await this.resource.transferColl.notity({ data: result, operate: 'insert' });
      return link;
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
    await to.directoryColl[action](this.directorys.map((a) => a.metadata));
    await to.repositoryColl[action](this.repository.map((a) => a.metadata));

    if (action == 'replaceMany' && move) {
      var apps = this.resource.applicationColl.cache.filter(
        (i) => i.directoryId === this.id,
      );
      this.resource.applicationColl.removeCache((i) => i.directoryId === this.id);
      const data = await to.applicationColl.replaceMany(apps);
      to.applicationColl.cache.push(...data);
    }
    if (action == 'removeMany') {
      await to.applicationColl.removeMatch({
        directoryId: this.id,
      });
      to.applicationColl.removeCache((i) => i.directoryId != this.id);
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
  directory.resource.repositoryColl.subscribe([directory.key], (data) => {
    subscribeCallback<schema.XApplication>(directory, '代码仓库配置', data);
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
          directory.structCallback(true);
          return true;
        case 'refresh':
          directory.structCallback();
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
      directory.structCallback();
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
    case '代码仓库配置':
      directory.standard.repository = ArrayChanged(
        directory.standard.repository,
        operate,
        data,
        () => new Repository(data, directory),
      );
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
        directory.standard.applications = ArrayChanged(
          directory.standard.applications,
          operate,
          data,
          () => new Application(data, directory),
        );
        if (operate === 'insert') {
          directory.resource.applicationColl.cache.push(data);
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
