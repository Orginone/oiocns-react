import { Emitter, logger } from '../../base/common';
import userCtrl from '../setting';
import {
  INullSpeciesItem,
  DomainTypes,
  emitter,
  loadSpeciesTree,
  ISpeciesItem,
} from '../../core/';
import { kernel, schema } from '@/ts/base';
import { badRequest, ResultType } from '@/ts/base/model';
import { Dict } from '@/ts/core/thing/dict';
import { Property } from '@/ts/core/thing/property';

/**
 * 物的控制器
 */
class ThingController extends Emitter {
  public species: INullSpeciesItem;
  public speciesList: ISpeciesItem[] = [];
  public dict: Dict | undefined;
  public property: Property | undefined;

  private lookForAll(data: any[], arr: any[]): any[] {
    for (let item of data) {
      arr.push(item);
      if (item.children && item.children.length) {
        this.lookForAll(item.children, arr);
      }
    }
    return arr;
  }

  constructor() {
    super();
    emitter.subscribePart([DomainTypes.Company], () => {
      this.dict = new Dict(userCtrl.space.id);
      this.property = new Property(userCtrl.space.id);
      setTimeout(async () => {
        await this.loadSpeciesTree(true);
      }, 100);
    });
  }

  /** 加载组织分类 */
  public async loadSpeciesTree(_reload: boolean = false): Promise<INullSpeciesItem> {
    if (this.species == undefined || _reload) {
      this.species = await loadSpeciesTree(userCtrl.space.id);
      this.speciesList = this.lookForAll([this.species], []);
      this.changCallback();
    }
    return this.species;
  }

  /** 根据id获取分类 */
  public async getSpeciesByIds(
    ids: string[],
    _reload: boolean = false,
  ): Promise<ISpeciesItem[]> {
    this.loadSpeciesTree(false);
    return this.speciesList.filter((item: any) => ids.includes(item.id));
  }

  public async createThing(data: any): Promise<ResultType<boolean>> {
    let res = await kernel.anystore.createThing(userCtrl.space.id, 1);
    if (res.success) {
      return await kernel.perfectThing({
        id: (res.data as [{ Id: string }])[0].Id,
        data: JSON.stringify(data),
        belongId: userCtrl.space.id,
      });
    } else {
      logger.error(res.msg);
      return badRequest();
    }
  }

  public async perfectThing(id: string, data: any): Promise<ResultType<boolean>> {
    return await kernel.perfectThing({
      id,
      data: JSON.stringify(data),
      belongId: userCtrl.space.id,
    });
  }

  public async loadFlowDefine(): Promise<ResultType<schema.XFlowDefineArray>> {
    return await kernel.queryDefine({
      spaceId: userCtrl.space.id,
    });
  }
}

export default new ThingController();
