import { STORE_USER_MENU } from '@/constants/const';
import { kernel } from '@/ts/base';
import { Emitter } from '@/ts/base/common';
import { DomainTypes, emitter, IMTarget, IProduct } from '@/ts/core';
import userCtrl from '../setting/userCtrl';
const AppStoreName = 'AppStore';

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
interface SpeciesType {
  spaceId: string;
  species: TreeType[];
}
interface RecMsg<T> {
  Key: string;
  Name: string;
  UpdateTime: string;
  data: T;
}
export interface AppCache {
  alwaysUseIds: string[];
  species?: {
    spaceId: string;
    species: TreeType[];
  };
}
const defaultCustomCategory: TreeType[] = [
  {
    title: '应用',
    key: 'app',
    id: '1',
    items: [],
    children: [],
  },
  {
    title: '文档',
    key: 'doc',
    id: '2',
    items: [],
    children: [],
  },
  // {
  //   title: '数据',
  //   key: 'data',
  //   id: '3',
  //   children: [],
  // },
  // {
  //   title: '资源',
  //   key: 'assets',
  //   id: '4',
  //   children: [],
  // },
];

class AppController extends Emitter {
  private _curProdId: string;
  /** 市场操作对象 */
  private _target: IMTarget | undefined;
  private _caches: AppCache;
  private _customMenus: SpeciesType = { spaceId: '', species: [] };
  constructor() {
    super();
    this._curProdId = '';
    this._caches = {
      alwaysUseIds: [],
    };
    emitter.subscribePart([DomainTypes.User, DomainTypes.Company], () => {
      setTimeout(async () => {
        let spaceId = userCtrl.isCompanySpace
          ? userCtrl.space.target.id
          : userCtrl.user.target.id;
        this._customMenus.spaceId = spaceId;

        await this._initialization();
      }, 200);
    });
  }

  get products(): IProduct[] {
    return this._target?.ownProducts ?? [];
  }

  get curProduct(): IProduct | undefined {
    if (this._target) {
      return this._target.ownProducts.find((v) => v.prod.id == this._curProdId);
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
    // if (this._caches.species) {
    //   if (this._caches.species[userCtrl.space.target.id]) {
    //     return this._caches.species[userCtrl.space.target.id];
    //   }
    // }
    return this._customMenus.species || [];
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
      // if (data.species) {
      //   this._caches.species = data.species;
      // } else {
      //   let spaceId = userCtrl.isCompanySpace
      //     ? userCtrl.space.target.id
      //     : userCtrl.user.target.id;
      //   this._caches.species = { spaceId, species: defaultCustomCategory };
      // }
      this.changCallback();
    });
    /* 获取 历史缓存的 自定义目录 */
    kernel.anystore.subscribed(
      STORE_USER_MENU + this._customMenus.spaceId,
      'user',
      (Msg: RecMsg<SpeciesType>) => {
        const { data } = Msg;
        this._customMenus.species =
          Array.isArray(data?.species) && data.species.length > 0
            ? data.species
            : defaultCustomCategory;
        this.changCallbackPart(STORE_USER_MENU);
      },
    );
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

  /**
   * 缓存自定义目录
   * @param message 新消息，无则为空
   */
  public cacheCustomMenu(data: TreeType[]): void {
    console.log('缓存触发', data);
    if (!Array.isArray(data)) {
      return console.error('缓存自定义目录格式有误,请重试');
    }
    this._customMenus.species = data || defaultCustomCategory;
    this.changCallbackPart(STORE_USER_MENU);
    kernel.anystore.set(
      STORE_USER_MENU + this._customMenus.spaceId,
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
