/**
 * 文件系统项数据模型
 */
export type FileItemModel = {
  /** 名称 */
  name: string;
  /** 完整路径 */
  key: string;
  /** 创建时间 */
  dateCreated: string;
  /** 修改时间 */
  dateModified: string;
  /** 是否是目录 */
  isDirectory: boolean;
  /** 是否包含子目录 */
  hasSubDirectories: boolean;
};

/**
 * 文件系统项接口
 */
export interface IFileSystemItem {
  /** 文件系统项对应的目标 */
  target: FileItemModel;
  /** 上级文件系统项 */
  parent: FileSystemItem | undefined;
  /** 下级文件系统项数组 */
  children: FileSystemItem[];
  /** 是否为根路径 */
  isRoot: boolean;
}

/**
 * 文件系统项实现
 */
export class FileSystemItem implements IFileSystemItem {
  isRoot: boolean;
  target: FileItemModel;
  children: FileSystemItem[];
  parent: FileSystemItem | undefined;
  constructor(target: FileItemModel, parent: FileSystemItem | undefined) {
    this.children = [];
    this.target = target;
    this.parent = parent;
    this.isRoot = parent === undefined;
  }
}
