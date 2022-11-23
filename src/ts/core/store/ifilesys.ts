import { FileItemModel } from '../../base/model';

/**
 * 文件系统项接口
 */
export interface IFileSystemItem {
  /** 主键,唯一 */
  key: string;
  /** 是否为根路径 */
  isRoot: boolean;
  /** 是否已打开 */
  isOpened: boolean;
  /** 文件系统项对应的目标 */
  target: FileItemModel;
  /** 上级文件系统项 */
  parent: IFileSystemItem | undefined;
  /** 下级文件系统项数组 */
  children: IFileSystemItem[];
  /**
   * 创建文件系统项（目录）
   * @param name 文件系统项名称
   */
  create(name: string): Promise<boolean>;
  /**
   * 重命名
   * @param name 新名称
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
  loadChildren(reload: boolean): Promise<boolean>;
}
