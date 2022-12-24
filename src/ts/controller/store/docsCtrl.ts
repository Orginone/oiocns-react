import {
  IFileSystemItem,
  IObjectItem,
  getFileSysItemRoot,
  DomainTypes,
  emitter,
} from '@/ts/core/';
import { Emitter } from '@/ts/base/common';
/** 任务模型 */
export type TaskModel = {
  group: string;
  name: string;
  size: number;
  finished: number;
  createTime: Date;
};
/**
 * 文档控制器
 */
class DocsController extends Emitter {
  private _home: IObjectItem;
  private _root: IFileSystemItem = getFileSysItemRoot();
  private _taskList: TaskModel[] = [];
  constructor() {
    super();
    emitter.subscribePart(DomainTypes.User, () => {
      this._root = getFileSysItemRoot();
      this._taskList = [];
      setTimeout(async () => {
        this._home = await this._root.create('主目录');
        this.changCallback();
      }, 200);
    });
  }
  /** 根目录 */
  public get root(): IFileSystemItem {
    return this._root;
  }
  /** 主目录 */
  public get home(): IObjectItem {
    return this._home;
  }
  /** 任务列表 */
  public get taskList(): TaskModel[] {
    return this._taskList;
  }
  /**
   * 上传文件
   * @param key 上传的位置唯一标识
   * @param name 文件名
   * @param file 文件内容
   * @returns 文件对象
   */
  public async upload(
    item: IFileSystemItem,
    name: string,
    file: Blob,
    callback?: Function,
  ): Promise<IObjectItem> {
    if (item) {
      const task: TaskModel = {
        name: name,
        finished: 0,
        size: file.size,
        createTime: new Date(),
        group: item.name,
      };
      return await item.upload(name, file, (p) => {
        task.finished = p;
        callback?.apply(this, [task]);
        if (p === 0) {
          this._taskList.push(task);
        } else if (p === file.size) {
          this.changCallback();
        }
        this.changCallbackPart('taskList');
      });
    }
    return;
  }
}

export default new DocsController();
