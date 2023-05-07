import { schema } from '../../../base';
import { SpeciesType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';
import { WorkForm } from './work/workform';
import { WorkItem } from './work/workitem';
import { ReportBI } from './work/reportbi';
import { IForm } from '../base/form';
export interface IAppModule extends ISpeciesItem {
  /** 表单 */
  loadForms(): Promise<schema.XForm[]>;
  /** 表单特性 */
  loadAttributes(): Promise<schema.XAttribute[]>;
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
  async loadForms(): Promise<schema.XForm[]> {
    const result: schema.XForm[] = [];
    for (const item of this.children) {
      switch (item.metadata.typeName) {
        case SpeciesType.WorkForm:
          await (item as IForm).loadForms();
          result.push(...(item as IForm).forms);
          break;
        case SpeciesType.AppModule:
          result.push(...(await (item as IAppModule).loadForms()));
          break;
      }
    }
    return result;
  }
  async loadAttributes(): Promise<schema.XAttribute[]> {
    const result: schema.XAttribute[] = [];
    for (const item of this.children) {
      switch (item.metadata.typeName) {
        case SpeciesType.WorkForm:
          await (item as IForm).loadAttributes();
          result.push(...(item as IForm).attributes);
          break;
        case SpeciesType.AppModule:
          result.push(...(await (item as IAppModule).loadAttributes()));
          break;
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
