import {
  loadAppTodo,
  loadOrderTodo,
  loadMarketTodo,
  loadOrgTodo,
  loadPublishTodo,
  ITodoGroup,
  DomainTypes,
  emitter,
} from '@/ts/core';
import { Emitter } from '@/ts/base/common';

/** 待办控制器 */
class TodoController extends Emitter {
  private _orgTodo: ITodoGroup | undefined;
  private _pubTodo: ITodoGroup | undefined;
  private _orderTodo: ITodoGroup | undefined;
  private _marketTodo: ITodoGroup | undefined;
  private _appTodo: ITodoGroup[] = [];
  private _curAppTodo: ITodoGroup | undefined;
  constructor() {
    super();
    emitter.subscribePart(DomainTypes.User, () => {
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
  /** 当前选中的应用待办 */
  public get CurAppTodo(): ITodoGroup | undefined {
    return this._curAppTodo;
  }
  /** 设置选中应用待办 */
  public setCurrentAppTodo = (id: string) => {
    this._curAppTodo = this._appTodo.find((n: ITodoGroup) => n.id === id);
    this.changCallbackPart('CurAppTodo');
  };
  /**当前好友待办数量 */
  public firendTodoCount = () => {
    this._orgTodo;
  };
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
