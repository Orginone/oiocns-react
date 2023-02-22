import { Emitter } from '@/ts/base/common';
import {
  DomainTypes,
  emitter,
  getFileSysItemRoot,
  IFileSystemItem,
  IObjectItem,
} from '@/ts/core';
/**
 * 仓库控制器
 */
class StoreController extends Emitter {
  private _tabIndex: string = '1';
  public currentKey: string = '';
  private _home: IObjectItem;
  private _root: IFileSystemItem = getFileSysItemRoot();
  constructor() {
    super();
    emitter.subscribePart(DomainTypes.User, () => {
      this._root = getFileSysItemRoot();
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
  /** 页面Tab控制序列 */
  public get tabIndex() {
    return this._tabIndex;
  }
  public setTabIndex(index: string): void {
    this._tabIndex = index;
    this.changCallback();
  }
}

export default new StoreController();
