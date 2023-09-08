import { Collection } from './collection';
import {
  XApplication,
  XDirectory,
  XForm,
  XProperty,
  XSpecies,
  XSpeciesItem,
  Xbase,
} from '../../base/schema';
import { ActivityType } from '../../base/model';

/** 数据核资源（前端开发） */
export class DataResource {
  shareId: string;
  belongId: string;
  constructor(belongId: string, shareId: string) {
    this.shareId = shareId;
    this.belongId = belongId;
    this.formColl = this.genColl<XForm>('standard-form');
    this.speciesColl = this.genColl<XSpecies>('standard-species');
    this.activityColl = this.genColl<ActivityType>('resource-activity');
    this.propertyColl = this.genColl<XProperty>('standard-property');
    this.directoryColl = this.genColl<XDirectory>('resource-directory');
    this.applicationColl = this.genColl<XApplication>('standard-application');
    this.speciesItemColl = this.genColl<XSpeciesItem>('standard-species-item');
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
  /** 动态集合 */
  activityColl: Collection<ActivityType>;
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
  /** 生成类型的集合 */
  genColl<T extends Xbase>(collName: string): Collection<T> {
    return new Collection<T>(this.belongId, this.shareId, collName);
  }
}
