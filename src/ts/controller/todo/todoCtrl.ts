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
import { TODO_COMMON_MENU } from '@/constants/const';
import { IsRelationAdmin } from '@/utils/authority';

/** 待办控制器 */
class TodoController extends Emitter {
  private _tabIndex: string = '1';
  public currentKey: string = '';
  private _friendTodo: ITodoGroup[] = [];
  private _groupTodo: ITodoGroup[] = [];
  private _cohortTodo: ITodoGroup[] = [];
  private _companyTodo: ITodoGroup[] = [];
  private _pubApply: ITodoGroup | undefined;
  private _pubTodo: ITodoGroup[] = [];
  private _orderTodo: ITodoGroup | undefined;
  private _marketApply: ITodoGroup | undefined;
  private _marketTodo: ITodoGroup[] = [];
  private _curAppTodo: ITodoGroup | undefined;
  private _workTodo: XFlowTaskHistory[] = [];
  private _caches: any[] = [];
  private _commonMenuMap: any = {};
  constructor() {
    super();
    emitter.subscribePart([DomainTypes.Company, DomainTypes.User], async () => {
      if (userCtrl.user.id != '') {
        let group: XTarget[] = [];
        let cohorts: XTarget[] = [];
        let companys: XTarget[] = [];
        let res = await kernel.queryApproveTask({ id: userCtrl.space.id });
        let cps = await userCtrl.user.getJoinedCompanys(false);
        for (let company of cps) {
          if (await IsRelationAdmin(company)) {
            companys.push(company.target);
          }
          (await company.getJoinedGroups(false)).forEach(async (s) => {
            if (await IsRelationAdmin(s)) {
              group.push(s.target);
            }
          });
        }
        (await userCtrl.user.getCohorts(false)).forEach(async (a) => {
          if (await IsRelationAdmin(a)) {
            cohorts.push(a.target);
          }
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
        this._workTodo = res.data?.result || [];
        this._pubTodo = await loadPublishTodo();
        this._pubApply = await loadPublishApply();
        this._orderTodo = await loadOrderTodo();
        this._marketTodo = await loadMarketTodo();
        this._marketApply = await loadMarketApply();
        this._groupTodo = await loadOrgTodo(group, WorkType.GroupTodo);
        this._cohortTodo = await loadOrgTodo(cohorts, WorkType.CohortTodo);
        this._companyTodo = await loadOrgTodo(companys, WorkType.CompanyTodo);
        kernel.anystore.subscribed(
          TODO_COMMON_MENU + '.SP' + userCtrl.space.id,
          'user',
          (data: any) => {
            this._caches = data;
            this.changCallbackPart(TODO_COMMON_MENU);
          },
        );
        this.changCallback();
      }
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
  /** 群组审批 */
  public get CohortTodo(): ITodoGroup[] {
    return this._cohortTodo!;
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
    for (let i = 0; i < this.CohortTodo.length; i++) {
      sum += await this.CohortTodo[i]?.getCount();
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

  get commonMenuMap(): any {
    return this._commonMenuMap;
  }

  get caches(): any[] {
    return this._caches;
  }

  public async setCommon(menu: any, setCommon: boolean = true) {
    this._caches = this._caches.filter(
      (i) => i.key.replace('copy', '') != menu.key.replace('copy', ''),
    );
    if (setCommon) {
      this._caches.unshift(menu);
    }
    this._caches = this._caches.slice(0, 10);
    this._commonMenuMap[userCtrl.space.id] = this._caches;
    let result = await kernel.anystore.set(
      TODO_COMMON_MENU,
      {
        operation: 'replaceAll',
        data: this._commonMenuMap,
      },
      'user',
    );
    console.log(result);
    this.changCallbackPart(TODO_COMMON_MENU);
  }
}

export default new TodoController();
