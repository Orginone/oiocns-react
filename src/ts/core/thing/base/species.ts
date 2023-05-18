import { kernel, model, schema } from '../../../base';
import { Entity, IEntity, PageAll } from '../../public';
import { ITarget } from '../../target/base/target';

/** 分类的抽象接口 */
export interface ISpeciesItem extends IEntity<schema.XSpecies> {
  /** 当前归属用户Id */
  belongId: string;
  /** 当前加载分类的用户 */
  current: ITarget;
  /** 支持的类别类型 */
  speciesTypes: string[];
  /** 父级类别 */
  parent: ISpeciesItem | undefined;
  /** 子级类别 */
  children: ISpeciesItem[];
  /** 是否为继承的类别 */
  isInherited: boolean;
  /** 删除 */
  delete(): Promise<boolean>;
  /** 更新 */
  update(data: model.SpeciesModel): Promise<boolean>;
  /** 创建子类 */
  create(data: model.SpeciesModel): Promise<ISpeciesItem | undefined>;
}

/** 分类的基类实现 */
export abstract class SpeciesItem
  extends Entity<schema.XSpecies>
  implements ISpeciesItem
{
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: ISpeciesItem) {
    super(_metadata);
    this.parent = _parent;
    this.current = _current;
    this.isInherited = _metadata.belongId != _current.space.metadata.belongId;
  }
  parent: ISpeciesItem | undefined;
  children: ISpeciesItem[] = [];
  current: ITarget;
  speciesTypes: string[] = [];
  isInherited: boolean;
  get belongId() {
    return this.current.space.id;
  }
  async delete(): Promise<boolean> {
    const res = await kernel.deleteSpecies({
      id: this.id,
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
    data.id = this.id;
    data.typeName = this.typeName;
    const res = await kernel.updateSpecies(data);
    if (res.success && res.data.id) {
      this.setMetadata(res.data);
    }
    return res.success;
  }
  async create(data: model.SpeciesModel): Promise<ISpeciesItem | undefined> {
    data.parentId = this.id;
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
