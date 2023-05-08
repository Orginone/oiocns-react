import { kernel, model, schema } from '../../../base';
import { PageAll } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from './species';
import { IWorkDefine, WorkDefine } from '../app/work/workDefine';

export interface IWork extends ISpeciesItem {
  /** 流程定义 */
  defines: IWorkDefine[];
  /** 加载所有可选表单 */
  loadForms(): Promise<schema.XForm[]>;
  /** 表单特性 */
  loadAttributes(): Promise<schema.XAttribute[]>;
  /** 加载办事 */
  loadWorkDefines(reload?: boolean): Promise<IWorkDefine[]>;
  /** 新建办事 */
  createWorkDefine(data: model.WorkDefineModel): Promise<IWorkDefine | undefined>;
}

export abstract class Work extends SpeciesItem implements IWork {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: ISpeciesItem) {
    super(_metadata, _current, _parent);
  }
  defines: IWorkDefine[] = [];
  private _defineLoaded: boolean = false;
  async loadWorkDefines(reload: boolean = false): Promise<IWorkDefine[]> {
    if (!this._defineLoaded || reload) {
      const res = await kernel.queryWorkDefine({
        id: this.current.metadata.id,
        speciesId: this.metadata.id,
        belongId: this.current.space.metadata.id,
        upTeam: this.current.metadata.typeName === TargetType.Group,
        upSpecies: true,
        page: PageAll,
      });
      if (res.success) {
        this._defineLoaded = true;
        this.defines = (res.data.result || []).map((a) => new WorkDefine(a, this));
      }
    }
    return this.defines;
  }
  async createWorkDefine(data: model.WorkDefineModel): Promise<IWorkDefine | undefined> {
    data.shareId = this.current.metadata.id;
    data.speciesId = this.metadata.id;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      let define = new WorkDefine(res.data, this);
      this.defines.push(define);
      return define;
    }
  }
  abstract loadForms(): Promise<schema.XForm[]>;
  abstract loadAttributes(): Promise<schema.XAttribute[]>;
}
