import { kernel } from '../../../../base';
import { PageAll } from '../../../public/consts';
import {
  PageModel,
  WorkDefineModel,
  WorkInstanceModel,
  WorkNodeModel,
} from '../../../../base/model';
import { XWorkDefine, XWorkInstance, XWorkInstanceArray } from '../../../../base/schema';
import { IWork } from '../../base/work';

export interface IWorkDefine {
  /** 办事分类 */
  workItem: IWork;
  /** 数据 */
  metadata: XWorkDefine;
  /** 更新办事定义 */
  updateDefine(req: WorkDefineModel): Promise<boolean>;
  /** 加载事项定义节点 */
  loadWorkNode(): Promise<WorkNodeModel>;
  /** 删除办事定义 */
  deleteDefine(): Promise<boolean>;
  /** 删除办事实例 */
  deleteInstance(id: string): Promise<boolean>;
  /** 新建办事实例 */
  createWorkInstance(data: WorkInstanceModel): Promise<XWorkInstance | undefined>;
}

export class WorkDefine implements IWorkDefine {
  workItem: IWork;
  metadata: XWorkDefine;
  constructor(define: XWorkDefine, work: IWork) {
    this.workItem = work;
    this.metadata = define;
  }
  async createWorkInstance(data: WorkInstanceModel): Promise<XWorkInstance | undefined> {
    return (await kernel.createWorkInstance(data)).data;
  }
  async deleteDefine(): Promise<boolean> {
    const res = await kernel.deleteWorkDefine({
      id: this.metadata.id,
      page: PageAll,
    });
    if (res.success) {
      this.workItem.defines = this.workItem.defines.filter(
        (a) => a.metadata.id != this.metadata.id,
      );
    }
    return res.success;
  }
  async updateDefine(data: WorkDefineModel): Promise<boolean> {
    data.shareId = this.workItem.current.metadata.id;
    data.speciesId = this.metadata.id;
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      this.metadata = res.data;
    }
    return res.success;
  }
  async loadWorkNode(): Promise<WorkNodeModel> {
    return (await kernel.queryWorkNodes({ id: this.metadata.id, page: PageAll })).data;
  }
  async deleteInstance(id: string): Promise<boolean> {
    return (await kernel.recallWorkInstance({ id, page: PageAll })).success;
  }
}
