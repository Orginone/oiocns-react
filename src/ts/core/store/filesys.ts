import { generateUuid } from '@/ts/base/common';
import { BucketOpreateModel, BucketOpreates, FileItemModel } from '@/ts/base/model';
import { model, kernel } from '../../base';
import { IFileSystemItem, IObjectItem, OnProgressType } from './ifilesys';
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
  constructor(target: model.FileItemModel, parent: IObjectItem) {
    this.children = [];
    this.target = target;
    this.parent = parent;
    this.key = target.key;
    this.name = target.name;
    this.isRoot = parent === undefined;
  }
  findByName(name: string): IObjectItem {
    for (const item of this.children) {
      if (item.name === name) {
        return item;
      }
    }
  }
  async rename(name: string): Promise<boolean> {
    if (this.name != name && !this.findByName(name)) {
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
  async create(name: string): Promise<boolean> {
    if (!this.findByName(name)) {
      const res = await kernel.anystore.bucketOpreate<FileItemModel>({
        shareDomain: 'user',
        key: this._formatKey(name),
        operate: BucketOpreates.Create,
      });
      if (res.success && res.data) {
        this.target.hasSubDirectories = true;
        this.children.push(new FileSystemItem(res.data, this));
        return true;
      }
    }
    return false;
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
    console.log('刷新树', this.target);
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
      }
    }
    return false;
  }
  async upload(name: string, file: Blob, onProgress: OnProgressType): Promise<void> {
    if (!this.findByName(name)) {
      onProgress?.apply(this, [0]);
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
        const buffer = await this._getNumberArray(file.slice(start, end));
        data.fileItem = {
          index: index,
          uploadId: id,
          size: file.size,
          data: buffer,
        };
        const res = await kernel.anystore.bucketOpreate<FileItemModel>(data);
        if (!res.success) {
          data.operate = BucketOpreates.AbortUpload;
          await kernel.anystore.bucketOpreate<boolean>(data);
          return;
        } else if (end === file.size && res.data) {
          this.children.push(new FileSystemItem(res.data, this));
        }
        index++;
        onProgress?.apply(this, [(end * 1.0) / file.size]);
      }
    }
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
  /** 获取文件内容 */
  private async _getNumberArray(file: Blob): Promise<number[]> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = new Uint8Array(reader.result as ArrayBuffer);
        resolve(Array.from<number>(result.values()));
      };
      reader.readAsArrayBuffer(file);
    });
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
        shareLink: source.target.shareLink,
        extension: source.target.extension,
        thumbnail: source.target.thumbnail,
        key: source.key + '/' + source.name,
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
