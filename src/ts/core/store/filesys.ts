import { blobToDataUrl, generateUuid } from '@/ts/base/common';
import { BucketOpreateModel, BucketOpreates, FileItemModel } from '@/ts/base/model';
import { model, kernel } from '../../base';
import { IFileSystemItem, IObjectItem, OnProgressType, TaskModel } from './ifilesys';
/**
 * 文件系统项实现
 */
/** 分片大小 */
const chunkSize = 1024 * 1024;
export class FileSystemItem implements IFileSystemItem {
  key: string;
  name: string;
  isRoot: boolean;
  target: model.FileItemModel;
  parent: IObjectItem;
  children: IFileSystemItem[];
  static _taskList: TaskModel[] = [];
  constructor(target: model.FileItemModel, parent: IObjectItem) {
    this.children = [];
    this.target = target;
    this.parent = parent;
    this.key = target.key;
    this.name = target.name;
    this.isRoot = parent === undefined;
  }
  get taskList(): TaskModel[] {
    return FileSystemItem._taskList;
  }
  shareInfo(): model.FileItemShare {
    return {
      size: this.target.size,
      name: this.target.name,
      extension: this.target.extension,
      shareLink:
        location.origin + '/orginone/anydata/bucket/load/' + this.target.shareLink,
      thumbnail: this.target.thumbnail,
    };
  }
  get childrenData(): model.FileItemModel[] {
    return this.children.map((item) => {
      return item.target;
    });
  }
  async rename(name: string): Promise<boolean> {
    if (this.name != name && !(await this._findByName(name))) {
      const res = await kernel.anystore.bucketOpreate<FileItemModel>({
        name: name,
        shareDomain: 'user',
        key: this._formatKey(),
        operate: BucketOpreates.Rename,
      });
      if (res.success && res.data) {
        this.target = res.data;
        this.key = res.data.key;
        this.name = res.data.name;
        return true;
      }
    }
    return false;
  }
  async create(name: string): Promise<IObjectItem> {
    const exist = await this._findByName(name);
    if (!exist) {
      const res = await kernel.anystore.bucketOpreate<FileItemModel>({
        shareDomain: 'user',
        key: this._formatKey(name),
        operate: BucketOpreates.Create,
      });
      if (res.success && res.data) {
        this.target.hasSubDirectories = true;
        const node = new FileSystemItem(res.data, this);
        this.children.push(node);
        return node;
      }
    }
    return exist;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.anystore.bucketOpreate<FileItemModel[]>({
      shareDomain: 'user',
      key: this._formatKey(),
      operate: BucketOpreates.Delete,
    });
    if (res.success) {
      const index = this.parent?.children.findIndex((item) => {
        return item.key == this.key;
      });
      if (index != undefined && index > -1) {
        this.parent?.children.splice(index, 1);
      }
      return true;
    }
    return false;
  }
  async copy(destination: IFileSystemItem): Promise<boolean> {
    if (destination.target.isDirectory && this.key != destination.key) {
      const res = await kernel.anystore.bucketOpreate<FileItemModel[]>({
        shareDomain: 'user',
        key: this._formatKey(),
        destination: destination.key,
        operate: BucketOpreates.Copy,
      });
      if (res.success) {
        destination.target.hasSubDirectories = true;
        destination.children.push(this._newItemForDes(this, destination));
        return true;
      }
    }
    return false;
  }
  async move(destination: IFileSystemItem): Promise<boolean> {
    if (destination.target.isDirectory && this.key != destination.key) {
      const res = await kernel.anystore.bucketOpreate<FileItemModel[]>({
        shareDomain: 'user',
        key: this._formatKey(),
        destination: destination.key,
        operate: BucketOpreates.Move,
      });
      if (res.success) {
        const index = this.parent?.children.findIndex((item) => {
          return item.key == this.key;
        });
        if (index && index > -1) {
          this.parent?.children.splice(index, 1);
        }
        destination.target.hasSubDirectories = true;
        destination.children.push(this._newItemForDes(this, destination));
        return true;
      }
    }
    return false;
  }
  async loadChildren(reload: boolean = false): Promise<boolean> {
    if (this.target.isDirectory && (reload || this.children.length < 1)) {
      const res = await kernel.anystore.bucketOpreate<FileItemModel[]>({
        shareDomain: 'user',
        key: this._formatKey(),
        operate: BucketOpreates.List,
      });
      if (res.success && res.data.length > 0) {
        this.children = res.data.map((item) => {
          return new FileSystemItem(item, this);
        });
        return true;
      }
    }
    return false;
  }
  async upload(name: string, file: Blob, p?: OnProgressType): Promise<IObjectItem> {
    const exist = await this._findByName(name);
    if (!exist) {
      p?.apply(this, [0]);
      const task: TaskModel = {
        name: name,
        finished: 0,
        size: file.size,
        createTime: new Date(),
        group: this.name,
      };
      FileSystemItem._taskList.push(task);
      let data: BucketOpreateModel = {
        shareDomain: 'user',
        key: this._formatKey(name),
        operate: BucketOpreates.Upload,
      };
      const id = generateUuid();
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
        const res = await kernel.anystore.bucketOpreate<FileItemModel>(data);
        if (!res.success) {
          data.operate = BucketOpreates.AbortUpload;
          await kernel.anystore.bucketOpreate<boolean>(data);
          task.finished = -1;
          p?.apply(this, [-1]);
          return;
        }
        index++;
        task.finished = end;
        p?.apply(this, [end]);
        if (end === file.size && res.data) {
          const node = new FileSystemItem(res.data, this);
          this.children.push(node);
          return node;
        }
      }
    }
    return exist;
  }
  download(path: string, onProgress: OnProgressType): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /**
   * 格式化key,主要针对路径中的中文
   * @returns 格式化后的key
   */
  private _formatKey(subName: string = '') {
    if (!this.target.key && !subName) {
      return '';
    }
    try {
      let keys = !this.target.key ? [] : [this.target.key];
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
  private async _findByName(name: string): Promise<IObjectItem> {
    await this.loadChildren();
    for (const item of this.children) {
      if (item.name === name) {
        return item;
      }
    }
    return;
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
      {
        name: source.name,
        dateCreated: new Date(),
        dateModified: new Date(),
        size: source.target.size,
        shareLink: source.target.shareLink,
        extension: source.target.extension,
        thumbnail: source.target.thumbnail,
        key: destination.key + '/' + source.name,
        isDirectory: source.target.isDirectory,
        contentType: source.target.contentType,
        hasSubDirectories: source.target.hasSubDirectories,
      },
      destination,
    );
    for (const item of source.children) {
      node.children.push(this._newItemForDes(item, node));
    }
    return node;
  }
}

/** 获取文件系统的根 */
export const getFileSysItemRoot = () => {
  FileSystemItem._taskList = [];
  return new FileSystemItem(
    {
      key: '',
      size: 0,
      name: '根目录',
      isDirectory: true,
      extension: '',
      thumbnail: '',
      shareLink: '',
      contentType: '',
      hasSubDirectories: true,
      dateCreated: new Date(),
      dateModified: new Date(),
    },
    undefined,
  );
};
