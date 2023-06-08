import { blobToDataUrl, generateUuid, logger } from '@/ts/base/common';
import { BucketOpreateModel, BucketOpreates, FileItemModel } from '@/ts/base/model';
import { model, kernel } from '@/ts/base';
import { IFileSystem, TaskModel } from './filesystem';
import { FileItemShare } from '../../../base/model';
import { orgAuth } from '../../public/consts';
/** 分片大小 */
const chunkSize = 1024 * 1024;
/** 可为空的进度回调 */
export type OnProgressType = (p: number) => void | undefined;
/** 文件系统目录接口 */
export interface IFileSystemItem {
  /** 实体唯一键 */
  key: string;
  /** 文件系统 */
  filesys: IFileSystem;
  /** 文件系统项对应的目标 */
  metadata: FileItemModel;
  /** 上级文件系统项 */
  parent: IFileSystemItem | undefined;
  /** 下级文件系统项数组 */
  children: IFileSystemItem[];
  /** 分享信息 */
  shareInfo(): FileItemShare;
  /** 是否有操作权限 */
  hasOperateAuth(log?: boolean): boolean;
  /**
   * 创建文件系统项（目录）
   * @param {string} name 文件系统项名称
   */
  create(name: string): Promise<IFileSystemItem | undefined>;
  /** 删除文件系统项 */
  delete(): Promise<boolean>;
  /**
   * 重命名
   * @param {string} name 新名称
   */
  rename(name: string): Promise<boolean>;
  /**
   * 拷贝文件系统项（目录）
   * @param {IFileSystemItem} destination 目标文件系统
   */
  copy(destination: IFileSystemItem): Promise<boolean>;
  /**
   * 移动文件系统项（目录）
   * @param {IFileSystemItem} destination 目标文件系统
   */
  move(destination: IFileSystemItem): Promise<boolean>;
  /**
   * 加载下级文件系统项数组
   * @param {boolean} reload 重新加载,默认false
   */
  loadChildren(reload?: boolean): Promise<boolean>;
  /**
   * 上传文件
   * @param {string}  name 文件名
   * @param {Blob}  file 文件内容
   * @param {OnProgressType} onProgress 进度回调
   */
  upload(
    name: string,
    file: Blob,
    onProgress?: OnProgressType,
  ): Promise<IFileSystemItem | undefined>;
  /**
   * 下载文件
   * @param {string} path 下载保存路径
   * @param {OnProgressType} onProgress 进度回调
   */
  download(path: string, onProgress: OnProgressType): Promise<void>;
}

/** 文件系统项实现 */
export class FileSystemItem implements IFileSystemItem {
  constructor(
    _filesys: IFileSystem,
    _metadata: model.FileItemModel,
    _parent?: IFileSystemItem,
  ) {
    this.key = generateUuid();
    this.metadata = _metadata;
    this.parent = _parent;
    this.filesys = _filesys;
    this.belongId = this.filesys.belong.id;
  }
  key: string;
  belongId: string;
  filesys: IFileSystem;
  metadata: FileItemModel;
  parent: IFileSystemItem | undefined;
  children: IFileSystemItem[] = [];
  shareInfo(): model.FileItemShare {
    return {
      size: this.metadata.size,
      name: this.metadata.name,
      extension: this.metadata.extension,
      shareLink:
        location.origin + '/orginone/anydata/bucket/load/' + this.metadata.shareLink,
      thumbnail: this.metadata.thumbnail,
    };
  }
  get childrenData(): model.FileItemModel[] {
    return this.children.map((item) => {
      return item.metadata;
    });
  }
  async rename(name: string): Promise<boolean> {
    if (this.hasOperateAuth()) {
      if (this.metadata.name != name && !(await this._findByName(name))) {
        const res = await kernel.anystore.bucketOpreate<FileItemModel>(this.belongId, {
          name: name,
          key: this._formatKey(),
          operate: BucketOpreates.Rename,
        });
        if (res.success && res.data) {
          this.metadata = res.data;
          return true;
        }
      }
    }
    return false;
  }
  async create(name: string): Promise<IFileSystemItem | undefined> {
    const exist = await this._findByName(name);
    if (!exist) {
      const res = await kernel.anystore.bucketOpreate<FileItemModel>(this.belongId, {
        key: this._formatKey(name),
        operate: BucketOpreates.Create,
      });
      if (res.success && res.data) {
        this.metadata.hasSubDirectories = true;
        const node = new FileSystemItem(this.filesys, res.data, this);
        this.children.push(node);
        return node;
      }
    }
    return exist;
  }
  async delete(): Promise<boolean> {
    if (this.hasOperateAuth()) {
      const res = await kernel.anystore.bucketOpreate<FileItemModel[]>(this.belongId, {
        key: this._formatKey(),
        operate: BucketOpreates.Delete,
      });
      if (res.success) {
        const index = this.parent?.children.findIndex((item) => {
          return item.metadata.key == this.metadata.key;
        });
        if (index != undefined && index > -1) {
          this.parent?.children.splice(index, 1);
        }
        return true;
      }
    }
    return false;
  }
  async copy(destination: IFileSystemItem): Promise<boolean> {
    if (this.hasOperateAuth()) {
      if (
        destination.metadata.isDirectory &&
        this.metadata.key != destination.metadata.key
      ) {
        const res = await kernel.anystore.bucketOpreate<FileItemModel[]>(this.belongId, {
          key: this._formatKey(),
          destination: destination.metadata.key,
          operate: BucketOpreates.Copy,
        });
        if (res.success) {
          destination.metadata.hasSubDirectories = true;
          destination.children.push(this._newItemForDes(this, destination));
          return true;
        }
      }
    }
    return false;
  }
  async move(destination: IFileSystemItem): Promise<boolean> {
    if (this.hasOperateAuth()) {
      if (
        destination.metadata.isDirectory &&
        this.metadata.key != destination.metadata.key
      ) {
        const res = await kernel.anystore.bucketOpreate<FileItemModel[]>(this.belongId, {
          key: this._formatKey(),
          destination: destination.metadata.key,
          operate: BucketOpreates.Move,
        });
        if (res.success) {
          const index = this.parent?.children.findIndex((item) => {
            return item.metadata.key == this.metadata.key;
          });
          if (index && index > -1) {
            this.parent?.children.splice(index, 1);
          }
          destination.metadata.hasSubDirectories = true;
          destination.children.push(this._newItemForDes(this, destination));
          return true;
        }
      }
    }
    return false;
  }
  async loadChildren(reload: boolean = false): Promise<boolean> {
    if (this.metadata.isDirectory && (reload || this.children.length < 1)) {
      const res = await kernel.anystore.bucketOpreate<FileItemModel[]>(this.belongId, {
        key: this._formatKey(),
        operate: BucketOpreates.List,
      });
      if (res.success && res.data.length > 0) {
        this.children = res.data.map((item) => {
          return new FileSystemItem(this.filesys, item, this);
        });
        return true;
      }
    }
    return false;
  }
  async upload(
    name: string,
    file: Blob,
    p?: OnProgressType,
  ): Promise<IFileSystemItem | undefined> {
    const idx = name.lastIndexOf('.');
    if (idx > -1) {
      name = await this._confrimName(name.substring(0, idx), name.substring(idx));
    } else {
      name = await this._confrimName(name, '');
    }
    p?.apply(this, [0]);
    const task: TaskModel = {
      name: name,
      finished: 0,
      size: file.size,
      createTime: new Date(),
      group: this.metadata.name,
    };
    let data: BucketOpreateModel = {
      key: this._formatKey(name),
      operate: BucketOpreates.Upload,
    };
    const id = generateUuid();
    this.filesys.taskChanged(id, task);
    let index = 0;
    while (index * chunkSize < file.size) {
      var start = index * chunkSize;
      var end = start + chunkSize;
      if (end > file.size) {
        end = file.size;
      }
      data.fileItem = {
        index: index,
        uploadId: id,
        size: file.size,
        data: [],
        dataUrl: await blobToDataUrl(file.slice(start, end)),
      };
      const res = await kernel.anystore.bucketOpreate<FileItemModel>(this.belongId, data);
      if (!res.success) {
        data.operate = BucketOpreates.AbortUpload;
        await kernel.anystore.bucketOpreate<boolean>(this.belongId, data);
        task.finished = -1;
        this.filesys.taskChanged(id, task);
        p?.apply(this, [-1]);
        return;
      }
      index++;
      task.finished = end;
      this.filesys.taskChanged(id, task);
      p?.apply(this, [end]);
      if (end === file.size && res.data) {
        const node = new FileSystemItem(this.filesys, res.data, this);
        this.children.push(node);
        return node;
      }
    }
  }
  download(path: string, onProgress: OnProgressType): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /** 校验权限 */
  hasOperateAuth(log: boolean = true): boolean {
    if (!this.filesys.belong.hasAuthoritys([orgAuth.ThingAuthId])) {
      if (log) {
        logger.warn('抱歉,您没有权限操作.');
      }
      return false;
    }
    return true;
  }
  /**
   * 格式化key,主要针对路径中的中文
   * @returns 格式化后的key
   */
  private _formatKey(subName: string = '') {
    if (!this.metadata.key && !subName) {
      return '';
    }
    try {
      let keys = !this.metadata.key ? [] : [this.metadata.key];
      if (subName != '' && subName.length > 0) {
        keys.push(subName);
      }
      return btoa(unescape(encodeURIComponent(keys.join('/'))));
    } catch (err) {
      return '';
    }
  }
  /**
   * 根据名称查询子文件系统项
   * @param name 名称
   */
  private async _findByName(name: string): Promise<IFileSystemItem | undefined> {
    await this.loadChildren();
    for (const item of this.children) {
      if (item.metadata.name === name) {
        return item;
      }
    }
    return;
  }
  /** 根据名称确认新文件名称 */
  private async _confrimName(
    name: string,
    ext: string,
    index: number = 0,
  ): Promise<string> {
    await this.loadChildren();
    const newName = index > 0 ? `${name}_${index}${ext}` : `${name}${ext}`;
    for (const item of this.children) {
      if (item.metadata.name === newName) {
        return this._confrimName(name, ext, index + 1);
      }
    }
    return newName;
  }
  /**
   * 根据新目录生成文件系统项
   * @param source 源
   * @param destination 目标
   * @returns 新的文件系统项
   */
  private _newItemForDes(
    source: IFileSystemItem,
    destination: IFileSystemItem,
  ): IFileSystemItem {
    let node = new FileSystemItem(
      this.filesys,
      {
        name: source.metadata.name,
        dateCreated: new Date(),
        dateModified: new Date(),
        size: source.metadata.size,
        shareLink: source.metadata.shareLink,
        extension: source.metadata.extension,
        thumbnail: source.metadata.thumbnail,
        key: destination.metadata.key + '/' + source.metadata.name,
        isDirectory: source.metadata.isDirectory,
        contentType: source.metadata.contentType,
        hasSubDirectories: source.metadata.hasSubDirectories,
      },
      destination,
    );
    for (const item of source.children) {
      node.children.push(this._newItemForDes(item, node));
    }
    return node;
  }
}
