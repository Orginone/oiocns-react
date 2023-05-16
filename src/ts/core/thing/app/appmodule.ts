import { schema } from '../../../base';
import { SpeciesType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';
import { IWorkForm, WorkForm } from './work/workform';
import { WorkItem } from './work/workitem';
import { ReportBI } from './work/reportbi';
import { IForm } from '../base/form';
import { IWork, IWorkDefine } from '../base/work';
export interface IAppModule extends ISpeciesItem {
  /** 所有办事项 */
  defines: IWorkDefine[];
  /** 表单 */
  loadForms(): Promise<IForm[]>;
  /** 查询所有办事 */
  loadWorkDefines(): Promise<IWorkDefine[]>;
}

export class AppModule extends SpeciesItem implements IAppModule {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: IAppModule) {
    super(_metadata, _current, _parent);
    this.speciesTypes = [
      SpeciesType.AppModule,
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
    this.parent = _parent;
  }
  defines: IWorkDefine[] = [];
  async loadForms(): Promise<IForm[]> {
    const result: IForm[] = [];
    for (const item of this.children) {
      switch (item.metadata.typeName) {
        case SpeciesType.WorkForm:
          result.push(...(await (item as IWorkForm).loadForms()));
          break;
        case SpeciesType.AppModule:
          result.push(...(await (item as IAppModule).loadForms()));
          break;
      }
    }
    return result;
  }
  async loadWorkDefines(): Promise<IWorkDefine[]> {
    this.defines = [];
    for (const item of this.children) {
      switch (item.metadata.typeName) {
        case SpeciesType.WorkItem:
          this.defines.push(...(await (item as IWork).loadWorkDefines()));
          break;
        case SpeciesType.AppModule:
          this.defines.push(...(await (item as IAppModule).loadWorkDefines()));
          break;
      }
    }
    return this.defines;
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    switch (_metadata.typeName) {
      case SpeciesType.WorkForm:
        return new WorkForm(_metadata, _current, this);
      case SpeciesType.WorkItem:
        return new WorkItem(_metadata, _current, this);
      case SpeciesType.ReportBI:
        return new ReportBI(_metadata, _current, this);
      case SpeciesType.AppModule:
        return new AppModule(_metadata, _current, this);
    }
  }
}
