import { common, model, schema } from '../../base';
import {
  directoryNew,
  directoryOperates,
  fileOperates,
  memberOperates,
  teamOperates,
} from '../public';
import { ITarget } from '../target/base/target';
import { Form, IForm } from './standard/form';
import { Link, ILink } from './standard/transfer';
import {
  SysFileInfo,
  ISysFileInfo,
  IFileInfo,
  StandardFileInfo,
  IStandardFileInfo,
} from './fileinfo';
import { Species, ISpecies } from './standard/species';
import { Member } from './member';
import { Property, IProperty } from './standard/property';
import { Application, IApplication } from './standard/application';
import { BucketOpreates, FileItemModel } from '@/ts/base/model';
import { encodeKey } from '@/ts/base/common';
import { DataResource } from './resource';
import { XCollection } from '../public/collection';
/** 可为空的进度回调 */
export type OnProgress = (p: number) => void;

/** 目录接口类 */
export interface IDirectory extends IStandardFileInfo<schema.XDirectory> {
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
  create(data: schema.XDirectory): Promise<schema.XDirectory | undefined>;
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
  links: ILink[];
  /** 新建链接配置 */
  createLink(data: model.Link): Promise<model.Link | undefined>;
  /** 加载链接配置 */
  loadAllLink(reload?: boolean): Promise<ILink[]>;
  /** 加载文件 */
  loadFiles(reload?: boolean): Promise<ISysFileInfo[]>;
  /** 上传文件 */
  createFile(file: Blob, p?: OnProgress): Promise<ISysFileInfo | undefined>;
  /** 新建表单 */
  createForm(data: schema.XForm): Promise<schema.XForm | undefined>;
  /** 新建分类 */
  createSpecies(data: schema.XSpecies): Promise<schema.XSpecies | undefined>;
  /** 新建属性 */
  createProperty(data: schema.XProperty): Promise<schema.XProperty | undefined>;
  /** 新建应用 */
  createApplication(data: schema.XApplication): Promise<schema.XApplication | undefined>;
  /** 加载全部应用 */
  loadAllApplication(reload?: boolean): Promise<IApplication[]>;
  /** 加载目录资源 */
  loadDirectoryResource(reload?: boolean): Promise<void>;
}

/** 目录实现类 */
export class Directory extends StandardFileInfo<schema.XDirectory> implements IDirectory {
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
      _target.resource.directoryColl,
    );
    this.target = _target;
    this.parent = _parent;
    this.taskEmitter = new common.Emitter();
    this.resource.formColl.subscribe((a) => this.receiveContent(a));
    this.resource.speciesColl.subscribe((a) => this.receiveContent(a));
    this.resource.transferColl.subscribe((a) => this.receiveContent(a));
    this.resource.propertyColl.subscribe((a) => this.receiveContent(a));
    this.resource.applicationColl.subscribe((a) => this.receiveContent(a));
  }
  target: ITarget;
  taskEmitter: common.Emitter;
  parent: IDirectory | undefined;
  children: IDirectory[] = [];
  taskList: model.TaskModel[] = [];
  forms: IForm[] = [];
  links: ILink[] = [];
  files: ISysFileInfo[] = [];
  specieses: ISpecies[] = [];
  propertys: IProperty[] = [];
  applications: IApplication[] = [];
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
  get isEmpty() {
    return (
      this.children.length == 0 &&
      this.forms.length == 0 &&
      this.propertys.length == 0 &&
      this.specieses.length == 0 &&
      this.applications.length == 0
    );
  }
  content(mode: number = 0): IFileInfo<schema.XEntity>[] {
    const cnt: IFileInfo<schema.XEntity>[] = [...this.children];
    if (this.typeName === '成员目录') {
      cnt.push(...this.target.members.map((i) => new Member(i, this)));
    } else {
      cnt.push(...this.forms, ...this.applications, ...this.files);
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
        await this.loadDirectoryResource();
      }
    }
    return false;
  }
  override copy(_destination: IDirectory): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  override async move(destination: IDirectory): Promise<boolean> {
    if (this.parent) {
      if (
        destination.id != this.directory.id &&
        destination.target.belongId == this.directory.target.belongId
      ) {
        const data = await destination.coll.replace({
          ...this.metadata,
          parentId: destination.id,
          directoryId: destination.id,
        });
        if (data) {
          if (this.isEmpty) {
            return (
              (await this.notify('delete', [this.metadata])) &&
              (await this.notify('insert', [data]))
            );
          } else {
            return this.notify('reflash', [data, destination.metadata]);
          }
        }
      }
      return false;
    }
    return false;
  }
  async create(data: schema.XDirectory): Promise<schema.XDirectory | undefined> {
    const res = await this.resource.directoryColl.insert({
      ...data,
      parentId: this.id,
    });
    if (res) {
      await this.notify('insert', [res]);
      return res;
    }
  }
  override async delete(): Promise<boolean> {
    if (this.parent) {
      const data: model.DirectoryContent = {
        forms: [],
        specieses: [],
        propertys: [],
        applications: [],
        directorys: [],
      };
      this.getXConent(this, data);
      await this.resource.formColl.deleteMany(data.forms);
      await this.resource.speciesColl.deleteMany(data.specieses);
      await this.resource.propertyColl.deleteMany(data.propertys);
      await this.resource.directoryColl.deleteMany([...data.directorys, this.metadata]);
      await this.resource.applicationColl.deleteMany(data.applications);
      if (this.isEmpty) {
        await this.notify('delete', [this.metadata]);
      } else {
        await this.notify('reflash', [this.metadata]);
      }
      return true;
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
  async createForm(data: schema.XForm): Promise<schema.XForm | undefined> {
    const res = await this.resource.formColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      await this.notityConetnt(this.resource.formColl, 'insert', [res]);
      return res;
    }
  }
  async createSpecies(data: schema.XSpecies): Promise<schema.XSpecies | undefined> {
    const res = await this.resource.speciesColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      await this.notityConetnt(this.resource.speciesColl, 'insert', [res]);
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
      await this.notityConetnt(this.resource.propertyColl, 'insert', [res]);
      return res;
    }
  }
  async createApplication(
    data: schema.XApplication,
  ): Promise<schema.XApplication | undefined> {
    const res = await this.resource.applicationColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      await this.notityConetnt(this.resource.applicationColl, 'insert', [res]);
      return res;
    }
  }
  async createLink(data: model.Link): Promise<model.Link | undefined> {
    const res = await this.resource.transferColl.insert({
      ...data,
      envs: [],
      nodes: [],
      edges: [],
      directoryId: this.id,
    });
    if (res) {
      await this.notityConetnt(this.resource.transferColl, 'insert', [res]);
      return res;
    }
  }
  async loadAllApplication(reload: boolean = false): Promise<IApplication[]> {
    const applications: IApplication[] = [...this.applications];
    for (const subDirectory of this.children) {
      applications.push(...(await subDirectory.loadAllApplication(reload)));
    }
    return applications;
  }
  async loadAllLink(reload: boolean = false): Promise<ILink[]> {
    const links: ILink[] = [...this.links];
    for (const subDirectory of this.children) {
      links.push(...(await subDirectory.loadAllLink(reload)));
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
  protected override receiveMessage(operate: string, data: schema.XDirectory): void {
    let id = this.metadata.id.replace('_', '');
    switch (operate) {
      case 'replace':
        if (data.id == id) {
          this.setMetadata(data);
          this.changCallback();
        }
      case 'delete':
        if (data.parentId == id) {
          this.coll.removeCache(data.id);
          this.children = this.children.filter((a) => a.metadata.id !== data.id);
          this.changCallback();
        }
        break;
      case 'insert':
        if (data.parentId == id) {
          this.resource.directoryColl.cache.push(data);
          this.children.push(new Directory(data, this.target, this));
          this.loadDirectoryResource(true).then(() => {
            this.changCallback();
          });
        }
        break;
      case 'reflash':
        if (data.id == id || data.parentId == id) {
          this.loadDirectoryResource(true).then(() => {
            this.changCallback();
          });
        }
      default:
        break;
    }
  }
  public async loadDirectoryResource(reflash: boolean = false) {
    if (this.id.replace('_', '') === this.target.id) {
      await this.resource.preLoad(reflash);
    }
    this.links = this.resource.transferColl.cache
      .filter((i) => i.directoryId === this.id)
      .map((l) => new Link(l, this));
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
        subDir.loadDirectoryResource(reflash);
        return subDir;
      });
  }
  private getXConent(directory: IDirectory, content: model.DirectoryContent) {
    for (const child of directory.children) {
      content.directorys.push(child.metadata);
      this.getXConent(child, content);
    }
    content.forms.push(...directory.forms.map((a) => a.metadata));
    content.specieses.push(...directory.specieses.map((a) => a.metadata));
    content.propertys.push(...directory.propertys.map((a) => a.metadata));
    content.applications.push(...directory.applications.map((a) => a.metadata));
  }
  private receiveContent({
    operate,
    data,
  }: {
    operate: string;
    data: schema.XStandard[];
  }) {
    data = data.filter((a) => a.directoryId == this.metadata.id.replace('_', ''));
    if (data.length > 0) {
      data.forEach((a) => {
        switch (operate) {
          case 'insert':
            switch (a.typeName) {
              case '链接':
                this.resource.transferColl.cache.push(a as model.Link);
                this.links.push(new Link(a as model.Link, this));
                break;
              case '表单':
              case '报表':
              case '事项配置':
              case '实体配置':
                this.resource.formColl.cache.push(a as schema.XForm);
                this.forms.push(new Form(a as schema.XForm, this));
                break;
              case '分类':
                this.resource.speciesColl.cache.push(a as schema.XSpecies);
                this.specieses.push(new Species(a as schema.XSpecies, this));
                break;
              case '应用':
              case '模块':
                this.resource.applicationColl.cache.push(a as schema.XApplication);
                if ((a as schema.XApplication).parentId == undefined) {
                  this.applications.push(new Application(a as schema.XApplication, this));
                }
                break;
              case '属性':
                this.resource.propertyColl.cache.push(a as schema.XProperty);
                this.propertys.push(new Property(a as schema.XProperty, this));
                break;
              default:
                break;
            }
            break;
          case 'replace':
            let index = -1;
            switch (a.typeName) {
              case '链接':
                index = this.resource.transferColl.cache.findIndex((s) => s.id == a.id);
                if (index > -1) {
                  this.resource.transferColl.cache[index] = a as model.Link;
                }
                break;
              case '表单':
              case '报表':
              case '事项配置':
              case '实体配置':
                index = this.resource.formColl.cache.findIndex((s) => s.id == a.id);
                if (index > -1) {
                  this.resource.formColl.cache[index] = a as schema.XForm;
                }
                break;
              case '分类':
                index = this.resource.speciesColl.cache.findIndex((s) => s.id == a.id);
                if (index > -1) {
                  this.resource.speciesColl.cache[index] = a as schema.XSpecies;
                }
                break;
              case '应用':
                index = this.resource.applicationColl.cache.findIndex(
                  (s) => s.id == a.id,
                );
                if (index > -1) {
                  this.resource.applicationColl.cache[index] = a as schema.XApplication;
                }
                break;
              case '属性':
                index = this.resource.propertyColl.cache.findIndex((s) => s.id == a.id);
                if (index > -1) {
                  this.resource.propertyColl.cache[index] = a as schema.XProperty;
                }
                break;
              default:
                break;
            }
            this.updateMetadata(a);
            break;
          case 'delete':
            switch (a.typeName) {
              case '链接':
                this.links = this.links.filter((s) => s.id != a.id);
                this.resource.transferColl.removeCache(a.id);
                break;
              case '表单':
              case '报表':
              case '事项配置':
              case '实体配置':
                this.forms = this.forms.filter((s) => s.metadata.id != a.id);
                this.resource.formColl.removeCache(a.id);
                break;
              case '分类':
                this.specieses = this.specieses.filter((s) => s.metadata.id != a.id);
                this.resource.speciesColl.removeCache(a.id);
                break;
              case '应用':
                this.applications = this.applications.filter(
                  (s) => s.metadata.id != a.id,
                );
                this.resource.applicationColl.removeCache(a.id);
                break;
              case '属性':
                this.propertys = this.propertys.filter((s) => s.metadata.id != a.id);
                this.resource.propertyColl.removeCache(a.id);
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      });
      this.changCallback();
    }
  }
  private async notityConetnt(
    coll: XCollection<schema.XStandard>,
    operate: string,
    data: schema.XEntity[],
    onlineOnly: boolean = true,
  ) {
    await coll.notity(
      {
        data,
        operate,
      },
      onlineOnly,
    );
  }
}
