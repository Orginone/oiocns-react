import { common, model, schema } from '../../base';
import {
  directoryNew,
  directoryOperates,
  fileOperates,
  memberOperates,
  teamOperates,
  newWarehouse,
} from '../public';
import { ITarget } from '../target/base/target';
import { Form, IForm } from './standard/form';
import { Transfer, ITransfer } from './standard/transfer';
import {
  SysFileInfo,
  ISysFileInfo,
  IFileInfo,
  IStandardFileInfo,
  StandardFileInfo,
} from './fileinfo';
import { ISpecies } from './standard/species';
import { Member } from './member';
import { IProperty } from './standard/property';
import { IApplication } from './standard/application';
import { BucketOpreates, FileItemModel } from '@/ts/base/model';
import { encodeKey } from '@/ts/base/common';
import { DataResource } from './resource';
import { DirectoryOperate, IDirectoryOperate } from './operate';
/** 可为空的进度回调 */
export type OnProgress = (p: number) => void;

/** 目录接口类 */
export interface IDirectory extends IStandardFileInfo<schema.XDirectory> {
  /** 目录操作类 */
  operater: IDirectoryOperate;
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
  /** 重载 */
  reload(): void;
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
        directoryId: _parent?.id || '',
      },
      _parent ?? (_target as unknown as IDirectory),
      _target.resource.directoryColl,
    );
    this.target = _target;
    this.parent = _parent;
    this.taskEmitter = new common.Emitter();
    this.operater = new DirectoryOperate(this, _target.resource);
  }
  target: ITarget;
  operater: IDirectoryOperate;
  taskEmitter: common.Emitter;
  parent: IDirectory | undefined;
  taskList: model.TaskModel[] = [];
  files: ISysFileInfo[] = [];
  formTypes: string[] = ['表单', '报表', '事项配置', '实体配置'];
  get forms(): IForm[] {
    return this.operater.getContent(this.formTypes) as Form[];
  }
  get transfers(): ITransfer[] {
    return this.operater.getContent<ITransfer>(['链接']);
  }
  get specieses(): ISpecies[] {
    return this.operater.getContent<ISpecies>(['分类', '字典']);
  }
  get propertys(): IProperty[] {
    return this.operater.getContent<IProperty>(['属性']);
  }
  get applications(): IApplication[] {
    return this.operater.getContent<IApplication>(['应用']);
  }
  get children(): IDirectory[] {
    return this.operater.getContent<IDirectory>(['目录']);
  }
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
      cnt.push(...this.forms, ...this.applications, ...this.files, ...this.transfers);
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
        await this.loadDirectoryResource(reload);
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
        const data = await destination.resource.directoryColl.replace({
          ...this.metadata,
          parentId: destination.id,
          directoryId: destination.id,
        });
        if (data) {
          return await destination.resource.directoryColl.notity(
            {
              data: [data],
              operate: 'refresh',
            },
            false,
            destination.target.id,
            true,
            true,
          );
        }
      }
      return false;
    }
    return false;
  }
  async create(data: schema.XDirectory): Promise<schema.XDirectory | undefined> {
    const res = await this.resource.directoryColl.insert({
      ...data,
      directoryId: this.id,
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
      this.getAllConent(this, data);
      await this.resource.formColl.deleteMany(data.forms);
      await this.resource.speciesColl.deleteMany(data.specieses);
      await this.resource.propertyColl.deleteMany(data.propertys);
      await this.resource.directoryColl.deleteMany([...data.directorys, this.metadata]);
      await this.resource.applicationColl.deleteMany(data.applications);
      await this.notify('refresh', [this.metadata]);
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
  async createApplication(
    data: schema.XApplication,
  ): Promise<schema.XApplication | undefined> {
    const res = await this.resource.applicationColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      await this.resource.applicationColl.notity({ data: [res], operate: 'insert' });
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
      const link = new Transfer(res, this);
      this.transfers.push(link);
      await this.resource.transferColl.notity({ data: [res], operate: 'insert' });
      return link;
    }
  }
  async loadAllApplication(reload: boolean = false): Promise<IApplication[]> {
    const applications: IApplication[] = [...this.applications];
    for (const subDirectory of this.children) {
      applications.push(...(await subDirectory.loadAllApplication(reload)));
    }
    return applications;
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
        operates.push(newWarehouse);
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
    this.operater.loadResource(reload);
  }
  private getAllConent(directory: IDirectory, content: model.DirectoryContent) {
    for (const child of directory.children) {
      content.directorys.push(child.metadata);
      this.getAllConent(child, content);
    }
    content.forms.push(...directory.forms.map((a) => a.metadata));
    content.specieses.push(...directory.specieses.map((a) => a.metadata));
    content.propertys.push(...directory.propertys.map((a) => a.metadata));
    content.applications.push(...directory.applications.map((a) => a.metadata));
  }
  reload(): void {
    this.changCallback();
  }
}
