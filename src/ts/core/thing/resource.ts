import { Collection } from './collection';
import { schema } from '../../base';

/** 数据核资源（前端开发） */
export class DataResource {
  constructor(id: string) {
    this.formColl = new Collection<schema.XForm>(id, 'standard-form');
    this.propertyColl = new Collection<schema.XProperty>(id, 'standard-property');
    this.speciesColl = new Collection<schema.XSpecies>(id, 'standard-species');
    this.speciesItemColl = new Collection<schema.XSpeciesItem>(
      id,
      'standard-speciesItem',
    );
    this.applicationColl = new Collection<schema.XApplication>(
      id,
      'standard-application',
    );
    this.directoryColl = new Collection<schema.XDirectory>(id, 'resource-directory');
  }
  /** 表单集合 */
  formColl: Collection<schema.XForm>;
  /** 属性集合 */
  propertyColl: Collection<schema.XProperty>;
  /** 分类集合 */
  speciesColl: Collection<schema.XSpecies>;
  /** 类目集合 */
  speciesItemColl: Collection<schema.XSpeciesItem>;
  /** 应用集合 */
  applicationColl: Collection<schema.XApplication>;
  /** 资源目录集合 */
  directoryColl: Collection<schema.XDirectory>;
  /** 资源预加载 */
  async preLoad(): Promise<void> {
    Promise.all([
      this.formColl.all(),
      this.speciesColl.all(),
      this.propertyColl.all(),
      this.directoryColl.all(),
      this.applicationColl.all(),
    ]);
  }
}
