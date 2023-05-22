import { schema } from '../../../base';
import { SpeciesType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';
import { IWorkItem, WorkItem } from './workitem';
import { IForm } from '../base/form';
import { IWorkDefine } from '../base/work';
import { Data } from './data';
import { IThingClass } from '../store/thingclass';
/** 应用的基类接口 */
export interface IApplication extends ISpeciesItem {
  /** 流程定义 */
  defines: IWorkDefine[];
  /** 查询所有的表单 */
  loadForms(): Promise<IForm[]>;
  /** 查询所有办事 */
  loadWorkDefines(): Promise<IWorkDefine[]>;
}

/** 应用的基类实现 */
export class Application extends SpeciesItem implements IApplication {
  constructor(_metadata: schema.XSpecies, _current: ITarget) {
    super(_metadata, _current);
    this.speciesTypes = [SpeciesType.Thing, SpeciesType.Work, SpeciesType.Data];
    for (const item of _metadata.nodes || []) {
      const subItem = this.createChildren(item, _current);
      if (subItem) {
        this.children.push(subItem);
      }
    }
  }
  defines: IWorkDefine[] = [];
  async loadForms(): Promise<IForm[]> {
    const result: IForm[] = [];
    for (const item of this.children) {
      if (item.typeName === SpeciesType.Thing) {
        result.push(...(await (item as IThingClass).loadAllForms()));
      }
    }
    return result;
  }
  async loadWorkDefines(): Promise<IWorkDefine[]> {
    const result: IWorkDefine[] = [];
    for (const item of this.children) {
      if (item.typeName === SpeciesType.Work) {
        result.push(...(await (item as IWorkItem).loadAllWorkDefines()));
      }
    }
    this.defines = result;
    return result;
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    switch (_metadata.typeName) {
      case SpeciesType.Work:
        return new WorkItem(_metadata, this);
      case SpeciesType.Data:
        return new Data(_metadata, this);
    }
  }
}
