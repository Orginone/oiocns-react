import { Emitter, logger } from '../../base/common';
import userCtrl from '../setting';
import { DomainTypes, emitter } from '../../core/';
import { kernel } from '@/ts/base';
import { badRequest, ResultType } from '@/ts/base/model';
import { Dict } from '@/ts/core/thing/dict';
import { Property } from '@/ts/core/thing/property';
import { FlowDefine } from '@/ts/core/thing/flowDefine';

/**
 * 物的控制器
 */
class ThingController extends Emitter {
  public dict: Dict | undefined;
  public property: Property | undefined;
  public define: FlowDefine | undefined;

  constructor() {
    super();
    emitter.subscribePart([DomainTypes.Company], () => {
      this.dict = new Dict(userCtrl.space.id);
      this.define = new FlowDefine(userCtrl.space.id);
      this.property = new Property(userCtrl.space.id);
    });
  }

  public async createThing(data: any): Promise<ResultType<boolean>> {
    let res = await kernel.anystore.createThing(userCtrl.space.id, 1);
    if (res.success) {
      return await kernel.perfectThing({
        id: (res.data as [{ Id: string }])[0].Id,
        data: JSON.stringify(data),
        belongId: userCtrl.space.id,
      });
    } else {
      logger.error(res.msg);
      return badRequest();
    }
  }

  public async perfectThing(id: string, data: any): Promise<ResultType<boolean>> {
    return await kernel.perfectThing({
      id,
      data: JSON.stringify(data),
      belongId: userCtrl.space.id,
    });
  }
}

export default new ThingController();
