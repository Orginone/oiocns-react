import { kernel } from '@/ts/base';
import { Emitter } from '@/ts/base/common';
import { DomainTypes, emitter, IMTarget, IProduct } from '@/ts/core';
import userCtrl from '../setting/userCtrl';
const AppStoreName = 'AppStore';

export interface TreeType {
  title: string;
  key: string;
  id: string;
  children: TreeType[];
}

export interface AppCache {
  alwaysUseIds: string[];
  species?: {
    spaceId: string;
    species: TreeType[];
  };
}

class AppController extends Emitter {
  private _curProdId: string;
  /** 市场操作对象 */
  private _target: IMTarget | undefined;
  private _caches: AppCache;
  constructor() {
    super();
    this._curProdId = '';
    this._caches = {
      alwaysUseIds: [],
    };
    emitter.subscribePart([DomainTypes.User, DomainTypes.Company], () => {
      setTimeout(async () => {
        await this._initialization();
      }, 200);
    });
  }

  get products(): IProduct[] {
    return this._target?.ownProducts ?? [];
  }

  get curProduct(): IProduct | undefined {
    if (this._target) {
      for (const item of this._target.ownProducts) {
        if (item.prod.id === this._curProdId) {
          return item;
        }
      }
    }
    return undefined;
  }

  get alwaysUseApps(): IProduct[] {
    const result: IProduct[] = [];
    if (this._caches && this._target && this._caches.alwaysUseIds) {
      for (const id of this._caches.alwaysUseIds) {
        for (const item of this._target.ownProducts) {
          if (item.prod.id === id) {
            result.push(item);
          }
        }
      }
    }
    return result;
  }

  get spacies(): TreeType[] {
    if (this._caches.species) {
      if (this._caches.species[userCtrl.space.target.id]) {
        return this._caches.species[userCtrl.space.target.id];
      }
    }
    return [];
  }

  public setCurProduct(id?: string, cache: boolean = false): void {
    if (!id) {
      this._curProdId = '';
    } else if (this._target) {
      this._curProdId = id;
      if (cache && this._caches) {
        this._caches.alwaysUseIds = this._caches.alwaysUseIds.filter((i) => i != id);
        this._caches.alwaysUseIds.unshift(id);
        this._caches.alwaysUseIds = this._caches.alwaysUseIds.slice(0, 7);
        this._cacheUserData();
      }
    }
  }

  private async _initialization() {
    this._target = userCtrl.space;
    await this._target.getOwnProducts(true);
    this.changCallback();
    kernel.anystore.subscribed(AppStoreName, 'user', (data: AppCache) => {
      if (data.alwaysUseIds) {
        this._caches.alwaysUseIds = data.alwaysUseIds;
      }
      if (data.species) {
        this._caches.species = data.species;
      }
      this.changCallback();
    });
  }

  private _cacheUserData(): void {
    kernel.anystore.set(
      AppStoreName,
      {
        operation: 'replaceAll',
        data: this._caches,
      },
      'user',
    );
  }
}

export default new AppController();
