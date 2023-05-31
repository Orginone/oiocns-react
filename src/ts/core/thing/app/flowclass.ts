import { schema } from '../../../base';
import { ITarget } from '../../target/base/target';
import { IFlow, IWorkDefine, Flow } from '../base/flow';
import { IApplication } from './application';
import { ISpeciesItem } from '../base/species';
import { SpeciesType } from '../../public';
export interface IFlowClass extends IFlow {
  /** 加载所有的办事 */
  loadAllWorkDefines(reload?: boolean): Promise<IWorkDefine[]>;
}

export class FlowClass extends Flow implements IFlowClass {
  constructor(_metadata: schema.XSpecies, _app: IApplication, _parent?: IFlowClass) {
    super(_metadata, _app.current, _app, _parent);
    this.speciesTypes = [_metadata.typeName];
    for (const item of _metadata.nodes || []) {
      const subItem = this.createChildren(item, _app.current);
      if (subItem) {
        this.children.push(subItem);
      }
    }
  }
  async loadAllWorkDefines(): Promise<IWorkDefine[]> {
    const result = [...(await this.loadWorkDefines())];
    for (const item of this.children) {
      result.push(...(await (item as IFlowClass).loadAllWorkDefines()));
    }
    return result;
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    switch (_metadata.typeName) {
      case SpeciesType.Flow:
        return new FlowClass(_metadata, this.app, this);
    }
  }
}
