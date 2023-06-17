import { common, kernel, model, schema } from '../../base';
import { PageAll, TargetType, directoryNew, directoryOperates } from '../public';
import { ITarget } from '../target/base/target';
import { Form, IForm } from './form';
import { SysFileInfo, ISysFileInfo, IFileInfo, FileInfo } from './fileinfo';
import { Species, ISpecies } from './species';
import { Member } from './member';
import { Property, IProperty } from './property';
import { Application, IApplication } from './application';
import { BucketOpreates, DirectoryModel } from '@/ts/base/model';
import { encodeKey } from '@/ts/base/common';
import { ICompany } from '../target/team/company';
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
  /** 加载目录里的内容 */
  loadContent(reload?: boolean): Promise<boolean>;
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
        typeName: '目录',
      },
      _parent ?? (_target as unknown as IDirectory),
    );
    this.target = _target;
    this.parent = _parent;
    this.taskEmitter = new common.Emitter();
    this.loadChildren(_directorys);
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
  private _contentLoaded: boolean = false;
  get id(): string {
    return super.id.replace('_', '');
  }
  content(mode: number = 0): IFileInfo<schema.XEntity>[] {
    const cnt: IFileInfo<schema.XEntity>[] = [
      ...this.children,
      ...this.forms,
      ...this.applications,
      ...this.files,
    ];
    if (mode != 1) {
      cnt.push(...this.propertys);
      cnt.push(...this.specieses);
      if (!this.parent) {
        cnt.push(...this.target.targets.filter((i) => i.id != this.target.id));
        if ('stations' in this.target) {
          cnt.push(...(this.target as ICompany).stations);
        }
        cnt.push(...this.target.members.map((i) => new Member(i, this)));
      }
    }
    return cnt.sort((a, b) => (a.metadata.updateTime < b.metadata.updateTime ? 1 : -1));
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    if (!this._contentLoaded || reload) {
      await this.loadSubDirectory();
      await this.loadFiles();
      await this.loadForms();
      await this.loadPropertys();
      await this.loadSpecieses();
      await this.loadApplications();
      this._contentLoaded = true;
    }
    return false;
  }
  async rename(name: string): Promise<boolean> {
    return await this.update({ ...this.metadata, name: name });
  }
  copy(destination: IDirectory): Promise<boolean> {
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
      const res = await kernel.anystore.bucketOpreate<model.FileItemModel[]>(
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
    const data = await kernel.anystore.fileUpdate(
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
    if (this.forms.length < 1 || reload) {
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
    if (this.specieses.length < 1 || reload) {
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
    if (this.specieses.length < 1 || reload) {
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
    if (this.applications.length < 1 || reload) {
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
  override operates(mode: number = 0): model.OperateModel[] {
    const operates: model.OperateModel[] = [
      directoryOperates.NewFile,
      directoryOperates.TaskList,
      directoryOperates.Refesh,
    ];
    if (mode === 2 && this.target.hasRelationAuth()) {
      operates.push(directoryNew);
    }
    if (this.parent) {
      operates.push(...super.operates(mode));
    } else if (mode % 2 === 0) {
      operates.push(...this.target.operates());
    } else {
      operates.push(...super.operates(1));
    }
    return operates.sort((a, b) => (a.menus ? -10 : b.menus ? 10 : 0));
  }
  private async loadSubDirectory() {
    if (!this.parent) {
      const res = await kernel.queryDirectorys({
        id: this.target.id,
        page: PageAll,
        upTeam: this.target.typeName === TargetType.Group,
      });
      if (res.success && res.data) {
        this.children = [];
        this.loadChildren(res.data.result);
      }
    }
  }
  private loadChildren(directorys?: schema.XDirectory[]) {
    if (directorys && directorys.length > 0) {
      directorys
        .filter((i) => i.parentId === this.id)
        .forEach((i) => {
          this.children.push(new Directory(i, this.target, this, directorys));
        });
    }
  }
}
