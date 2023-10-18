import { command, common, model, schema } from '../../base';
import {
  directoryNew,
  directoryOperates,
  fileOperates,
  memberOperates,
  teamOperates,
} from '../public';
import { ITarget } from '../target/base/target';
import { ITransfer } from './standard/transfer';
import {
  SysFileInfo,
  ISysFileInfo,
  IStandardFileInfo,
  StandardFileInfo,
  IFile,
} from './fileinfo';
import { Member } from './member';
import { StandardFiles } from './standard';
import { IApplication } from './standard/application';
import { BucketOpreates, FileItemModel } from '@/ts/base/model';
import { encodeKey, sleep } from '@/ts/base/common';
import { DataResource } from './resource';
import { DirectoryOperate, IDirectoryOperate } from './operate';
import { IPageTemplate } from './standard/page';

/** 可为空的进度回调 */
export type OnProgress = (p: number) => void;

/** 目录接口类 */
export interface IDirectory extends IStandardFileInfo<schema.XDirectory> {
  /** 目录操作类 */
  operater: IDirectoryOperate;
  /** 目录下标准类 */
  standard: StandardFiles;
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
  content(mode?: number): IFile[];
  /** 创建子目录 */
  create(data: schema.XDirectory): Promise<schema.XDirectory | undefined>;
  /** 目录下的文件 */
  files: ISysFileInfo[];
  /** 目录下的应用 */
  applications: IApplication[];
  /** 加载迁移配置 */
  loadAllTransfer(reload?: boolean): Promise<ITransfer[]>;
  /** 加载模板配置 */
  loadAllTemplate(reload?: boolean): Promise<IPageTemplate[]>;
  /** 加载文件 */
  loadFiles(reload?: boolean): Promise<ISysFileInfo[]>;
  /** 上传文件 */
  createFile(file: Blob, p?: OnProgress): Promise<ISysFileInfo | undefined>;
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
    this.standard = new StandardFiles(this);
  }
  standard: StandardFiles;
  operater: IDirectoryOperate;
  taskEmitter: common.Emitter;
  parent: IDirectory | undefined;
  taskList: model.TaskModel[] = [];
  files: ISysFileInfo[] = [];
  get cacheFlag(): string {
    return 'directorys';
  }
  get spaceKey(): string {
    return this.target.space.directory.key;
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
    return this.target.isInherited;
  }
  get locationKey(): string {
    return this.key;
  }
  get resource(): DataResource {
    return this.target.resource;
  }
  structCallback(): void {
    command.emitter('executor', 'refresh', this);
  }
  content(mode: number = 0): IFile[] {
    const cnt: IFile[] = [...this.children];
    if (this.target.session.isMyChat && this.target.hasRelationAuth()) {
      if (this.typeName === '成员目录') {
        cnt.push(...this.target.members.map((i) => new Member(i, this)));
      } else {
        cnt.push(
          ...this.standard.forms,
          ...this.applications,
          ...this.files,
          ...this.standard.transfers,
          ...this.standard.templates,
        );
        if (mode != 1) {
          cnt.push(...this.standard.propertys);
          cnt.push(...this.standard.specieses);
          if (!this.parent) {
            cnt.unshift(this.target.memberDirectory);
            cnt.push(...this.target.content(mode));
          }
        }
      }
    }
    return cnt.sort((a, b) => (a.metadata.updateTime < b.metadata.updateTime ? 1 : -1));
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadFiles(reload);
    await this.standard.loadStandardFiles(reload);
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
      await this.notify('refresh', [this.metadata]);
    }
    return false;
  }
  override async hardDelete(): Promise<boolean> {
    if (this.parent) {
      await this.resource.directoryColl.remove(this.metadata);
      await this.operateDirectoryResource(this, this.resource, 'removeMany');
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
  async loadAllApplication(reload: boolean = false): Promise<IApplication[]> {
    const applications: IApplication[] = [...this.applications];
    for (const subDirectory of this.children) {
      applications.push(...(await subDirectory.loadAllApplication(reload)));
    }
    return applications;
  }
  async loadAllTransfer(reload: boolean = false): Promise<ITransfer[]> {
    const links: ITransfer[] = [...(await this.standard.loadTransfers(reload))];
    for (const subDirectory of this.children) {
      links.push(...(await subDirectory.loadAllTransfer(reload)));
    }
    return links;
  }
  async loadAllTemplate(reload?: boolean | undefined): Promise<IPageTemplate[]> {
    const templates: IPageTemplate[] = [...(await this.standard.loadTemplates(reload))];
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
    await this.operater.loadResource(reload, this.standard.standardFiles);
  }
  /** 对目录下所有资源进行操作 */
  private async operateDirectoryResource(
    directory: IDirectory,
    resource: DataResource,
    action: 'replaceMany' | 'removeMany',
    move?: boolean,
  ) {
    if (action === 'removeMany') {
      this.resource.deleteDirectory(directory.id);
    }
    for (const child of directory.children) {
      await this.operateDirectoryResource(child, resource, action, move);
    }
    await resource.directoryColl[action](directory.children.map((a) => a.metadata));
    await directory.standard.operateStandradFile(resource, action, move);
    if (action == 'removeMany') {
      await resource.applicationColl.removeMatch({
        directoryId: directory.id,
      });
    }
    if (action == 'replaceMany' && move) {
      var apps = directory.resource.applicationColl.cache.filter(
        (i) => i.directoryId === directory.id,
      );
      await resource.applicationColl.replaceMany(apps);
    }
  }
}
