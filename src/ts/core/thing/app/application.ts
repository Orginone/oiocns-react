import { schema } from '../../../base';
import { SpeciesType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';
import { IWorkForm, WorkForm } from './workform';
import { IWorkItem, WorkItem } from './workitem';
import { ReportBI } from './reportbi';
import { IForm } from '../base/form';
import { IWorkDefine } from '../base/work';
/** 应用的基类接口 */
export interface IApplication extends ISpeciesItem {
  /** 查询所有的表单 */
  loadForms(): Promise<IForm[]>;
  /** 查询所有办事 */
  loadWorkDefines(): Promise<IWorkDefine[]>;
}

/** 应用的基类实现 */
export class Application extends SpeciesItem implements IApplication {
  constructor(_metadata: schema.XSpecies, _current: ITarget) {
    super(_metadata, _current);
    this.speciesTypes = [
      SpeciesType.WorkForm,
      SpeciesType.WorkItem,
      SpeciesType.ReportBI,
    ];
    for (const item of _metadata.nodes || []) {
      const subItem = this.createChildren(item, _current);
      if (subItem) {
        this.children.push(subItem);
      }
    }
  }
  async loadForms(): Promise<IForm[]> {
    const result: IForm[] = [];
    for (const item of this.children) {
      if (item.metadata.typeName === SpeciesType.WorkForm) {
        result.push(...(await (item as IWorkForm).loadAllForms()));
      }
    }
    return result;
  }
  async loadWorkDefines(): Promise<IWorkDefine[]> {
    const result: IWorkDefine[] = [];
    for (const item of this.children) {
      if (item.metadata.typeName === SpeciesType.WorkItem) {
        result.push(...(await (item as IWorkItem).loadAllWorkDefines()));
      }
    }
    return result;
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    switch (_metadata.typeName) {
      case SpeciesType.WorkForm:
        return new WorkForm(_metadata, this);
      case SpeciesType.WorkItem:
        return new WorkItem(_metadata, this);
      case SpeciesType.ReportBI:
        return new ReportBI(_metadata, this);
    }
  }
}
