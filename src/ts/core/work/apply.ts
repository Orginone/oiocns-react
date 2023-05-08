import { common, kernel } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { XWorkInstance, XWorkTask } from '@/ts/base/schema';
import { PageAll } from '../public/consts';
import { XWorkRecord } from '../../base/schema';

/** 待办项 */
export interface IApply {
  /** 数据 */
  metadata: XWorkRecord;
  /** 获取实例 */
  getInstance(): Promise<XWorkInstance>;
}

export class WorkApply extends common.Entity implements IApply {
  metadata: XWorkRecord;
  constructor(metadata: XWorkRecord) {
    super();
    this.metadata = metadata;
  }
  async getInstance(): Promise<XWorkInstance> {
    if (this.metadata.task?.instanceId != '') {
      const res = await kernel.queryWorkInstanceById({
        id: this.metadata.task?.instanceId,
        page: PageAll,
      });
      return res.data;
    }
  }
}
