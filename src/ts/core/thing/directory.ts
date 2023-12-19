import { command, common, model, schema } from '../../base';
import { directoryNew, directoryOperates, entityOperates, fileOperates } from '../public';
import { ITarget } from '../target/base/target';
import { IStandardFileInfo, StandardFileInfo, IFile } from './fileinfo';
import { StandardFiles } from './standard';
import { IApplication } from './standard/application';
import { BucketOpreates, FileItemModel } from '@/ts/base/model';
import { encodeKey, sleep } from '@/ts/base/common';
import { DataResource } from './resource';
import { ISysFileInfo, SysFileInfo } from './systemfile';
import { IPageTemplate } from './standard/page';

/** 可为空的进度回调 */
export type OnProgress = (p: number) => void;

/** 目录接口类 */
export interface IDirectory extends IStandardFileInfo<schema.XDirectory> {
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
  structCallback(reload?: boolean): void;
  /** 目录下的内容 */
  content(store?: boolean): IFile[];
  /** 创建子目录 */
  create(data: schema.XDirectory): Promise<schema.XDirectory | undefined>;
  /** 目录下的文件 */
  files: ISysFileInfo[];
  /** 加载模板配置 */
  loadAllTemplate(reload?: boolean): Promise<IPageTemplate[]>;
  /** 加载文件 */
  loadFiles(reload?: boolean): Promise<ISysFileInfo[]>;
  /** 上传文件 */
  createFile(file: Blob, p?: OnProgress): Promise<ISysFileInfo | undefined>;
  /** 加载全部应用 */
  loadAllApplication(): Promise<IApplication[]>;
  /** 加载目录资源 */
  loadDirectoryResource(reload?: boolean): Promise<void>;
  /** 通知重新加载文件列表 */
  notifyReloadFiles(): Promise<boolean>;
  /** 搜索文件 */
  searchFile(
    directoryId: string,
    applicationId: string,
    id: string,
  ): Promise<IFile | undefined>;
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
    this.taskEmitter = new common.Emitter();
    this.standard = new StandardFiles(this);
  }
  standard: StandardFiles;
  taskEmitter: common.Emitter;
  parent: IDirectory | undefined;
  taskList: model.TaskModel[] = [];
  files: ISysFileInfo[] = [];
  get isContainer(): boolean {
    return true;
  }
  get cacheFlag(): string {
    return 'directorys';
  }
  get superior(): IFile {
    return this.parent ?? this.target.superior.directory;
  }
  get groupTags(): string[] {
    if (this.parent) {
      return super.groupTags;
    } else {
      return [this.target.typeName];
    }
  }
  get spaceKey(): string {
    return this.target.space.directory.key;
  }
  get children(): IDirectory[] {
    return this.standard.directorys;
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
  structCallback(reload: boolean = false): void {
    if (reload) {
      command.emitter('executor', 'reload', this);
    } else {
      command.emitter('executor', 'refresh', this);
    }
    this.changCallback();
  }
  content(store: boolean = false): IFile[] {
    const cnt: IFile[] = [...this.children];
    if (this.target.session.isMyChat || this.target.hasRelationAuth()) {
      cnt.push(...this.files);
      cnt.push(...this.standard.forms);
      cnt.push(...this.standard.applications);
      cnt.push(...this.standard.propertys);
      cnt.push(...this.standard.specieses);
      cnt.push(...this.standard.transfers);
      cnt.push(...this.standard.templates);
    }
    return cnt.sort((a, b) => (a.metadata.updateTime < b.metadata.updateTime ? 1 : -1));
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await this.loadFiles(reload);
    await this.standard.loadStandardFiles(reload);
    if (reload) {
      await this.loadDirectoryResource(reload);
    }
    return true;
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
        await destination.notify('reload', data);
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
        await this.notify('remove', this._metadata);
        await destination.notify('reload', data);
      }
    }
    return false;
  }
  override async delete(): Promise<boolean> {
    if (this.parent) {
      await this.resource.directoryColl.delete(this.metadata);
      await this.notify('delete', this.metadata);
    }
    return false;
  }
  override async hardDelete(): Promise<boolean> {
    if (this.parent) {
      await this.resource.directoryColl.remove(this.metadata);
      await this.operateDirectoryResource(this, this.resource, 'removeMany');
      await this.notify('reload', this.metadata);
    }
    return false;
  }
  async create(data: schema.XDirectory): Promise<schema.XDirectory | undefined> {
    const result = await this.resource.directoryColl.insert({
      ...data,
      typeName: '目录',
      directoryId: this.id,
    });
    if (result) {
      await this.notify('insert', result);
      return result;
    }
  }
  async loadFiles(reload: boolean = false): Promise<ISysFileInfo[]> {
    if (this.files.length < 1 || reload) {
      const res = await this.resource.bucketOpreate<FileItemModel[]>({
        key: encodeKey(this.id),
        operate: BucketOpreates.List,
      });
      if (res.success) {
        this.files = (res.data || [])
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
      this.notifyReloadFiles();
      const file = new SysFileInfo(data, this);
      this.files.push(file);
      return file;
    }
  }
  async loadAllApplication(): Promise<IApplication[]> {
    const applications: IApplication[] = [...this.standard.applications];
    for (const item of this.children) {
      applications.push(...(await item.loadAllApplication()));
    }
    return applications;
  }
  async loadAllTemplate(reload?: boolean | undefined): Promise<IPageTemplate[]> {
    const templates: IPageTemplate[] = [...this.standard.templates];
    for (const item of this.children) {
      templates.push(...(await item.loadAllTemplate(reload)));
    }
    return templates;
  }
  async searchFile(
    directoryId: string,
    applicationId: string,
    id: string,
  ): Promise<IFile | undefined> {
    if (this.id === directoryId) {
      if (applicationId === directoryId) {
        await this.loadContent();
        return this.content().find((i) => i.id === id);
      } else {
        for (const item of this.standard.applications) {
          const file = await item.searchFile(applicationId, id);
          if (file) {
            return file;
          }
        }
      }
    } else {
      for (const item of this.children) {
        const file = await item.searchFile(directoryId, applicationId, id);
        if (file) {
          return file;
        }
      }
    }
  }
  override operates(): model.OperateModel[] {
    const operates: model.OperateModel[] = [];
    operates.push(
      directoryOperates.NewFile,
      directoryOperates.TaskList,
      directoryOperates.Refesh,
    );
    if (this.target.hasRelationAuth()) {
      if (this.name.includes('业务')) {
        operates.push({
          ...directoryNew,
          menus: [...directoryNew.menus, directoryOperates.Business],
        });
      } else if (this.name.includes('标准')) {
        operates.push({
          ...directoryNew,
          menus: [...directoryNew.menus, directoryOperates.Standard],
        });
      } else {
        operates.push(directoryNew);
      }
      if (this.target.user.copyFiles.size > 0) {
        operates.push(fileOperates.Parse);
      }
    }
    if (this.parent) {
      operates.push(...super.operates());
    } else {
      operates.push(entityOperates.Open);
    }
    return operates;
  }
  public async loadDirectoryResource(reload: boolean = false) {
    if (this.parent === undefined || reload) {
      await this.resource.preLoad(reload);
    }
    await this.standard.loadApplications();
    await this.standard.loadDirectorys();
    await this.standard.loadTemplates();
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
    await directory.standard.operateStandradFile(resource, action, move);
  }
  override receive(operate: string, data: schema.XStandard): boolean {
    this.coll.removeCache((i) => i.id != data.id);
    super.receive(operate, data);
    this.coll.cache.push(this._metadata);
    return true;
  }
  async notifyReloadFiles(): Promise<boolean> {
    return await this.coll.notity(
      {
        data: {
          ...this.metadata,
          directoryId: this.id,
        },
        operate: 'reloadFiles',
      },
      true,
    );
  }
}
