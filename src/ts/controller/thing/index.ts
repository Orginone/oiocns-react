import { Emitter, logger } from '../../base/common';
import userCtrl from '../setting';
import { kernel } from '@/ts/base';
import { badRequest, ResultType } from '@/ts/base/model';

/**
 * 物的控制器
 */
class ThingController extends Emitter {
  constructor() {
    super();
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
