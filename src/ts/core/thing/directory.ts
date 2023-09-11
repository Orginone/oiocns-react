import { common, kernel, model, schema } from '../../base';
import {
  PageAll,
  TargetType,
  directoryNew,
  directoryOperates,
  fileOperates,
  memberOperates,
  storeCollName,
  teamOperates,
} from '../public';
import { ITarget } from '../target/base/target';
import { FileInfo, IFileInfo, ISysFileInfo, SysFileInfo } from './fileinfo';
import { Form, IForm } from './form';
import { IReport, Report } from './report';
import { encodeKey } from '@/ts/base/common';
import { BucketOpreates, DirectoryModel } from '@/ts/base/model';
import { Application, IApplication } from './application';
import { Collection } from './collection';
import { ILink, Link } from './link';
import { Member } from './member';
import { IProperty, Property } from './property';
import { ISpecies, Species } from './species';
/** 可为空的进度回调 */
export type OnProgress = (p: number) => void;

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
  /** 目录下的链接 */
  links: ILink[];
  /** 新建链接配置 */
  createLink(data: model.Link): Promise<ILink | undefined>;
  /** 加载链接配置 */
  loadAllLink(reload?: boolean): Promise<ILink[]>;
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
  links: ILink[] = [];
  private _linkLoaded: boolean = false;
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
      cnt.push(...this.forms, ...this.applications, ...this.files, ...this.links, ...this.reports);
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
    await this.loadAllLink(reload);
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
  async createLink(data: model.Link): Promise<ILink | undefined> {
    data.id = 'snowId()';
    data.directoryId = this.id;
    data.envs = [];
    data.nodes = [];
    data.edges = [];
    const coll = new Collection<model.Link>(
      this.belongId,
      this.metadata.shareId,
      storeCollName.Links,
    );
    let res = await coll.insert(data);
    if (res) {
      let link = new Link(res, this);
      this.links.push(link);
      return link;
    }
  }
  async loadAllLink(reload: boolean = false): Promise<ILink[]> {
    if (!this._linkLoaded || reload) {
      const coll = new Collection<model.Link>(
        this.belongId,
        this.metadata.shareId,
        storeCollName.Links,
      );
      const res = await coll.load({ options: { match: { directoryId: this.id } } });
      if (res.length > 0) {
        this.links = res.map((item) => new Link(item, this));
      }
      this._linkLoaded = true;
    }
    return this.links;
  }
}
