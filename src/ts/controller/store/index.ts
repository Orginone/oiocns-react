import { Emitter } from '@/ts/base/common';
/**
 * 仓库控制器
 */
class StoreController extends Emitter {
  public currentKey: string = '';
  constructor() {
    super();
  }
}

export default new StoreController();
