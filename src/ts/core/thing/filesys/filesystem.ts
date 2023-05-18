import { FileSystemItem, IFileSystemItem } from './filesysItem';
import { IBelong } from '../../target/base/belong';
import { generateUuid } from '@/ts/base/common';

/** 任务模型 */
export type TaskModel = {
  group: string;
  name: string;
  size: number;
  finished: number;
  createTime: Date;
};

/** 文件系统类型接口 */
export interface IFileSystem {
  /** 实体唯一键 */
  key: string;
  /** 归属用户 */
  belong: IBelong;
  /** 主目录 */
  home: IFileSystemItem;
  /** 上传任务列表 */
  taskList: TaskModel[];
  /** 任务变更通知 */
  onTaskChange(callback: (taskList: TaskModel[]) => void): void;
  /** 禁用通知 */
  unTaskChange(): void;
  /** 任务变更 */
  taskChanged(id: string, task: TaskModel): void;
}

/** 文件系统类型实现 */
export class FileSystem implements IFileSystem {
  constructor(_belong: IBelong) {
    this.key = generateUuid();
    this.belong = _belong;
    this._taskIdSet = new Map<string, TaskModel>();
    this.home = new FileSystemItem(this, {
      size: 0,
      key: '',
      name: '根目录',
      isDirectory: true,
      dateCreated: new Date(),
      dateModified: new Date(),
      hasSubDirectories: true,
    });
  }
  key: string;
  belong: IBelong;
  home: IFileSystemItem;
  private _taskIdSet: Map<string, TaskModel>;
  taskChangeNotify?: (taskList: TaskModel[]) => void;
  get taskList(): TaskModel[] {
    const result: TaskModel[] = [];
    this._taskIdSet.forEach((v) => result.push(v));
    return result;
  }
  onTaskChange(callback: (taskList: TaskModel[]) => void): void {
    this.taskChangeNotify = callback;
    callback(this.taskList);
  }
  unTaskChange(): void {
    this.taskChangeNotify = undefined;
  }
  taskChanged(id: string, task: TaskModel): void {
    this._taskIdSet.set(id, task);
    this.taskChangeNotify?.apply(this, [this.taskList]);
  }
}
