import { model, kernel } from '../../base';
import { IFileSystemItem } from './ifilesys';
/**
 * 文件系统项实现
 */
export class FileSystemItem implements IFileSystemItem {
  key: string;
  isRoot: boolean;
  isOpened: boolean;
  target: model.FileItemModel;
  parent: IFileSystemItem | undefined;
  children: IFileSystemItem[];
  constructor(target: model.FileItemModel, parent: IFileSystemItem | undefined) {
    this.key = target.key;
    this.children = [];
    this.target = target;
    this.parent = parent;
    this.isRoot = parent === undefined;
    this.isOpened = this.isRoot;
  }
  async rename(name: string): Promise<boolean> {
    if (this.target.name != name) {
      const index = this.children.findIndex((item) => {
        return item.target.name === name;
      });
      if (index === -1) {
        const res = await kernel.anystore.objectRename(
          this.formatKey(),
          name,
          this.target.isDirectory,
          'user',
        );
        if (res.success) {
          this.key = this.key.replace(this.target.name, '');
          if (this.key.endsWith('/')) {
            this.key = this.key.substring(0, this.key.length - 1);
          }
          this.target.name = name;
          this.target.key = this.key;
          return true;
        }
      }
    }
    return false;
  }
  async create(name: string): Promise<boolean> {
    const index = this.children.findIndex((item) => {
      return item.target.name === name;
    });
    if (index === -1) {
      const res = await kernel.anystore.objectCreate(this.formatKey(name), 'user');
      if (res.success && res.data) {
        this.children.push(new FileSystemItem(res.data, this));
        return true;
      }
    }
    return false;
  }
  async copy(destination: IFileSystemItem): Promise<boolean> {
    if (destination.target.isDirectory && this.key != destination.key) {
      const res = await kernel.anystore.objectCopy(
        this.formatKey(),
        destination.key,
        destination.target.isDirectory,
        'user',
      );
      if (res.success) {
        destination.children.push(this);
        return true;
      }
    }
    return false;
  }
  async move(destination: IFileSystemItem): Promise<boolean> {
    if (destination.target.isDirectory && this.key != destination.key) {
      const res = await kernel.anystore.objectMove(
        this.formatKey(),
        destination.key,
        destination.target.isDirectory,
        'user',
      );
      if (res.success) {
        const index = this.parent?.children.findIndex((item) => {
          return item.key == this.key;
        });
        if (index && index > -1) {
          this.parent?.children.splice(index, 1);
        }
        destination.children.push(this);
        return true;
      }
    }
    return false;
  }
  async loadChildren(reload: boolean = false): Promise<boolean> {
    if (this.target.isDirectory && (reload || this.children.length < 1)) {
      const res = await kernel.anystore.objects(this.formatKey(), 'user');
      if (res.success && res.data.length > 0) {
        this.children = res.data.map((item) => {
          return new FileSystemItem(item, this);
        });
      }
    }
    return false;
  }
  /**
   * 格式化key,主要针对路径中的中文
   * @returns 格式化后的key
   */
  private formatKey(subName: string = '') {
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
}
