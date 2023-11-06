import { command, common, model, schema } from '../../base';
import {
  directoryNew,
  directoryOperates,
  entityOperates,
  fileOperates,
  memberOperates,
  newWarehouse,
  teamOperates,
} from '../public';
import { ITarget } from '../target/base/target';
import { ITransfer } from './standard/transfer';
import { IStandardFileInfo, StandardFileInfo, IFile } from './fileinfo';
import { Member } from './member';
import { StandardFiles } from './standard';
import { IApplication } from './standard/application';
import { BucketOpreates, FileItemModel } from '@/ts/base/model';
import { encodeKey, sleep } from '@/ts/base/common';
import { DataResource } from './resource';
import { ISysFileInfo, SysFileInfo } from './systemfile';
import { IStorage } from '../target/outTeam/storage';
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
  content(): IFile[];
  /** 创建子目录 */
  create(data: schema.XDirectory): Promise<schema.XDirectory | undefined>;
  /** 目录下的文件 */
  files: ISysFileInfo[];
  /** 加载迁移配置 */
  loadAllTransfer(reload?: boolean): Promise<ITransfer[]>;
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
    this.standard = new StandardFiles(this);
  }
  standard: StandardFiles;
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
  }
  content(): IFile[] {
    const cnt: IFile[] = [...this.children];
    if (this.target.session.isMyChat || this.target.hasRelationAuth()) {
      if (this.typeName === '成员目录') {
        cnt.push(...this.target.members.map((i) => new Member(i, this)));
      } else {
        cnt.push(...this.files);
        cnt.push(...this.standard.forms);
        cnt.push(...this.standard.applications);
        cnt.push(...this.standard.propertys);
        cnt.push(...this.standard.specieses);
        cnt.push(...this.standard.transfers);
        cnt.push(...this.standard.repository);
        if (!this.parent) {
          for (const item of this.target.content()) {
            const target = item as ITarget | IDirectory | IStorage;
            if (!('standard' in target || 'isActivate' in target)) {
              cnt.push(target.directory);
            }
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
  async loadAllTransfer(reload: boolean = false): Promise<ITransfer[]> {
    const links: ITransfer[] = await this.standard.loadTransfers(reload);
    for (const subDirectory of this.children) {
      links.push(...(await subDirectory.loadAllTransfer(reload)));
    }
    return links;
  }
  override operates(): model.OperateModel[] {
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
      if (this.target.hasRelationAuth()) {
        operates.push(directoryNew);
        operates.push(newWarehouse);
        if (this.target.user.copyFiles.size > 0) {
          operates.push(fileOperates.Parse);
        }
      }
      if (this.parent) {
        operates.push(...super.operates());
      } else {
        operates.push(entityOperates.Open);
      }
    }
    return operates;
  }
  public async loadDirectoryResource(reload: boolean = false) {
    if (this.parent === undefined || reload) {
      await this.resource.preLoad(reload);
    }
    await this.standard.loadApplications();
    await this.standard.loadDirectorys();
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
