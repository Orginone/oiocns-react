import Provider from '../../core/provider';
import { FileSystemItem } from '../../core/store/filesys';
import { IFileSystemItem } from '../../core/store/ifilesys';
import BaseController from '../baseCtrl';

export type IObjectItem = IFileSystemItem | undefined;
/**
 * 文档控制器
 */
class DocsController extends BaseController {
  _curKey: string;
  _root: IFileSystemItem;
  constructor() {
    super();
    this._root = new FileSystemItem(
      {
        key: '',
        name: '根目录',
        isDirectory: true,
        hasSubDirectories: true,
        dateCreated: '',
        dateModified: '',
      },
      undefined,
    );
    this._curKey = this._root.key;
    Provider.onSetPerson(async () => {
      await this.current?.loadChildren(true);
    });
  }
  /** 根目录 */
  public get root(): IFileSystemItem {
    return this._root;
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
