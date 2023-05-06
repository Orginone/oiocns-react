import { common, kernel, model, parseAvatar, schema } from '../../../base';
import { PageAll, ShareIdSet } from '../../public/consts';
import { ITarget } from '../../target/base/target';

/** 分类的抽象接口 */
export interface ISpeciesItem extends common.IEntity {
  /** 数据实体 */
  metadata: schema.XSpecies;
  /** 当前加载分类的用户 */
  current: ITarget;
  /** 支持的类别类型 */
  speciesTypes: string[];
  /** 父级类别 */
  parent: ISpeciesItem | undefined;
  /** 子级类别 */
  children: ISpeciesItem[];
  /** 共享信息 */
  share: model.ShareIcon;
  /** 删除 */
  delete(): Promise<boolean>;
  /** 更新 */
  update(data: model.SpeciesModel): Promise<boolean>;
  /** 创建子类 */
  create(data: model.SpeciesModel): Promise<ISpeciesItem | undefined>;
}

/** 分类的基类实现 */
export abstract class SpeciesItem extends common.Entity implements ISpeciesItem {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: ISpeciesItem) {
    super();
    this.parent = _parent;
    this.current = _current;
    this.metadata = _metadata;
    this.share = {
      name: this.metadata.name,
      typeName: this.metadata.typeName,
      avatar: parseAvatar(this.metadata.icon),
    };
    ShareIdSet.set(this.metadata.id, this.share);
  }
  share: model.ShareIcon;
  parent: ISpeciesItem | undefined;
  children: ISpeciesItem[] = [];
  current: ITarget;
  metadata: schema.XSpecies;
  speciesTypes: string[] = [];
  async delete(): Promise<boolean> {
    const res = await kernel.deleteSpecies({
      id: this.metadata.id,
      page: PageAll,
    });
    if (res.success) {
      if (this.parent) {
        this.parent.children = this.parent.children.filter((i) => i.key != this.key);
      } else {
        this.current.species = this.current.species.filter((i) => i.key != this.key);
      }
    }
    return res.success;
  }
  async update(data: model.SpeciesModel): Promise<boolean> {
    data.shareId = this.metadata.shareId;
    data.parentId = this.metadata.parentId;
    data.id = this.metadata.id;
    data.typeName = this.metadata.typeName;
    const res = await kernel.updateSpecies(data);
    if (res.success && res.data.id) {
      this.metadata = res.data;
      this.share = {
        name: this.metadata.name,
        typeName: this.metadata.typeName,
        avatar: parseAvatar(this.metadata.icon),
      };
    }
    return res.success;
  }
  async create(data: model.SpeciesModel): Promise<ISpeciesItem | undefined> {
    data.parentId = this.metadata.id;
    data.shareId = this.metadata.shareId;
    if (this.speciesTypes.includes(data.typeName)) {
      const res = await kernel.createSpecies(data);
      if (res.success && res.data.id) {
        const species = this.createChildren(res.data, this.current);
        if (species) {
          this.children.push(species);
          return species;
        }
      }
    }
  }
  createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    return undefined;
  }
}
