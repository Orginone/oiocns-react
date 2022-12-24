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
  private _caches: string[] = [];
  private _customMenus: TreeType[] = [];

  get products(): IProduct[] {
    return this._target?.ownProducts ?? [];
  }

  get curProduct(): IProduct | undefined {
    return this._current;
  }

  get alwaysUseApps(): IProduct[] {
    const result: IProduct[] = [];
    this._caches.forEach((a) => {
      let prod = this._target.ownProducts.find((p) => p.id == a);
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
      this.changCallback();

      /** 订阅常用应用 */
      kernel.anystore.subscribed(STORE_RECENTLY_APPS, 'user', (data: string[]) => {
        if (data.length > 0) {
          this._caches = data;
        } else {
          this._caches = [];
        }
        this.changCallback();
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
    });
  }

  /**
   * 设置当前应用
   * @param prod 应用
   * @param cache 是否添加至常用应用
   */
  public setCurProduct(prod: IProduct, cache?: boolean): void {
    this._current = prod;
    if (cache) {
      this._caches = this._caches.filter((i) => i != prod.id);
      this._caches.unshift(prod.id);
      this._caches = this._caches.slice(0, 7);
      kernel.anystore.set(
        STORE_RECENTLY_APPS,
        {
          operation: 'replaceAll',
          data: this._caches,
        },
        'user',
      );
    }
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
