import { STORE_COMMON_MENU } from '@/constants/const';
import { kernel } from '@/ts/base';
import { Emitter } from '@/ts/base/common';
import {
  DomainTypes,
  emitter,
  getFileSysItemRoot,
  IFileSystemItem,
  IObjectItem,
} from '@/ts/core';
import userCtrl from '../setting';
/**
 * 仓库控制器
 */
class StoreController extends Emitter {
  private _tabIndex: string = '1';
  public currentKey: string = '';
  private _home: IObjectItem;
  private _root: IFileSystemItem = getFileSysItemRoot();
  private _caches: any[] = [];
  private _commonMenuMap: any = {};
  constructor() {
    super();
    emitter.subscribePart([DomainTypes.User, DomainTypes.Company], () => {
      this._root = getFileSysItemRoot();
      /** 订阅仓库常用操作 */
      kernel.anystore.subscribed(userCtrl.space.id, STORE_COMMON_MENU, (map: any) => {
        this._commonMenuMap = map;
        this._caches = map[userCtrl.space.id] || [];
        this.changCallbackPart(STORE_COMMON_MENU);
      });
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

  get commonMenuMap(): any {
    return this._commonMenuMap;
  }

  get caches(): any[] {
    return this._caches;
  }
  public setTabIndex(index: string): void {
    this._tabIndex = index;
    this.changCallback();
  }

  public async setCommon(menu: any, setCommon: boolean = true) {
    this._caches = this._caches.filter(
      (i) => i.key.replace('copy', '') != menu.key.replace('copy', ''),
    );
    if (setCommon) {
      this._caches.unshift(menu);
    }
    this._caches = this._caches.slice(0, 10);
    this._commonMenuMap[userCtrl.space.id] = this._caches;
    let result = await kernel.anystore.set(userCtrl.space.id, STORE_COMMON_MENU, {
      operation: 'replaceAll',
      data: this._commonMenuMap,
    });
    console.log(result);
    this.changCallbackPart(STORE_COMMON_MENU);
  }
}

export default new StoreController();
