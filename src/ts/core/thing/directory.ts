import { common, kernel, model, schema } from '../../base';
import { Entity, IEntity, PageAll, TargetType } from '../public';
import { ITarget } from '../target/base/target';
import { Form, IForm } from './form';
import { SysFileInfo, ISysFileInfo } from './fileinfo';
import { Species, ISpecies } from './species';
import { Property, IProperty } from './property';
import { Application, IApplication } from './application';
import { BucketOpreates } from '@/ts/base/model';
/** 可为空的进度回调 */
export type OnProgress = (p: number) => void;

/** 目录接口类 */
export interface IDirectory extends IEntity<schema.XDirectory> {
  /** 当前加载目录的用户 */
  target: ITarget;
  /** 上级目录 */
  parent: IDirectory | undefined;
  /** 下级文件系统项数组 */
  children: IDirectory[];
  /** 是否为继承的类别 */
  isInherited: boolean;
  /** 上传任务列表 */
  taskList: model.TaskModel[];
  /** 任务发射器 */
  taskEmitter: common.Emitter;
  /** 加载目录里的内容 */
  loadContent(reload?: boolean): Promise<boolean>;
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
export class Directory extends Entity<schema.XDirectory> implements IDirectory {
  constructor(
    _metadata: schema.XTarget | schema.XDirectory,
    _target: ITarget,
    _parent?: IDirectory,
    _directorys?: schema.XDirectory[],
  ) {
    super({ ..._metadata, typeName: '目录' } as schema.XDirectory);
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
  get isInherited(): boolean {
    return this.metadata.belongId != this.target.belongId;
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    if (!this._contentLoaded || reload) {
      await this.loadSubDirectory();
      await this.loadForms();
      await this.loadPropertys();
      await this.loadSpecieses();
      await this.loadApplications();
    }
    return false;
  }
  async loadFiles(reload: boolean = false): Promise<ISysFileInfo[]> {
    if (this.files.length < 1 || reload) {
      const res = await kernel.anystore.bucketOpreate<model.FileItemModel[]>(
        this.metadata.belongId,
        {
          key: this.id,
          operate: BucketOpreates.List,
        },
      );
      if (res.success && res.data.length > 0) {
        this.files = res.data.map((item) => {
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
      (p) => {
        task.finished = p;
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
        .filter((i) => i.parentId === this.metadata.id)
        .forEach((i) => {
          this.children.push(new Directory(i, this.target, this, directorys));
        });
    }
  }
}
