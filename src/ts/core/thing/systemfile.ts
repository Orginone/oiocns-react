import { model, schema } from '@/ts/base';
import { encodeKey, formatSize, generateUuid } from '../../base/common';
import { BucketOpreates, FileItemModel, FileItemShare } from '../../base/model';
import { FileInfo, IFile, IFileInfo } from './fileinfo';
import { IDirectory } from './directory';
import { entityOperates, fileOperates } from '../public';

/** 文件转实体 */
export const fileToEntity = (
  data: model.FileItemModel,
  directory: schema.XDirectory,
): schema.XStandard => {
  return {
    id: data.shareLink?.substring(1) ?? generateUuid(),
    name: data.name,
    code: data.key,
    status: 0,
    version: directory.version,
    icon: JSON.stringify(data),
    belong: directory.belong,
    belongId: directory.belongId,
    shareId: directory.shareId,
    typeName: data.contentType ?? '文件',
    createTime: data.dateCreated,
    updateTime: data.dateModified,
    directoryId: directory.id,
    createUser: directory.createUser,
    updateUser: directory.updateUser,
    remark: `${data.name}(${formatSize(data.size)})`,
  };
};

/** 系统文件接口 */
export interface ISysFileInfo extends IFileInfo<schema.XEntity> {
  /** 文件系统项对应的目标 */
  filedata: FileItemModel;
  /** 分享信息 */
  shareInfo(): FileItemShare;
  /** 视频切片 */
  hslSplit(): Promise<boolean>;
}

/** 文件类实现 */
export class SysFileInfo extends FileInfo<schema.XEntity> implements ISysFileInfo {
  constructor(_metadata: model.FileItemModel, _directory: IDirectory) {
    super(fileToEntity(_metadata, _directory.metadata), _directory);
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
      poster: this.filedata.poster,
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
        this.directory.notifyReloadFiles();
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
      this.directory.notifyReloadFiles();
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
        destination.notifyReloadFiles();
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
        this.directory.notifyReloadFiles();
        this.directory.files = this.directory.files.filter((i) => i.key != this.key);
        this.directory = destination;
        destination.notifyReloadFiles();
        destination.files.push(this);
      }
      return res.success;
    }
    return false;
  }
  async hslSplit(): Promise<boolean> {
    if (this.filedata.contentType?.startsWith('video')) {
      await this.directory.resource.bucketOpreate<boolean>({
        key: encodeKey(this.filedata.key),
        operate: BucketOpreates.HslSplit,
      });
      this.directory.loadFiles(true);
      this.directory.changCallback();
    }
    return false;
  }
  override operates(): model.OperateModel[] {
    const operates = super.operates();
    if (operates.includes(entityOperates.Delete)) {
      operates.push(entityOperates.HardDelete);
    }
    if (this.typeName.startsWith('video') && this.target.hasRelationAuth()) {
      operates.push(fileOperates.HslSplit);
    }
    return operates
      .filter((i) => i != entityOperates.Delete)
      .filter((i) => i != entityOperates.Update);
  }
  content(): IFile[] {
    return [];
  }
}
