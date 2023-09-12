import { common, model, schema } from '../../base';
import {
  directoryNew,
  directoryOperates,
  fileOperates,
  memberOperates,
  storeCollName,
  teamOperates,
} from '../public';
import { ITarget } from '../target/base/target';
import { Form, IForm } from './standard/form';
import { Transfer, ITransfer } from './standard/transfer';
import { SysFileInfo, ISysFileInfo, IFileInfo, FileInfo } from './fileinfo';
import { Species, ISpecies } from './standard/species';
import { Member } from './member';
import { Property, IProperty } from './standard/property';
import { Application, IApplication } from './standard/application';
import { BucketOpreates, FileItemModel } from '@/ts/base/model';
import { encodeKey } from '@/ts/base/common';
import { DataResource } from './resource';
import orgCtrl from '@/ts/controller';

/** 可为空的进度回调 */
export type OnProgress = (p: number) => void;

/** 目录接口类 */
export interface IDirectory extends IFileInfo<schema.XDirectory> {
  /** 当前加载目录的用户 */
  target: ITarget;
  /** 资源类 */
  resource: DataResource;
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
  create(data: schema.XDirectory): Promise<IDirectory | undefined>;
  /** 更新目录 */
  update(data: schema.XDirectory): Promise<boolean>;
  /** 删除目录 */
  delete(): Promise<boolean>;
  /** 目录下的文件 */
  files: ISysFileInfo[];
  /** 目录下的表单 */
  forms: IForm[];
  /** 目录下的分类 */
  specieses: ISpecies[];
  /** 目录下的属性 */
  propertys: IProperty[];
  /** 目录下的应用 */
  applications: IApplication[];
  /** 目录下的链接 */
  transfers: ITransfer[];
  /** 新建迁移配置 */
  createTransfer(data: model.Transfer): Promise<ITransfer | undefined>;
  /** 加载迁移配置 */
  loadAllTransfer(reload?: boolean): Promise<ITransfer[]>;
  /** 加载文件 */
  loadFiles(reload?: boolean): Promise<ISysFileInfo[]>;
  /** 上传文件 */
  createFile(file: Blob, p?: OnProgress): Promise<ISysFileInfo | undefined>;
  /** 新建表单 */
  createForm(data: schema.XForm): Promise<IForm | undefined>;
  /** 新建分类 */
  createSpecies(data: schema.XSpecies): Promise<ISpecies | undefined>;
  /** 新建属性 */
  createProperty(data: schema.XProperty): Promise<IProperty | undefined>;
  /** 新建应用 */
  createApplication(data: schema.XApplication): Promise<IApplication | undefined>;
  /** 加载全部应用 */
  loadAllApplication(reload?: boolean): Promise<IApplication[]>;
  /** 情况目录资源 */
  loadDirectoryResource(reload?: boolean): Promise<void>;
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
    if (!_parent) {
      this.resource.directoryColl.subscribe((res: { operate: string; data: any }) => {
        switch (res.operate ?? '') {
          case 'refresh':
            if (res.data && res.data.id == this.metadata.id) {
              this.loadContent(true).then(() => {
                orgCtrl.changCallback();
              });
            }
            break;
        }
      });
    }
  }
  target: ITarget;
  taskEmitter: common.Emitter;
  parent: IDirectory | undefined;
  children: IDirectory[] = [];
  taskList: model.TaskModel[] = [];
  forms: IForm[] = [];
  transfers: ITransfer[] = [];
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
  get resource(): DataResource {
    return this.target.resource;
  }
  content(mode: number = 0): IFileInfo<schema.XEntity>[] {
    const cnt: IFileInfo<schema.XEntity>[] = [...this.children];
    if (this.typeName === '成员目录') {
      cnt.push(...this.target.members.map((i) => new Member(i, this)));
    } else {
      cnt.push(...this.forms, ...this.applications, ...this.files, ...this.links, ...this.reports, ...this.transfers);
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
        await this.loadDirectoryResource(reload);
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
  async create(data: schema.XDirectory): Promise<IDirectory | undefined> {
    const res = await this.resource.directoryColl.insert({
      ...data,
      parentId: this.id,
    });
    if (res) {
      const directory = new Directory(res, this.target, this);
      this.children.push(directory);
      return directory;
    }
  }
  async update(data: schema.XDirectory): Promise<boolean> {
    const res = await this.resource.directoryColl.replace({ ...this.metadata, ...data });
    if (res) {
      this.setMetadata({ ...res, typeName: '目录' });
      return true;
    }
    return false;
  }
  async delete(): Promise<boolean> {
    if (this.parent) {
      for (const item of this.children) {
        await item.delete();
      }
      const res = await this.resource.directoryColl.delete(this.metadata);
      if (res) {
        await this.deleteDirectoryResource();
        this.parent.children = this.parent.children.filter((i) => i.key != this.key);
      }
      return res;
    }
    return false;
  }
  async loadFiles(reload: boolean = false): Promise<ISysFileInfo[]> {
    if (this.files.length < 1 || reload) {
      const res = await this.resource.bucketOpreate<FileItemModel[]>({
        key: encodeKey(this.id),
        operate: BucketOpreates.List,
      });
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
    const data = await this.resource.fileUpdate(file, `${this.id}/${file.name}`, (pn) => {
      task.finished = pn;
      p?.apply(this, [pn]);
      this.taskEmitter.changCallback();
    });
    if (data) {
      const file = new SysFileInfo(data, this);
      this.files.push(file);
      return file;
    }
  }
  async createForm(data: schema.XForm): Promise<IForm | undefined> {
    const res = await this.resource.formColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      const form = new Form(res, this);
      this.forms.push(form);
      return form;
    }
  }
  async createSpecies(data: schema.XSpecies): Promise<ISpecies | undefined> {
    const res = await this.resource.speciesColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      const species = new Species(res, this);
      this.specieses.push(species);
      return species;
    }
  }
  async createProperty(data: schema.XProperty): Promise<IProperty | undefined> {
    data.directoryId = this.id;
    const res = await this.resource.propertyColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      const property = new Property(res, this);
      this.propertys.push(property);
      return property;
    }
  }
  async createApplication(data: schema.XApplication): Promise<IApplication | undefined> {
    const res = await this.resource.applicationColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      const application = new Application(res, this);
      this.applications.push(application);
      return application;
    }
  }
  async loadAllApplication(reload: boolean = false): Promise<IApplication[]> {
    const applications: IApplication[] = [...this.applications];
    for (const subDirectory of this.children) {
      applications.push(...(await subDirectory.loadAllApplication(reload)));
    }
    return applications;
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
      const link = new Transfer(res, this);
      this.transfers.push(link);
      return link;
    }
  }
  async loadAllTransfer(reload: boolean = false): Promise<ITransfer[]> {
    const links: ITransfer[] = [...this.transfers];
    for (const subDirectory of this.children) {
      links.push(...(await subDirectory.loadAllTransfer(reload)));
    }
    return links;
  }
  override operates(mode: number = 0): model.OperateModel[] {
    const operates: model.OperateModel[] = [];
    if (this.typeName === '成员目录') {
      if (this.target.hasRelationAuth()) {
        if (this.target.user.copyFiles.size > 0) {
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
        if (this.target.user.copyFiles.size > 0) {
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
  public async loadDirectoryResource(reload: boolean = false) {
    if (this.id === this.target.id) {
      await this.resource.preLoad(reload);
    }
    this.transfers = this.resource.transferColl.cache
      .filter((i) => i.directoryId === this.id)
      .map((l) => new Transfer(l, this));
    this.forms = this.resource.formColl.cache
      .filter((i) => i.directoryId === this.id)
      .map((f) => new Form(f, this));
    this.specieses = this.resource.speciesColl.cache
      .filter((i) => i.directoryId === this.id)
      .map((s) => new Species(s, this));
    this.propertys = this.resource.propertyColl.cache
      .filter((i) => i.directoryId === this.id)
      .map((p) => new Property(p, this));
    var apps = this.resource.applicationColl.cache.filter(
      (i) => i.directoryId === this.id,
    );
    this.applications = apps
      .filter((a) => !a.parentId || a.parentId.length < 1)
      .map((a) => new Application(a, this, undefined, apps));
    this.children = this.resource.directoryColl.cache
      .filter((i) => i.parentId === this.id)
      .map((i) => {
        const subDir = new Directory(i, this.target, this);
        subDir.loadDirectoryResource(reload);
        return subDir;
      });
  }

  public async deleteDirectoryResource(): Promise<void> {
    await this.resource.formColl.deleteMany(this.forms.map((i) => i.metadata));
    await this.resource.speciesColl.deleteMany(this.specieses.map((i) => i.metadata));
    await this.resource.propertyColl.deleteMany(this.propertys.map((i) => i.metadata));
    await this.resource.applicationColl.deleteMany(
      this.applications.map((i) => i.metadata),
    );
    await this.resource.speciesItemColl.deleteMatch({
      speciesId: {
        _in_: this.specieses.map((i) => i.id),
      },
    });
    this.forms = [];
    this.specieses = [];
    this.propertys = [];
    this.applications = [];
  }
}
