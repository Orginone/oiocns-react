import { model, kernel } from '../../base';
/**
 * 文件系统项接口
 */
export interface IFileSystemItem {
  /** 主键,唯一 */
  key: string;
  /** 是否为根路径 */
  isRoot: boolean;
  /** 文件系统项对应的目标 */
  target: model.FileItemModel;
  /** 上级文件系统项 */
  parent: FileSystemItem | undefined;
  /** 下级文件系统项数组 */
  children: FileSystemItem[];
  /**
   * 创建文件系统项（目录）
   * @param name 文件系统项名称
   */
  create(name: string): Promise<boolean>;
  /**
   * 移动文件系统项（目录）
   * @param {IFileSystemItem} destination 目标文件系统
   */
  move(destination: IFileSystemItem): Promise<boolean>;
  /**
   * 加载下级文件系统项数组
   * @param {boolean} reload 重新加载,默认false
   */
  loadChildren(reload: boolean): Promise<boolean>;
}

/**
 * 文件系统项实现
 */
export class FileSystemItem implements IFileSystemItem {
  key: string;
  isRoot: boolean;
  target: model.FileItemModel;
  parent: FileSystemItem | undefined;
  children: FileSystemItem[];
  constructor(target: model.FileItemModel, parent: FileSystemItem | undefined) {
    this.key = target.key;
    this.children = [];
    this.target = target;
    this.parent = parent;
    this.isRoot = parent === undefined;
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
    if (reload || this.children.length < 1) {
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
