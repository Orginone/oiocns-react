import { Collection } from './collection';
import {
  XApplication,
  XDirectory,
  XForm,
  XProperty,
  XSpecies,
  XSpeciesItem,
} from '../../base/schema';

/** 数据核资源（前端开发） */
export class DataResource {
  constructor(belongId: string, shareId: string) {
    this.formColl = new Collection<XForm>(belongId, shareId, 'standard-form');
    this.propertyColl = new Collection<XProperty>(belongId, shareId, 'standard-property');
    this.speciesColl = new Collection<XSpecies>(belongId, shareId, 'standard-species');
    this.speciesItemColl = new Collection<XSpeciesItem>(
      belongId,
      shareId,
      'standard-species-item',
    );
    this.applicationColl = new Collection<XApplication>(
      belongId,
      shareId,
      'standard-application',
    );
    this.directoryColl = new Collection<XDirectory>(
      belongId,
      shareId,
      'resource-directory',
    );
  }
  /** 表单集合 */
  formColl: Collection<XForm>;
  /** 属性集合 */
  propertyColl: Collection<XProperty>;
  /** 分类集合 */
  speciesColl: Collection<XSpecies>;
  /** 类目集合 */
  speciesItemColl: Collection<XSpeciesItem>;
  /** 应用集合 */
  applicationColl: Collection<XApplication>;
  /** 资源目录集合 */
  directoryColl: Collection<XDirectory>;
  /** 资源预加载 */
  async preLoad(): Promise<void> {
    await Promise.all([
      this.formColl.all(),
      this.speciesColl.all(),
      this.propertyColl.all(),
      this.directoryColl.all(),
      this.applicationColl.all(),
    ]);
  }
}
