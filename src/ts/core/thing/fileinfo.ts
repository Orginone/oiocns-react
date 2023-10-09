import { encodeKey, sleep } from '../../base/common';
import { BucketOpreates, FileItemModel } from '../../base/model';
import { command, model, schema } from '../../base';
import { FileItemShare } from '../../base/model';
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
  /** 是否为容器 */
  isContainer: boolean;
  /** 目录 */
  directory: IDirectory;
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
  content(mode?: number): IFile[];
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
    this.isContainer = false;
    this.cache = { fullId: `${this.spaceId}_${_metadata.id}` };
    setTimeout(
      async () => {
        await this.loadUserData();
      },
      this.id === this.userId ? 100 : 0,
    );
  }
  cache: schema.XCache;
  isContainer: boolean;
  directory: IDirectory;
  canDesign: boolean = false;
  get isInherited(): boolean {
    return this.directory.isInherited;
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
  abstract cacheFlag: string;
  abstract delete(): Promise<boolean>;
  abstract rename(name: string): Promise<boolean>;
  abstract copy(destination: IDirectory): Promise<boolean>;
  abstract move(destination: IDirectory): Promise<boolean>;
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
        this.directory.changCallback();
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
  content(_mode: number = 0): IFile[] {
    return [];
  }
  operates(mode: number = 0): model.OperateModel[] {
    const operates = super.operates(mode);
    if (mode % 2 === 0) {
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
    }
    return operates;
  }
}
/** 系统文件接口 */
export interface ISysFileInfo extends IFileInfo<schema.XEntity> {
  /** 文件系统项对应的目标 */
  filedata: FileItemModel;
  /** 分享信息 */
  shareInfo(): FileItemShare;
}
/** 文件转实体 */
export const fileToEntity = (
  data: model.FileItemModel,
  belongId: string,
  belong: schema.XTarget | undefined,
): schema.XEntity => {
  return {
    id: data.shareLink?.substring(1),
    name: data.name,
    code: data.key,
    icon: JSON.stringify(data),
    belongId: belongId,
    typeName: data.contentType,
    createTime: data.dateCreated,
    updateTime: data.dateModified,
    belong: belong,
  } as schema.XEntity;
};
/** 文件类实现 */
export class SysFileInfo extends FileInfo<schema.XEntity> implements ISysFileInfo {
  constructor(_metadata: model.FileItemModel, _directory: IDirectory) {
    super(
      fileToEntity(_metadata, _directory.metadata.belongId, _directory.metadata.belong),
      _directory,
    );
    this.filedata = _metadata;
  }
  get cacheFlag(): string {
    return 'files';
  }
  get groupTags(): string[] {
    const gtags: string[] = [];
    if (this.typeName.startsWith('image')) {
      gtags.push('图片');
    } else if (this.typeName.startsWith('video')) {
      gtags.push('视频');
    } else if (this.typeName.startsWith('text')) {
      gtags.push('文本');
    } else if (this.typeName.includes('pdf')) {
      gtags.push('PDF');
    } else if (this.typeName.includes('office')) {
      gtags.push('Office');
    }
    return [...gtags, '文件'];
  }
  filedata: FileItemModel;
  shareInfo(): model.FileItemShare {
    return {
      size: this.filedata.size,
      name: this.filedata.name,
      extension: this.filedata.extension,
      contentType: this.filedata.contentType,
      shareLink: this.filedata.shareLink,
      thumbnail: this.filedata.thumbnail,
    };
  }
  async rename(name: string): Promise<boolean> {
    if (this.filedata.name != name) {
      const res = await this.directory.resource.bucketOpreate<FileItemModel>({
        name: name,
        key: encodeKey(this.filedata.key),
        operate: BucketOpreates.Rename,
      });
      if (res.success && res.data) {
        this.filedata = res.data;
        return true;
      }
    }
    return false;
  }
  async delete(): Promise<boolean> {
    const res = await this.directory.resource.bucketOpreate<FileItemModel[]>({
      key: encodeKey(this.filedata.key),
      operate: BucketOpreates.Delete,
    });
    if (res.success) {
      this.directory.files = this.directory.files.filter((i) => i.key != this.key);
    }
    return res.success;
  }
  async hardDelete(): Promise<boolean> {
    return await this.delete();
  }
  async copy(destination: IDirectory): Promise<boolean> {
    if (destination.id != this.directory.id) {
      const res = await this.directory.resource.bucketOpreate<FileItemModel[]>({
        key: encodeKey(this.filedata.key),
        destination: destination.id,
        operate: BucketOpreates.Copy,
      });
      if (res.success) {
        destination.files.push(this);
      }
      return res.success;
    }
    return false;
  }
  async move(destination: IDirectory): Promise<boolean> {
    if (destination.id != this.directory.id) {
      const res = await this.directory.resource.bucketOpreate<FileItemModel[]>({
        key: encodeKey(this.filedata.key),
        destination: destination.id,
        operate: BucketOpreates.Move,
      });
      if (res.success) {
        this.directory.files = this.directory.files.filter((i) => i.key != this.key);
        this.directory = destination;
        destination.files.push(this);
      }
      return res.success;
    }
    return false;
  }
  override operates(_mode?: number): model.OperateModel[] {
    const operates = super.operates();
    return operates.filter((i) => i.cmd != 'update');
  }
  content(_mode?: number | undefined): IFile[] {
    return [];
  }
}
export interface IStandardFileInfo<T extends schema.XStandard> extends IFileInfo<T> {
  /** 归属组织key */
  spaceKey: string;
  /** 设置当前元数据 */
  setMetadata(_metadata: schema.XStandard): void;
  /** 变更通知 */
  notify(operate: string, data: schema.XEntity[]): Promise<boolean>;
  /** 更新 */
  update(data: T): Promise<boolean>;
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
    console.log(data);
    const res = await this.coll.replace({
      ...this.metadata,
      ...data,
      directoryId: this.metadata.directoryId,
      typeName: this.metadata.typeName,
    });
    if (res) {
      await this.notify('replace', [res]);
      return true;
    }
    return false;
  }
  async delete(): Promise<boolean> {
    if (this.directory) {
      const data = await this.coll.delete(this.metadata);
      if (data) {
        await this.notify('delete', [this.metadata]);
      }
    }
    return false;
  }
  async hardDelete(): Promise<boolean> {
    if (this.directory) {
      const data = await this.coll.remove(this.metadata);
      if (data) {
        await this.notify('remove', [this.metadata]);
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
        data: [data],
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
      await this.notify('delete', [this.metadata]);
      return await coll.notity({
        data: [data],
        operate: 'insert',
      });
    }
    return false;
  }
  async notify(operate: string, data: schema.XStandard[]): Promise<boolean> {
    return await this.coll.notity({ data, operate });
  }
}
