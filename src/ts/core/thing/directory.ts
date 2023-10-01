import { command, common, model, schema } from '../../base';
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
import { encodeKey, sleep } from '@/ts/base/common';
import { DataResource } from './resource';
import { DirectoryOperate, IDirectoryOperate } from './operate';
import { IPageTemplate, PageTemplate } from './standard/page';
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
  /** 目录结构变更 */
  structCallback(): void;
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
  /** 目录下的模板 */
  templates: IPageTemplate[];
  /** 新建迁移配置 */
  createTransfer(data: model.Transfer): Promise<ITransfer | undefined>;
  /** 加载迁移配置 */
  loadAllTransfer(reload?: boolean): Promise<ITransfer[]>;
  /** 新建模板配置 */
  createTemplate(data: model.XPageTemplate): Promise<IPageTemplate | undefined>;
  /** 加载模板配置 */
  loadAllTemplate(reload?: boolean): Promise<IPageTemplate[]>;
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
    this.parent = _parent;
    this.isContainer = true;
    this.taskEmitter = new common.Emitter();
    this.operater = new DirectoryOperate(this, _target.resource);
  }
  operater: IDirectoryOperate;
  taskEmitter: common.Emitter;
  parent: IDirectory | undefined;
  taskList: model.TaskModel[] = [];
  files: ISysFileInfo[] = [];
  formTypes: string[] = ['表单', '报表', '事项配置', '实体配置'];
  get cacheFlag(): string {
    return 'directorys';
  }
  get forms(): IForm[] {
    return this.operater.getContent(this.formTypes) as Form[];
  }
  get transfers(): ITransfer[] {
    return this.operater.getContent<ITransfer>(['迁移配置']);
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
  get templates(): IPageTemplate[] {
    return this.operater.getContent<IPageTemplate>(['页面模板']);
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
  structCallback(): void {
    command.emitter('-', 'refresh', this);
  }
  content(mode: number = 0): IFileInfo<schema.XEntity>[] {
    const cnt: IFileInfo<schema.XEntity>[] = [...this.children];
    if (this.typeName === '成员目录') {
      cnt.push(...this.target.members.map((i) => new Member(i, this)));
    } else {
      cnt.push(
        ...this.forms,
        ...this.applications,
        ...this.files,
        ...this.transfers,
        ...this.templates,
      );
      if (mode != 1) {
        cnt.push(...this.propertys);
        cnt.push(...this.specieses);
        if (!this.parent) {
          cnt.unshift(this.target.memberDirectory);
          cnt.push(...this.target.content(mode));
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
  override async copy(destination: IDirectory): Promise<boolean> {
    if (this.allowCopy(destination)) {
      const data = await destination.resource.directoryColl.replace({
        ...this.metadata,
        directoryId: destination.id,
      });
      if (data) {
        await this.operateDirectoryResource(
          this,
          destination.resource,
          'replaceMany',
          false,
        );
        await destination.notify('refresh', [data]);
      }
    }
    return false;
  }
  override async move(destination: IDirectory): Promise<boolean> {
    if (this.parent && this.allowMove(destination)) {
      const data = await destination.resource.directoryColl.replace({
        ...this.metadata,
        directoryId: destination.id,
      });
      if (data) {
        await this.operateDirectoryResource(
          this,
          destination.resource,
          'replaceMany',
          true,
        );
        await this.notify('refresh', [this._metadata]);
        await destination.notify('refresh', [data]);
      }
    }
    return false;
  }
  override async delete(): Promise<boolean> {
    if (this.parent) {
      await this.resource.directoryColl.delete(this.metadata);
      await this.operateDirectoryResource(this, this.resource, 'deleteMany');
      await this.notify('refresh', [this.metadata]);
    }
    return false;
  }
  async create(data: schema.XDirectory): Promise<schema.XDirectory | undefined> {
    const res = await this.resource.directoryColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      await this.notify('insert', [res]);
      return res;
    }
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
    while (this.taskList.filter((i) => i.finished < i.size).length > 2) {
      await sleep(1000);
    }
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
  async createTemplate(data: model.XPageTemplate): Promise<IPageTemplate | undefined> {
    const res = await this.resource.templateColl.insert({
      ...data,
      directoryId: this.id,
    });
    if (res) {
      const template = new PageTemplate(res, this);
      this.templates.push(template);
      await this.resource.templateColl.notity({ data: [res], operate: 'insert' });
      return template;
    }
  }
  async loadAllTemplate(reload?: boolean | undefined): Promise<IPageTemplate[]> {
    const templates: IPageTemplate[] = [...this.templates];
    for (const subDirectory of this.children) {
      templates.push(...(await subDirectory.loadAllTemplate(reload)));
    }
    return templates;
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
    await this.operater.loadResource(reload);
  }
  /** 对目录下所有资源进行操作 */
  private async operateDirectoryResource(
    directory: IDirectory,
    resource: DataResource,
    action: 'replaceMany' | 'deleteMany',
    move?: boolean,
  ) {
    for (const child of directory.children) {
      await this.operateDirectoryResource(child, resource, action, move);
    }
    await resource.directoryColl[action](directory.children.map((a) => a.metadata));
    await resource.formColl[action](directory.forms.map((a) => a.metadata));
    await resource.speciesColl[action](directory.specieses.map((a) => a.metadata));
    await resource.propertyColl[action](directory.propertys.map((a) => a.metadata));
    if (action == 'deleteMany') {
      await resource.speciesItemColl.deleteMatch({
        speciesId: {
          _in_: directory.specieses.map((a) => a.id),
        },
      });
      await resource.applicationColl.deleteMatch({
        directoryId: directory.id,
      });
    }
    if (action == 'replaceMany') {
      if (move) {
        var apps = directory.resource.applicationColl.cache.filter(
          (i) => i.directoryId === directory.id,
        );
        await resource.applicationColl.replaceMany(apps);
      } else {
        if (this.resource.targetMetadata.belongId != resource.targetMetadata.belongId) {
          const items = await this.directory.resource.speciesItemColl.loadSpace({
            options: {
              match: {
                speciesId: {
                  _in_: directory.specieses.map((a) => a.id),
                },
              },
            },
          });
          await resource.speciesItemColl.replaceMany(items);
        }
      }
    }
  }
}
