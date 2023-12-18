import { sleep } from '../../base/common';
import { command, model, schema } from '../../base';
import { IDirectory } from './directory';
import { Entity, IEntity, entityOperates } from '../public';
import { fileOperates } from '../public';
import { XCollection } from '../public/collection';
import { ITarget } from '../target/base/target';
/** 默认文件接口 */
export interface IFile extends IFileInfo<schema.XEntity> {}
/** 文件类接口 */
export interface IFileInfo<T extends schema.XEntity> extends IEntity<T> {
  /** 缓存 */
  cache: schema.XCache;
  /** 空间ID */
  spaceId: string;
  /** 归属ID */
  belongId: string;
  /** 是否为继承的类别 */
  isInherited: boolean;
  /** 是否允许设计 */
  canDesign: boolean;
  /** 是否为容器 */
  isContainer: boolean;
  /** 目录 */
  directory: IDirectory;
  /** 上级 */
  superior: IFile;
  /** 路径Key */
  locationKey: string;
  /** 撤回已删除 */
  restore(): Promise<boolean>;
  /** 删除文件系统项 */
  delete(notity?: boolean): Promise<boolean>;
  /** 彻底删除文件系统项 */
  hardDelete(notity?: boolean): Promise<boolean>;
  /**
   * 重命名
   * @param {string} name 新名称
   */
  rename(name: string): Promise<boolean>;
  /**
   * 拷贝文件系统项（目录）
   * @param {IDirectory} destination 目标文件系统
   */
  copy(destination: IDirectory): Promise<boolean>;
  /**
   * 移动文件系统项（目录）
   * @param {IDirectory} destination 目标文件系统
   */
  move(destination: IDirectory): Promise<boolean>;
  /** 加载文件内容 */
  loadContent(reload?: boolean): Promise<boolean>;
  /** 目录下的内容 */
  content(args?: boolean): IFile[];
  /** 缓存用户数据 */
  cacheUserData(notify?: boolean): Promise<boolean>;
}
/** 文件类抽象实现 */
export abstract class FileInfo<T extends schema.XEntity>
  extends Entity<T>
  implements IFileInfo<T>
{
  constructor(_metadata: T, _directory: IDirectory) {
    super(_metadata, [_metadata.typeName]);
    this.directory = _directory;
    this.cache = { fullId: `${this.spaceId}_${_metadata.id}` };
    setTimeout(
      async () => {
        await this.loadUserData();
      },
      this.id === this.userId ? 100 : 0,
    );
  }
  cache: schema.XCache;
  directory: IDirectory;
  canDesign: boolean = false;
  get isInherited(): boolean {
    return this.directory.isInherited;
  }
  get isContainer(): boolean {
    return false;
  }
  get target(): ITarget {
    if (this.directory.typeName.includes('目录')) {
      return this.directory.target;
    } else {
      return this.directory as unknown as ITarget;
    }
  }
  get belongId(): string {
    return this.target.belongId;
  }
  get spaceId(): string {
    return this.target.spaceId;
  }
  get locationKey(): string {
    return this.directory.key;
  }
  get cachePath(): string {
    return `${this.cacheFlag}.${this.cache.fullId}`;
  }
  get superior(): IFile {
    return this.directory;
  }
  abstract cacheFlag: string;
  abstract delete(): Promise<boolean>;
  async rename(_: string): Promise<boolean> {
    await sleep(0);
    return true;
  }
  async copy(_: IDirectory): Promise<boolean> {
    await sleep(0);
    return true;
  }
  async move(_: IDirectory): Promise<boolean> {
    await sleep(0);
    return true;
  }
  async restore(): Promise<boolean> {
    await sleep(0);
    return true;
  }
  async hardDelete(): Promise<boolean> {
    await sleep(0);
    return true;
  }
  async loadUserData(): Promise<void> {
    const data = await this.target.user.cacheObj.get<schema.XCache>(this.cachePath);
    if (data && data.fullId === this.cache.fullId) {
      this.cache = data;
    }
    this.target.user.cacheObj.subscribe(this.cachePath, (data: schema.XCache) => {
      if (data && data.fullId === this.cache.fullId) {
        this.cache = data;
        this.target.user.cacheObj.setValue(this.cachePath, data);
        this.superior.changCallback();
        command.emitterFlag(this.cacheFlag);
      }
    });
  }
  async cacheUserData(notify: boolean = true): Promise<boolean> {
    const success = await this.target.user.cacheObj.set(this.cachePath, this.cache);
    if (success && notify) {
      await this.target.user.cacheObj.notity(this.cachePath, this.cache, true, false);
    }
    return success;
  }

  async loadContent(reload: boolean = false): Promise<boolean> {
    return await sleep(reload ? 10 : 0);
  }
  content(): IFile[] {
    return [];
  }
  operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.target.space.hasRelationAuth()) {
      operates.unshift(fileOperates.Copy);
    }
    if (this.target.hasRelationAuth()) {
      operates.unshift(
        fileOperates.Move,
        fileOperates.Rename,
        fileOperates.Download,
        entityOperates.Update,
        entityOperates.Delete,
      );
      if (this.canDesign) {
        operates.unshift(entityOperates.Design);
      }
    }
    return operates;
  }
}
export interface IStandardFileInfo<T extends schema.XStandard> extends IFileInfo<T> {
  /** 归属组织key */
  spaceKey: string;
  /** 设置当前元数据 */
  setMetadata(_metadata: schema.XStandard): void;
  /** 变更通知 */
  notify(operate: string, data: T): Promise<boolean>;
  /** 更新 */
  update(data: T): Promise<boolean>;
  /** 接收通知 */
  receive(operate: string, data: schema.XStandard): boolean;
  /** 常用标签切换 */
  toggleCommon(): Promise<boolean>;
}
export interface IStandard extends IStandardFileInfo<schema.XStandard> {}
export abstract class StandardFileInfo<T extends schema.XStandard>
  extends FileInfo<T>
  implements IStandardFileInfo<T>
{
  coll: XCollection<T>;
  constructor(_metadata: T, _directory: IDirectory, _coll: XCollection<T>) {
    super(_metadata, _directory);
    this.coll = _coll;
  }
  get spaceKey(): string {
    return this.directory.target.space.directory.key;
  }
  abstract copy(destination: IDirectory): Promise<boolean>;
  abstract move(destination: IDirectory): Promise<boolean>;
  override get metadata(): T {
    return this._metadata;
  }
  allowCopy(destination: IDirectory): boolean {
    return this.target.belongId != destination.target.belongId;
  }
  allowMove(destination: IDirectory): boolean {
    return (
      destination.id != this.directory.id &&
      destination.target.belongId == this.target.belongId
    );
  }
  async update(data: T): Promise<boolean> {
    const result = await this.coll.replace({
      ...this.metadata,
      ...data,
      directoryId: this.metadata.directoryId,
      typeName: this.metadata.typeName,
    });
    if (result) {
      await this.notify('replace', result);
      return true;
    }
    return false;
  }
  async delete(): Promise<boolean> {
    if (this.directory) {
      const data = await this.coll.delete(this.metadata);
      if (data) {
        await this.notify('delete', this.metadata);
      }
    }
    return false;
  }
  async hardDelete(): Promise<boolean> {
    if (this.directory) {
      const data = await this.coll.remove(this.metadata);
      if (data) {
        await this.notify('remove', this.metadata);
      }
    }
    return false;
  }
  async restore(): Promise<boolean> {
    return this.update({ ...this.metadata, isDeleted: false });
  }
  async rename(name: string): Promise<boolean> {
    return await this.update({ ...this.metadata, name });
  }
  async copyTo(directoryId: string, coll: XCollection<T> = this.coll): Promise<boolean> {
    const data = await coll.replace({
      ...this.metadata,
      directoryId: directoryId,
    });
    if (data) {
      return await coll.notity({
        data: data,
        operate: 'insert',
      });
    }
    return false;
  }
  async moveTo(directoryId: string, coll: XCollection<T> = this.coll): Promise<boolean> {
    const data = await coll.replace({
      ...this.metadata,
      directoryId: directoryId,
    });
    if (data) {
      await this.notify('remove', this.metadata);
      return await coll.notity({
        data: data,
        operate: 'insert',
      });
    }
    return false;
  }
  async toggleCommon(): Promise<boolean> {
    let set: boolean = false;
    if (this.cache.tags?.includes('常用')) {
      this.cache.tags = this.cache.tags?.filter((i) => i != '常用');
    } else {
      set = true;
      this.cache.tags = this.cache.tags ?? [];
      this.cache.tags.push('常用');
    }
    const success = await this.cacheUserData();
    if (success) {
      return await this.target.user.toggleCommon(
        {
          id: this.id,
          spaceId: this.spaceId,
          targetId: this.target.id,
          directoryId: this.metadata.directoryId,
          applicationId: this.superior.id,
        },
        set,
      );
    }
    return false;
  }
  override operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.cache.tags?.includes('常用')) {
      operates.unshift(fileOperates.DelCommon);
    } else {
      operates.unshift(fileOperates.SetCommon);
    }
    return operates;
  }
  async notify(operate: string, data: T): Promise<boolean> {
    return await this.coll.notity({ data, operate });
  }
  receive(operate: string, data: schema.XStandard): boolean {
    switch (operate) {
      case 'delete':
      case 'replace':
        if (data) {
          if (operate === 'delete') {
            data = { ...data, isDeleted: true } as unknown as T;
            this.setMetadata(data as T);
          } else {
            this.setMetadata(data as T);
            this.loadContent(true);
          }
        }
    }
    return true;
  }
}
