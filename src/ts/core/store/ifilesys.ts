import { FileItemModel, FileItemShare } from '../../base/model';

/** 可为空的文件系统 */
export type IObjectItem = IFileSystemItem | undefined;
/** 可为空的进度回调 */
export type OnProgressType = (p: number) => void | undefined;
/** 任务模型 */
export type TaskModel = {
  group: string;
  name: string;
  size: number;
  finished: number;
  createTime: Date;
};
/**
 * 文件系统项接口
 */
export interface IFileSystemItem {
  /** 主键,唯一 */
  key: string;
  /** 名称 */
  name: string;
  /** 是否为根路径 */
  isRoot: boolean;
  /** 文件系统项对应的目标 */
  target: FileItemModel;
  /** 上级文件系统项 */
  parent: IObjectItem;
  /** 下级文件系统项数组 */
  children: IFileSystemItem[];
  /** 下级文件系统数据 */
  childrenData: FileItemModel[];
  /** 上传任务列表 */
  taskList: TaskModel[];
  /**
   * 分享信息
   */
  shareInfo(): FileItemShare;
  /**
   * 创建文件系统项（目录）
   * @param name 文件系统项名称
   */
  create(name: string): Promise<IObjectItem>;
  /**
   * 删除文件系统项（目录）
   */
  delete(): Promise<boolean>;
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
  loadChildren(reload?: boolean): Promise<boolean>;
  /**
   * 上传文件
   * @param name 文件名
   * @param id 唯一id
   * @param file 文件内容
   * @param {OnProgressType} onProgress 进度回调
   */
  upload(name: string, file: Blob, onProgress?: OnProgressType): Promise<IObjectItem>;
  /**
   * 下载文件
   * @param path 下载保存路径
   * @param onProgress 进度回调
   */
  download(path: string, onProgress: OnProgressType): Promise<void>;
}
