import { common, kernel, model, schema } from '../../base';
import {
  PageAll,
  TargetType,
  directoryNew,
  directoryOperates,
  transferNew,
  fileOperates,
  memberOperates,
  teamOperates,
} from '../public';
import { ITarget } from '../target/base/target';
import { Form, IForm } from './form';
import { Report, IReport } from './report';
import { SysFileInfo, ISysFileInfo, IFileInfo, FileInfo } from './fileinfo';

import { Species, ISpecies } from './species';
import { Member } from './member';
import { Property, IProperty } from './property';
import { Application, IApplication } from './application';
import { BucketOpreates, DirectoryModel } from '@/ts/base/model';
import { encodeKey, generateUuid } from '@/ts/base/common';
import {
  XEnvironment,
  XExecutable,
  XFileInfo,
  XLink,
  XMapping,
  XRequest,
} from '@/ts/base/schema';
import { formatDate } from '@/utils';
import {
  Request,
  Executable,
  Link,
  Unknown,
  Mapping,
  Environment,
} from '@/ts/core/thing/config';
/** 可为空的进度回调 */
export type OnProgress = (p: number) => void;

/** 配置集合名称 */
export enum ConfigColl {
  "Requests" = 'requests',
  "RequestLinks" = 'request-links',
  "Scripts" = 'scripts',
  "Mappings" = 'mappings',
  "Environments" = 'environments',
  "Stores" = 'stores',
  "Unknown" = 'unknown',
}

/** 目录接口类 */
export interface IDirectory extends IFileInfo<schema.XDirectory> {
  /** 当前加载目录的用户 */
  target: ITarget;
  /** 上级目录 */
  parent: IDirectory | undefined;
  /** 下级文件系统项数组 */
  children: IDirectory[];
  /** 上传任务列表 */
  taskList: model.TaskModel[];
  /** 任务发射器 */
  taskEmitter: common.Emitter;
  /** 目录下的内容 */
  content(mode?: number): IFileInfo<schema.XEntity>[];
  /** 创建子目录 */
  create(data: DirectoryModel): Promise<IDirectory | undefined>;
  /** 更新目录 */
  update(data: DirectoryModel): Promise<boolean>;
  /** 删除目录 */
  delete(): Promise<boolean>;
  /** 目录下的文件 */
  files: ISysFileInfo[];
  /** 加载文件 */
  loadFiles(reload?: boolean): Promise<ISysFileInfo[]>;
  /** 上传文件 */
  createFile(file: Blob, p?: OnProgress): Promise<ISysFileInfo | undefined>;
  /** 目录下的表单 */
  forms: IForm[];
  /** 加载表单 */
  loadForms(reload?: boolean): Promise<IForm[]>;
  /** 新建表单 */
  createForm(data: model.FormModel): Promise<IForm | undefined>;
  /** 目录下的分类 */
  specieses: ISpecies[];
  /** 加载分类 */
  loadSpecieses(reload?: boolean): Promise<ISpecies[]>;
  /** 新建分类 */
  createSpecies(data: model.SpeciesModel): Promise<ISpecies | undefined>;
  /** 目录下的属性 */
  propertys: IProperty[];
  /** 加载属性 */
  loadPropertys(reload?: boolean): Promise<IProperty[]>;
  /** 新建属性 */
  createProperty(data: model.PropertyModel): Promise<IProperty | undefined>;
  /** 目录下的应用 */
  applications: IApplication[];
  /** 加载应用 */
  loadApplications(reload?: boolean): Promise<IApplication[]>;
  /** 新建应用 */
  createApplication(data: model.ApplicationModel): Promise<IApplication | undefined>;
  /** 创建文件任务 */
  createTask(task: model.TaskModel): () => void;
  /** 目录下的报表 */
  reports: IReport[];
  /** 加载报表 */
  loadReports(reload?: boolean): Promise<IReport[]>;
  /** 新建报表 */
  createReport(data: model.FormModel): Promise<IReport | undefined>;
  /** 加载全部应用 */
  loadAllApplication(reload?: boolean): Promise<IApplication[]>;
  /** 加载目录树 */
  loadSubDirectory(): void;
  /** 目录下的所有配置项 */
  configs: IFileInfo<schema.XFileInfo>[];
  /** 新建请求配置 */
  createConfig(
    coll: string,
    data: schema.XFileInfo,
  ): Promise<IFileInfo<schema.XFileInfo> | undefined>;
  /** 加载请求配置 */
  loadConfigs(collName: string, reload?: boolean): Promise<IFileInfo<schema.XFileInfo>[]>;
}

/** 目录实现类 */
export class Directory extends FileInfo<schema.XDirectory> implements IDirectory {
  constructor(
    _metadata: schema.XDirectory,
    _target: ITarget,
    _parent?: IDirectory,
    _directorys?: schema.XDirectory[],
  ) {
    super(
      {
        ..._metadata,
        typeName: _metadata.typeName || '目录',
      },
      _parent ?? (_target as unknown as IDirectory),
    );
    this.target = _target;
    this.parent = _parent;
    this.taskEmitter = new common.Emitter();
  }
  target: ITarget;
  taskEmitter: common.Emitter;
  parent: IDirectory | undefined;
  children: IDirectory[] = [];
  taskList: model.TaskModel[] = [];
  forms: IForm[] = [];
  files: ISysFileInfo[] = [];
  specieses: ISpecies[] = [];
  propertys: IProperty[] = [];
  applications: IApplication[] = [];
  reports: IReport[] = [];
  configs: IFileInfo<XFileInfo>[] = [];
  private _contentLoaded: boolean = false;
  get id(): string {
    if (!this.parent) {
      return this.target.id;
    }
    return super.id;
  }
  get isInherited(): boolean {
    return this.metadata.belongId != this.target.space.id;
  }
  get locationKey(): string {
    return this.key;
  }
  content(mode: number = 0): IFileInfo<schema.XEntity>[] {
    const cnt: IFileInfo<schema.XEntity>[] = [...this.children];
    if (this.typeName === '成员目录') {
      cnt.push(...this.target.members.map((i) => new Member(i, this)));
    } else {
      cnt.push(...this.forms, ...this.applications, ...this.files, ...this.configs);
      if (mode != 1) {
        cnt.push(...this.propertys);
        cnt.push(...this.specieses);
        if (!this.parent) {
          cnt.unshift(this.target.memberDirectory);
          cnt.push(...this.target.targets.filter((i) => i.id != this.target.id));
        }
      }
    }
    return cnt.sort((a, b) => (a.metadata.updateTime < b.metadata.updateTime ? 1 : -1));
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadFiles(reload);
    if (reload) {
      if (this.typeName === '成员目录') {
        await this.target.loadContent(reload);
      } else {
        await Promise.all([
          await this.loadSubDirectory(),
          await this.loadForms(reload),
          await this.loadPropertys(reload),
          await this.loadSpecieses(reload),
          await this.loadApplications(reload),
          await this.loadReports(reload),
          ...Object.entries(ConfigColl).map((item) => {
            return this.loadConfigs(item[1], reload);
          }),
        ]);
      }
    }
    return false;
  }
  async rename(name: string): Promise<boolean> {
    return await this.update({ ...this.metadata, name: name });
  }
  copy(_destination: IDirectory): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  async move(destination: IDirectory): Promise<boolean> {
    if (
      this.parent &&
      destination.id != this.parent.id &&
      destination.metadata.belongId === this.directory.metadata.belongId
    ) {
      this.setMetadata({ ...this.metadata, parentId: destination.id });
      const success = await this.update(this.metadata);
      if (success) {
        this.directory.children = this.directory.children.filter(
          (i) => i.key != this.key,
        );
        this.parent = destination;
        this.directory = destination;
        destination.children.push(this);
      } else {
        this.setMetadata({ ...this.metadata, parentId: this.directory.id });
      }
      return success;
    }
    return false;
  }
  async create(data: DirectoryModel): Promise<IDirectory | undefined> {
    data.parentId = this.id;
    data.shareId = this.metadata.shareId;
    const res = await kernel.createDirectory(data);
    if (res.success && res.data.id) {
      const directory = new Directory(res.data, this.target, this);
      this.children.push(directory);
      return directory;
    }
  }
  async update(data: model.DirectoryModel): Promise<boolean> {
    data.id = this.id;
    data.parentId = this.metadata.parentId;
    data.shareId = this.metadata.shareId;
    const res = await kernel.updateDirectory(data);
    if (res.success && res.data.id) {
      this.setMetadata({ ...res.data, typeName: '目录' });
    }
    return res.success;
  }
  async delete(): Promise<boolean> {
    if (this.parent) {
      const res = await kernel.deleteDirectory({ id: this.id });
      if (res.success) {
        this.parent.children = this.parent.children.filter((i) => i.key != this.key);
      }
      return res.success;
    }
    return false;
  }
  async loadFiles(reload: boolean = false): Promise<ISysFileInfo[]> {
    if (this.files.length < 1 || reload) {
      const res = await kernel.bucketOpreate<model.FileItemModel[]>(
        this.metadata.belongId,
        {
          key: encodeKey(this.id),
          operate: BucketOpreates.List,
        },
      );
      if (res.success && res.data.length > 0) {
        this.files = res.data
          .filter((i) => !i.isDirectory)
          .map((item) => {
            return new SysFileInfo(item, this);
          });
      }
    }
    return this.files;
  }
  async createFile(file: Blob, p?: OnProgress): Promise<ISysFileInfo | undefined> {
    p?.apply(this, [0]);
    const task: model.TaskModel = {
      name: file.name,
      finished: 0,
      size: file.size,
      createTime: new Date(),
    };
    this.taskList.push(task);
    const data = await kernel.fileUpdate(
      this.metadata.belongId,
      file,
      `${this.id}/${file.name}`,
      (pn) => {
        task.finished = pn;
        p?.apply(this, [pn]);
        this.taskEmitter.changCallback();
      },
    );
    if (data) {
      const file = new SysFileInfo(data, this);
      this.files.push(file);
      return file;
    }
  }
  async loadForms(reload: boolean = false): Promise<IForm[]> {
    if (reload) {
      const res = await kernel.queryForms({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this.forms = (res.data.result || []).map((i) => new Form(i, this));
      }
    }
    return this.forms;
  }
  async createForm(data: model.FormModel): Promise<IForm | undefined> {
    data.directoryId = this.id;
    const res = await kernel.createForm(data);
    if (res.success && res.data.id) {
      const form = new Form(res.data, this);
      this.forms.push(form);
      return form;
    }
  }
  async loadSpecieses(reload: boolean = false): Promise<ISpecies[]> {
    if (reload) {
      const res = await kernel.querySpecies({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this.specieses = (res.data.result || []).map((i) => new Species(i, this));
      }
    }
    return this.specieses;
  }
  async createSpecies(data: model.SpeciesModel): Promise<ISpecies | undefined> {
    data.directoryId = this.id;
    const res = await kernel.createSpecies(data);
    if (res.success && res.data.id) {
      const species = new Species(res.data, this);
      this.specieses.push(species);
      return species;
    }
  }
  async loadPropertys(reload: boolean = false): Promise<IProperty[]> {
    if (reload) {
      const res = await kernel.queryPropertys({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this.propertys = (res.data.result || []).map((i) => new Property(i, this));
      }
    }
    return this.propertys;
  }
  async createProperty(data: model.PropertyModel): Promise<IProperty | undefined> {
    data.directoryId = this.id;
    const res = await kernel.createProperty(data);
    if (res.success && res.data.id) {
      const property = new Property(res.data, this);
      this.propertys.push(property);
      return property;
    }
  }
  async loadApplications(reload: boolean = false): Promise<IApplication[]> {
    if (reload) {
      const res = await kernel.queryApplications({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        const data = res.data.result || [];
        this.applications = data
          .filter((i) => !i.parentId || i.parentId.length < 1)
          .map((i) => new Application(i, this, undefined, data));
      }
    }
    return this.applications;
  }
  async createApplication(
    data: model.ApplicationModel,
  ): Promise<IApplication | undefined> {
    data.directoryId = this.id;
    const res = await kernel.createApplication(data);
    if (res.success && res.data.id) {
      const application = new Application(res.data, this);
      this.applications.push(application);
      return application;
    }
  }
  async loadAllApplication(reload: boolean = false): Promise<IApplication[]> {
    const applications: IApplication[] = [];
    applications.push(...(await this.loadApplications(reload)));
    for (const subDirectory of this.children) {
      applications.push(...(await subDirectory.loadAllApplication(reload)));
    }
    return applications;
  }
  override operates(mode: number = 0): model.OperateModel[] {
    const operates: model.OperateModel[] = [];
    if (this.typeName === '成员目录') {
      if (this.target.hasRelationAuth()) {
        if (this.target.space.user.copyFiles.size > 0) {
          operates.push(fileOperates.Parse);
        }
        operates.push(teamOperates.Pull, memberOperates.SettingIdentity);
        if ('superAuth' in this.target) {
          operates.unshift(memberOperates.SettingAuth);
          if ('stations' in this.target) {
            operates.unshift(memberOperates.SettingStation);
          }
        }
      }
    } else {
      operates.push(
        directoryOperates.NewFile,
        directoryOperates.TaskList,
        directoryOperates.Refesh,
        directoryOperates.OpenFolderWithEditor,
      );
      if (mode === 2 && this.target.hasRelationAuth()) {
        operates.push(directoryNew);
        operates.push(transferNew);
        if (this.target.space.user.copyFiles.size > 0) {
          operates.push(fileOperates.Parse);
        }
      }
      if (this.parent) {
        operates.push(...super.operates(mode));
      } else if (mode % 2 === 0) {
        operates.push(...this.target.operates());
      } else {
        operates.push(...super.operates(1));
      }
    }
    return operates;
  }
  public async loadSubDirectory() {
    if (!this.parent && this.children.length < 1) {
      const res = await kernel.queryDirectorys({
        id: this.target.id,
        page: PageAll,
        upTeam: this.target.typeName === TargetType.Group,
      });
      if (res.success && res.data) {
        this.children = [];
        if (res.data.result && res.data.result.length > 0) {
          const data = res.data.result.find((i) => i.id === this.id);
          if (data) {
            this.loadChildren(data, res.data.result);
          }
          for (let config of Object.entries(ConfigColl)) {
            await this.loadConfigs(config[1], true);
          }
        }
      }
    }
  }
  private loadChildren(data: schema.XDirectory, directorys: schema.XDirectory[]) {
    this.forms = (data.forms || []).map((f) => new Form(f, this));
    this.specieses = (data.species || []).map((s) => new Species(s, this));
    this.propertys = (data.propertys || []).map((p) => new Property(p, this));
    this.applications = (data.applications || [])
      .filter((a) => !a.parentId || a.parentId.length < 1)
      .map((a) => new Application(a, this, undefined, data.applications));
    directorys
      .filter((i) => i.parentId === data.id)
      .forEach((i) => {
        const subDirectory = new Directory(i, this.target, this, directorys);
        subDirectory.loadChildren(i, directorys);
        this.children.push(subDirectory);
      });
  }
  createTask(task: model.TaskModel): () => void {
    this.taskList.push(task);
    return () => this.taskEmitter.changCallback();
  }
  async loadReports(reload: boolean = false): Promise<IReport[]> {
    if (this.reports.length < 1 || reload) {
      const res = await kernel.queryForms({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this.reports = (res.data.result || []).map((i) => new Report(i, this));
      }
    }
    return this.reports;
  }
  async createReport(data: model.FormModel): Promise<IReport | undefined> {
    data.directoryId = this.id;
    const res = await kernel.createForm(data);
    if (res.success && res.data.id) {
      const report = new Report(res.data, this);
      this.reports.push(report);
      return report;
    }
  }
  defaultEntity(collName: string, data: XFileInfo) {
    const key = generateUuid();
    data.id = key;
    data.code = key;
    data.belongId = this.belongId;
    let current = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S');
    data.createTime = current;
    data.updateTime = current;
    data.collName = collName;
    data.directoryId = this.id;
  }
  async createConfig(
    collName: ConfigColl,
    data: schema.XFileInfo,
  ): Promise<IFileInfo<schema.XFileInfo> | undefined> {
    this.defaultEntity(collName, data);
    let res = await kernel.collectionInsert(this.belongId, collName, data);
    if (res.success) {
      let config = this.converting(data);
      this.configs.push(config);
      return config;
    }
  }
  async loadConfigs(
    collName: ConfigColl,
    reload?: boolean | undefined,
  ): Promise<IFileInfo<schema.XFileInfo>[]> {
    const configs = this.configs.filter((item) => item.metadata.collName == collName);
    if (collName != ConfigColl.Unknown && (configs.length < 1 || reload)) {
      const res = await kernel.collectionAggregate(this.belongId, collName, {
        match: {
          directoryId: this.id,
        },
        limit: 65536,
      });
      if (res.success && res.data.length > 0) {
        this.configs = this.configs.filter((item) => item.metadata.collName != collName);
        let configs = (res.data as []).map((item) => this.converting(item));
        this.configs.push(...configs);
      }
    }
    return configs;
  }
  converting(data: XFileInfo): IFileInfo<schema.XFileInfo> {
    const typeName = data.typeName;
    switch (typeName) {
      case '请求':
        return new Request(data as XRequest, this);
      case '链接':
        return new Link(data as XLink, this);
      case '脚本':
        return new Executable(data as XExecutable, this);
      case '映射':
        return new Mapping(data as XMapping, this);
      case '环境':
        return new Environment(data as XEnvironment, this);
      default:
        return new Unknown(ConfigColl.Unknown, data, this);
    }
  }
}
