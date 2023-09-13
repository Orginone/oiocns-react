import { encodeKey, sleep } from '../../base/common';
import { BucketOpreates, FileItemModel } from '../../base/model';
import { model, schema } from '../../base';
import { FileItemShare } from '../../base/model';
import { IDirectory } from './directory';
import { Entity, IEntity, entityOperates } from '../public';
import { fileOperates } from '../public';
import { XCollection } from '../public/collection';
/** 文件类接口 */
export interface IFileInfo<T extends schema.XEntity> extends IEntity<T> {
  /** 空间ID */
  spaceId: string;
  /** 归属ID */
  belongId: string;
  /** 是否为继承的类别 */
  isInherited: boolean;
  /** 目录 */
  directory: IDirectory;
  /** 路径Key */
  locationKey: string;
  /** 删除文件系统项 */
  delete(notity?: boolean): Promise<boolean>;
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
  content(mode?: number): IFileInfo<schema.XEntity>[];
}

/** 文件类抽象实现 */
export abstract class FileInfo<T extends schema.XEntity>
  extends Entity<T>
  implements IFileInfo<T>
{
  constructor(_metadata: T, _directory: IDirectory) {
    super(_metadata);
    if ('target' in _directory) {
      this.directory = _directory;
    } else {
      this.directory = this as unknown as IDirectory;
    }
  }
  directory: IDirectory;
  get isInherited(): boolean {
    return this.directory.isInherited;
  }
  get belongId(): string {
    return this.directory.metadata.belongId;
  }
  get spaceId(): string {
    return this.directory.target.space.id;
  }
  get locationKey(): string {
    return this.directory.key;
  }
  abstract delete(): Promise<boolean>;
  abstract rename(name: string): Promise<boolean>;
  abstract copy(destination: IDirectory): Promise<boolean>;
  abstract move(destination: IDirectory): Promise<boolean>;
  async loadContent(reload: boolean = false): Promise<boolean> {
    return await sleep(reload ? 10 : 0);
  }
  content(_mode: number = 0): IFileInfo<schema.XEntity>[] {
    return [];
  }
  operates(mode: number = 0): model.OperateModel[] {
    const operates = super.operates(mode);
    if (mode % 2 === 0) {
      if (this.directory.target.space.hasRelationAuth()) {
        operates.unshift(fileOperates.Copy);
      }
      if (this.directory.target.hasRelationAuth()) {
        operates.unshift(
          fileOperates.Move,
          fileOperates.Rename,
          fileOperates.Download,
          entityOperates.Update,
          entityOperates.Delete,
        );
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
    id: 'orginone/anydata/bucket/load/' + data.shareLink,
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
  content(_mode?: number | undefined): IFileInfo<schema.XEntity>[] {
    return [];
  }
}
export interface IStandardFileInfo<T extends schema.XStandard> extends IFileInfo<T> {
  /** 当前操作集合 */
  coll: XCollection<T>;
  /**
   * 拷贝文件系统项（目录）
   * @param {IDirectory} destination 目标文件系统
   */
  copy(destination: IDirectory, coll?: XCollection<T>): Promise<boolean>;
  /** 更新 */
  update(data: T): Promise<boolean>;
}
export class StandardFileInfo<T extends schema.XStandard>
  extends FileInfo<T>
  implements IStandardFileInfo<T>
{
  coll: XCollection<T>;
  constructor(_metadata: T, _directory: IDirectory, _coll: XCollection<T>) {
    super(_metadata, _directory);
    this.coll = _coll;
    this.subscribeOperations();
  }
  async update(data: T): Promise<boolean> {
    console.log(this.metadata, 'data');
    const res = await this.coll.replace({
      ...this.metadata,
      ...data,
      directoryId: this.metadata.directoryId,
      typeName: this.metadata.typeName,
    });
    if (res) {
      await this.notify('replace', [this.metadata]);
      return true;
    }
    return false;
  }
  async delete(): Promise<boolean> {
    if (this.directory) {
      const data = await this.coll.delete(this.metadata);
      if (data) {
        await this.notify('delete', [this.metadata]);
        return true;
      }
    }
    return false;
  }
  async rename(name: string): Promise<boolean> {
    return await this.update({ ...this.metadata, name });
  }
  async copy(
    destination: IDirectory,
    coll: XCollection<T> = this.coll,
  ): Promise<boolean> {
    if (this.directory.target.belongId != destination.target.belongId) {
      const data = await coll.copy(
        {
          ...this.metadata,
          shareId: destination.target.id,
          directoryId: destination.id,
        },
        destination.target.belongId,
      );
      if (data) {
        return await coll.notity(
          {
            data: [data],
            operate: 'insert',
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
  async move(destination: IDirectory): Promise<boolean> {
    if (
      destination.id != this.directory.id &&
      destination.target.belongId == this.directory.target.belongId
    ) {
      const data = await this.coll.copy(
        {
          ...this.metadata,
          shareId: destination.target.id,
          directoryId: destination.id,
        },
        destination.target.belongId,
      );
      if (data) {
        return (
          (await this.notify('delete', [this.metadata])) &&
          (await this.notify('insert', [data]))
        );
      }
    }
    return false;
  }
  async subscribeOperations(): Promise<void> {
    this.coll.subscribe((res: { operate: string; data: T[] }) => {
      res.data.map((item) => this.receiveMessage(res.operate, item));
    });
  }

  protected receiveMessage(operate: string, data: T): void {
    if (data.id == this.metadata.id) {
      switch (operate) {
        case 'replace':
          this.setMetadata(data);
          this.changCallback();
      }
    }
  }

  async notify(
    operate: string,
    data: schema.XEntity[],
    onlineOnly: boolean = true,
  ): Promise<boolean> {
    return await this.coll.notity(
      {
        data,
        operate,
      },
      false,
      this.directory.target.id,
      true,
      onlineOnly,
    );
  }
}
