import BaseController from '../baseCtrl';
import { ITodoGroup } from '../../core/todo/itodo';
import userCtrl, { UserPartTypes } from '../setting/userCtrl';
import { loadAppTodo } from '../../core/todo/application';
import { loadPublishTodo } from '../../core/todo/publish';
import { loadOrgTodo } from '../../core/todo/orgrelation';
import { loadMarketTodo } from '../../core/todo/marketjoin';
import { loadOrderTodo } from '../../core/todo/order';

/** 待办控制器 */
class TodoController extends BaseController {
  private _orgTodo: ITodoGroup | undefined;
  private _pubTodo: ITodoGroup | undefined;
  private _orderTodo: ITodoGroup | undefined;
  private _marketTodo: ITodoGroup | undefined;
  private _appTodo: ITodoGroup[] = [];
  constructor() {
    super();
    userCtrl.subscribePart(UserPartTypes.User, () => {
      setTimeout(async () => {
        this._orgTodo = await loadOrgTodo();
        this._appTodo = await loadAppTodo();
        this._pubTodo = await loadPublishTodo();
        this._orderTodo = await loadOrderTodo();
        this._marketTodo = await loadMarketTodo();
        this.changCallback();
      }, 800);
    });
  }
  /** 组织单位审批 */
  public get OrgTodo(): ITodoGroup {
    return this._orgTodo!;
  }
  /** 第三方应用审批 */
  public get AppTodo(): ITodoGroup[] {
    return this._appTodo!;
  }
  /** 市场审批 */
  public get MarketTodo(): ITodoGroup {
    return this._marketTodo!;
  }
  /** 订单审批 */
  public get OrderTodo(): ITodoGroup {
    return this._orderTodo!;
  }
  /** 应用上架审批 */
  public get PublishTodo(): ITodoGroup {
    return this._pubTodo!;
  }
  /** 获取总的待办数量 */
  public async TaskCount(): Promise<number> {
    let sum = 0;
    sum += (await this._orgTodo?.getCount()) ?? 0;
    sum += (await this._marketTodo?.getCount()) ?? 0;
    sum += (await this._orderTodo?.getCount()) ?? 0;
    sum += (await this._pubTodo?.getCount()) ?? 0;
    this._appTodo.forEach(async (item) => {
      sum += await item.getCount();
    });
    return sum;
  }
}

export default new TodoController();
