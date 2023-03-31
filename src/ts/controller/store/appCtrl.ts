import { STORE_RECENTLY_APPS, STORE_USER_MENU } from '@/constants/const';
import { kernel } from '@/ts/base';
import { Emitter } from '@/ts/base/common';
import { DomainTypes, emitter, IProduct, ISpace } from '@/ts/core';
import userCtrl from '../setting';

export interface TreeType {
  title: string;
  key: string;
  id: string;
  // type: 'app' | 'docx' | 'assets' | 'data'; //可扩展
  type?: string;
  items: string[];
  children: TreeType[];
  icon?: any;
}

class AppController extends Emitter {
  /** 当前操作应用 */
  private _current: IProduct | undefined;
  /** 市场操作对象 */
  private _target: ISpace;
  private _caches: any[] = [];
  private _commonAppMap: any = {};
  private _customMenus: TreeType[] = [];

  get commonAppMap(): any {
    return this._commonAppMap;
  }

  get caches(): any[] {
    return this._caches;
  }

  get products(): IProduct[] {
    return this._target?.ownProducts ?? [];
  }

  get curProduct(): IProduct | undefined {
    return this._current;
  }

  get alwaysUseApps(): IProduct[] {
    const result: IProduct[] = [];
    this._caches.forEach((a) => {
      let prod = this._target.ownProducts.find((p) => p.id == a.key);
      if (prod) {
        result.push(prod);
      }
    });
    return result;
  }

  get spacies(): TreeType[] {
    return this._customMenus;
  }

  constructor() {
    super();
    this._target = userCtrl.space;
    emitter.subscribePart([DomainTypes.User, DomainTypes.Company], async () => {
      this._target = userCtrl.space;
      await this._target.getOwnProducts(true);
      /** 订阅常用应用 */
      kernel.anystore.subscribed(STORE_RECENTLY_APPS, 'user', (map: any) => {
        this._commonAppMap = map;
        this._caches = map[userCtrl.space.id] || [];
        this.changCallbackPart(STORE_RECENTLY_APPS);
      });

      /* 获取 历史缓存的 自定义目录 */
      kernel.anystore.subscribed(STORE_USER_MENU, 'user', (data: TreeType[]) => {
        if (data.length > 0) {
          this._customMenus = data;
        } else {
          this._customMenus = [];
        }
        this.changCallbackPart(STORE_USER_MENU);
      });
      this.changCallback();
    });
  }

  /**
   * 设置当前应用
   * @param prod 应用
   * @param cache 是否添加至常用应用
   */
  public setCurProduct(prod: IProduct): void {
    this._current = prod;
  }

  public async setCommon(app: any, setCommon: boolean = true) {
    this._caches = this._caches.filter((i) => i.key != app.key);
    if (setCommon) {
      this._caches.unshift(app);
    }
    this._caches = this._caches.slice(0, 10);
    this.commonAppMap[userCtrl.space.id] = this._caches;
    this.changCallbackPart(STORE_RECENTLY_APPS);
    await kernel.anystore.set(
      STORE_RECENTLY_APPS,
      {
        operation: 'replaceAll',
        data: this.commonAppMap,
      },
      'user',
    );
  }

  /**
   * 设置自定义目录
   * @param message 新消息，无则为空
   */
  public setCustomMenu(data: TreeType[]): void {
    this._customMenus = data;
    this.changCallbackPart(STORE_USER_MENU);
    kernel.anystore.set(
      STORE_USER_MENU,
      {
        operation: 'replaceAll',
        data: {
          data: this._customMenus,
        },
      },
      'user',
    );
  }
}

export default new AppController();
