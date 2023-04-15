import {
  loadOrderTodo,
  loadMarketTodo,
  loadOrgTodo,
  loadPublishTodo,
  ITodoGroup,
  DomainTypes,
  emitter,
  WorkType,
  loadPublishApply,
  loadMarketApply,
} from '@/ts/core';
import { Emitter } from '@/ts/base/common';
import userCtrl from '../setting';
import { XFlowTaskHistory, XTarget } from '@/ts/base/schema';
import { kernel } from '@/ts/base';

/** 待办控制器 */
class TodoController extends Emitter {
  private _tabIndex: string = '1';
  public currentKey: string = '';
  private _friendTodo: ITodoGroup[] = [];
  private _groupTodo: ITodoGroup[] = [];
  private _companyTodo: ITodoGroup[] = [];
  private _pubApply: ITodoGroup | undefined;
  private _pubTodo: ITodoGroup[] = [];
  private _orderTodo: ITodoGroup | undefined;
  private _marketApply: ITodoGroup | undefined;
  private _marketTodo: ITodoGroup[] = [];
  private _curAppTodo: ITodoGroup | undefined;
  private _workTodo: XFlowTaskHistory[] = [];
  constructor() {
    super();
    emitter.subscribePart([DomainTypes.Company, DomainTypes.User], () => {
      setTimeout(async () => {
        let group: XTarget[] = [];
        let companys = await userCtrl.user.getJoinedCompanys(false);
        companys.forEach(async (company) => {
          (await company.getJoinedGroups(false))
            .filter((a) => group.findIndex((s) => a.id == s.id) < 0)
            .forEach((a) => {
              group.push(a.target);
            });
        });
        this._friendTodo = await loadOrgTodo(
          [
            {
              id: userCtrl.user.id,
              name: '好友',
              avatar: userCtrl.user.target.avatar,
            },
          ],
          WorkType.FriendTodo,
        );
        this._groupTodo = await loadOrgTodo(group, WorkType.GroupTodo);
        this._companyTodo = await loadOrgTodo(
          companys.map((a) => a.target),
          WorkType.CompanyTodo,
        );
        this._pubTodo = await loadPublishTodo();
        this._pubApply = await loadPublishApply();
        this._orderTodo = await loadOrderTodo();
        this._marketTodo = await loadMarketTodo();
        this._marketApply = await loadMarketApply();
        this._workTodo =
          (await kernel.queryApproveTask({ id: userCtrl.space.id })).data?.result || [];

        this.changCallback();
      }, 800);
    });
  }
  /** 好友审批 */
  public get FriendTodo(): ITodoGroup[] {
    return this._friendTodo!;
  }
  /** 单位审批 */
  public get CompanyTodo(): ITodoGroup[] {
    return this._companyTodo!;
  }
  /** 集团审批 */
  public get GroupTodo(): ITodoGroup[] {
    return this._groupTodo!;
  }
  /** 组织申请 */
  public get MarketApply(): ITodoGroup {
    return this._marketApply!;
  }
  /** 市场审批 */
  public get MarketTodo(): ITodoGroup[] {
    return this._marketTodo!;
  }
  /** 订单审批 */
  public get OrderTodo(): ITodoGroup {
    return this._orderTodo!;
  }
  /** 组织申请 */
  public get PublishApply(): ITodoGroup {
    return this._pubApply!;
  }
  /** 应用上架审批 */
  public get PublishTodo(): ITodoGroup[] {
    return this._pubTodo!;
  }
  /** 当前选中的应用待办 */
  public get CurAppTodo(): ITodoGroup | undefined {
    return this._curAppTodo;
  }
  /** 事待办 */
  public get WorkTodo(): XFlowTaskHistory[] {
    return this._workTodo;
  }
  /** 加载办事项 */
  public async loadWorkTodo(): Promise<XFlowTaskHistory[]> {
    this._workTodo =
      (await kernel.queryApproveTask({ id: userCtrl.space.id })).data?.result || [];
    return this._workTodo;
  }
  /** 获取总的待办数量 */
  public async getTaskCount(): Promise<number> {
    let marketTodos = this.MarketTodo.filter((a) => a.id != '' && a.id);
    let publishTodos = this.PublishTodo.filter((a) => a.id != '' && a.id);
    let sum = await this.OrderTodo?.getCount();
    for (let i = 0; i < this.FriendTodo.length; i++) {
      sum += await this.FriendTodo[i]?.getCount();
    }
    for (let i = 0; i < this.GroupTodo.length; i++) {
      sum += await this.GroupTodo[i]?.getCount();
    }
    for (let i = 0; i < this.CompanyTodo.length; i++) {
      sum += await this.CompanyTodo[i]?.getCount();
    }
    for (let i = 0; i < marketTodos.length; i++) {
      sum += await marketTodos[i]?.getCount();
    }
    for (let i = 0; i < publishTodos.length; i++) {
      sum += await publishTodos[i]?.getCount();
    }
    sum += this._workTodo.length;
    return sum;
  }
  /** 页面Tab控制序列 */
  public get tabIndex() {
    return this._tabIndex;
  }
  public setTabIndex(index: string): void {
    this._tabIndex = index;
    this.changCallback();
  }

  public refreshWorkTodo() {
    console.log('');
  }
}

export default new TodoController();
