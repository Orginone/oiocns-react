import { model, kernel } from '../../base';
import { IFileSystemItem, IObjectItem } from './ifilesys';
/**
 * 文件系统项实现
 */
export class FileSystemItem implements IFileSystemItem {
  key: string;
  name: string;
  isRoot: boolean;
  extension: string;
  target: model.FileItemModel;
  parent: IObjectItem;
  children: IFileSystemItem[];
  constructor(target: model.FileItemModel, parent: IObjectItem) {
    this.extension = '';
    this.children = [];
    this.target = target;
    this.parent = parent;
    this.key = target.key;
    this.name = target.name;
    this.isRoot = parent === undefined;
    this._analysisExtension();
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
      const res = await kernel.anystore.objectRename(
        this._formatKey(),
        name,
        this.target.isDirectory,
        'user',
      );
      if (res.success) {
        this.key = this.key.replace(this.name, '');
        if (this.key.endsWith('/')) {
          this.key = this.key.substring(0, this.key.length - 1);
        }
        this.name = name;
        this.target.key = this.key;
        this._analysisExtension();
        return true;
      }
    }
    return false;
  }
  async create(name: string): Promise<boolean> {
    if (!this.findByName(name)) {
      const res = await kernel.anystore.objectCreate(this._formatKey(name), 'user');
      if (res.success && res.data) {
        this.children.push(
          new FileSystemItem(
            {
              name: name,
              isDirectory: true,
              hasSubDirectories: false,
              dateCreated: new Date(),
              dateModified: new Date(),
              key: this.key + '/' + name,
            },
            this,
          ),
        );
        return true;
      }
    }
    return false;
  }
  async copy(destination: IFileSystemItem): Promise<boolean> {
    if (destination.target.isDirectory && this.key != destination.key) {
      const res = await kernel.anystore.objectCopy(
        this._formatKey(),
        destination.key,
        destination.target.isDirectory,
        'user',
      );
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
      const res = await kernel.anystore.objectMove(
        this._formatKey(),
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
        destination.target.hasSubDirectories = true;
        destination.children.push(this._newItemForDes(this, destination));
        return true;
      }
    }
    return false;
  }
  async loadChildren(reload: boolean = false): Promise<boolean> {
    if (this.target.isDirectory && (reload || this.children.length < 1)) {
      const res = await kernel.anystore.objectList(this._formatKey(), 'user');
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
  /** 解析拓展名 */
  private _analysisExtension() {
    if (this.target.isDirectory) {
      this.extension = '';
    } else {
      const index = this.name.lastIndexOf('.');
      if (index < 0) {
        this.extension = 'file';
      } else {
        this.extension = this.name.substring(index + 1);
      }
    }
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
        key: source.key + '/' + source.name,
        isDirectory: source.target.isDirectory,
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
