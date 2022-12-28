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
import userCtrl from '../setting';

/** 待办控制器 */
class TodoController extends Emitter {
  public currentKey: string = '';
  private _orgTodo: ITodoGroup[] = [];
  private _pubTodo: ITodoGroup[] = [];
  private _orderTodo: ITodoGroup | undefined;
  private _marketTodo: ITodoGroup[] = [];
  private _appTodo: ITodoGroup[] = [];
  private _curAppTodo: ITodoGroup | undefined;
  constructor() {
    super();
    emitter.subscribePart(DomainTypes.User, () => {
      setTimeout(async () => {
        let orgTodoTypes = [
          {
            id: userCtrl.user.id,
            name: '好友管理',
            avatar: userCtrl.user.target.avatar,
          },
        ];
        orgTodoTypes.push(
          ...(await userCtrl.user.getJoinedCompanys(false)).map((a) => a.target),
        );
        this._orgTodo = await loadOrgTodo(orgTodoTypes);
        this._appTodo = await loadAppTodo();
        this._pubTodo = await loadPublishTodo();
        this._orderTodo = await loadOrderTodo();
        this._marketTodo = await loadMarketTodo();
        this.changCallback();
      }, 800);
    });
  }
  /** 组织单位审批 */
  public get OrgTodo(): ITodoGroup[] {
    return this._orgTodo!;
  }
  /** 第三方应用审批 */
  public get AppTodo(): ITodoGroup[] {
    return this._appTodo!;
  }
  /** 市场审批 */
  public get MarketTodo(): ITodoGroup[] {
    return this._marketTodo!;
  }
  /** 订单审批 */
  public get OrderTodo(): ITodoGroup {
    return this._orderTodo!;
  }
  /** 应用上架审批 */
  public get PublishTodo(): ITodoGroup[] {
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
  /** 获取总的待办数量 */
  public async getTaskCount(): Promise<number> {
    let sum = 0;
    sum += (await this._orderTodo?.getCount()) ?? 0;
    this.OrgTodo.forEach(async (a) => {
      sum += (await a?.getCount()) ?? 0;
    });
    this.MarketTodo.filter((a) => a.id != '').forEach(async (a) => {
      sum += (await a?.getCount()) ?? 0;
    });
    this.PublishTodo.filter((a) => a.id != '').forEach(async (a) => {
      sum += (await a?.getCount()) ?? 0;
    });
    this._appTodo.forEach(async (item) => {
      sum += await item.getCount();
    });
    return sum;
  }
}

export default new TodoController();
