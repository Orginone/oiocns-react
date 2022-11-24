import Provider from '../../core/provider';
import { FileSystemItem } from '../../core/store/filesys';
import { IFileSystemItem, IObjectItem } from '../../core/store/ifilesys';
import BaseController from '../baseCtrl';
const homeName = '主目录';
/**
 * 文档控制器
 */
class DocsController extends BaseController {
  private _curKey: string;
  private _home: IObjectItem;
  private _root: IFileSystemItem;
  constructor() {
    super();
    this._root = new FileSystemItem(
      {
        key: '',
        name: '根目录',
        isDirectory: true,
        hasSubDirectories: true,
        dateCreated: new Date(),
        dateModified: new Date(),
      },
      undefined,
    );
    this._curKey = this._root.key;
    Provider.onSetPerson(async () => {
      await this._root.loadChildren(true);
      this._home = this._root.findByName(homeName);
      if (!this._home) {
        await this._root.create(homeName);
        this._home = this._root.findByName(homeName);
      }
      this.changCallback();
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
  /** 打开文件系统项 */
  public async open(key: string) {
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
   * 树结构搜多
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

export const docsCtrl = new DocsController();
