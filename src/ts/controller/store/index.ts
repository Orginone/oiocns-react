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
}

export default new StoreController();
