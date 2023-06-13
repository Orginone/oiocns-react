import { encodeKey } from '../../base/common';
import { BucketOpreates, FileItemModel } from '../../base/model';
import { model, kernel, schema } from '../../base';
import { FileItemShare } from '../../base/model';
import { IDirectory } from './directory';
import { Entity, IEntity } from '../public';
/** 文件类接口 */
export interface IFileInfo<T extends schema.XEntity> extends IEntity<T> {
  /** 目录 */
  directory: IDirectory;
  /** 删除文件系统项 */
  delete(): Promise<boolean>;
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
    id: data.key,
    name: data.name,
    code: data.name,
    icon: JSON.stringify(data),
    belongId: belongId,
    typeName: '文件',
    belong: belong,
  } as schema.XEntity;
};

/** 文件类实现 */
export class SysFileInfo extends Entity<schema.XEntity> implements ISysFileInfo {
  constructor(_metadata: model.FileItemModel, _directory: IDirectory) {
    super(
      fileToEntity(_metadata, _directory.metadata.belongId, _directory.metadata.belong),
    );
    this.filedata = _metadata;
    this.directory = _directory;
    this.belongId = this.directory.metadata.belongId;
  }
  belongId: string;
  filedata: FileItemModel;
  directory: IDirectory;
  shareInfo(): model.FileItemShare {
    return {
      size: this.filedata.size,
      name: this.filedata.name,
      extension: this.filedata.extension,
      shareLink:
        location.origin + '/orginone/anydata/bucket/load/' + this.filedata.shareLink,
      thumbnail: this.filedata.thumbnail,
    };
  }
  async rename(name: string): Promise<boolean> {
    if (this.filedata.name != name) {
      const res = await kernel.anystore.bucketOpreate<FileItemModel>(this.belongId, {
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
    const res = await kernel.anystore.bucketOpreate<FileItemModel[]>(this.belongId, {
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
      const res = await kernel.anystore.bucketOpreate<FileItemModel[]>(this.belongId, {
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
      const res = await kernel.anystore.bucketOpreate<FileItemModel[]>(this.belongId, {
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
}
