import { IFileSystemItem, IObjectItem, rootDir, DomainTypes, emitter } from '@/ts/core/';
import { Emitter } from '@/ts/base/common';
/** 任务模型 */
export type TaskModel = {
  group: string;
  name: string;
  size: number;
  finished: number;
  createTime: Date;
};
const homeName = '主目录';
/**
 * 文档控制器
 */
class DocsController extends Emitter {
  private _curKey: string;
  private _home: IObjectItem;
  private _root: IFileSystemItem;
  private _taskList: TaskModel[];
  constructor() {
    super();
    this._root = rootDir;
    this._taskList = [];
    this._curKey = this._root.key;
    emitter.subscribePart(DomainTypes.User, () => {
      this._root = rootDir;
      this._root.children = [];
      this._taskList = [];
      this._curKey = this._root.key;
      setTimeout(async () => {
        this._home = await this._root.create(homeName);
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
  /** 当前目录 */
  public get current(): IObjectItem {
    return this.refItem(this._curKey);
  }
  /** 任务列表 */
  public get taskList(): TaskModel[] {
    return this._taskList;
  }
  /**
   * 根据key查找节点
   * @param key 唯一标识
   */
  public refItem(key: string): IObjectItem {
    return this._search(this._root, key);
  }
  /** 返回上一级 */
  public backup() {
    if (this.current && this.current.parent) {
      this._curKey = this.current.parent.key;
      this.changCallback();
    }
  }
  /**
   * 打开文件系统项
   *
   * @param key 唯一标识
   */
  public async open(key: string): Promise<void> {
    const item = this.refItem(key);
    if (item) {
      if (item.target.isDirectory) {
        await item.loadChildren(false);
        this._curKey = item.key;
        this.changCallback();
      }
    }
  }
  /**
   * 上传文件
   * @param key 上传的位置唯一标识
   * @param name 文件名
   * @param file 文件内容
   * @returns 文件对象
   */
  public async upload(
    key: string,
    name: string,
    file: Blob,
    callback?: Function,
  ): Promise<IObjectItem> {
    const item = this.refItem(key);
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
  /**
   * 树结构搜索
   * @param item 文件系统项
   * @param key 唯一标识
   * @returns
   */
  private _search(item: IFileSystemItem, key: string): IObjectItem {
    if (item.key === key) {
      return item;
    }
    for (const i of item.children) {
      const res = this._search(i, key);
      if (res) {
        return res;
      }
    }
  }
}

export default new DocsController();
