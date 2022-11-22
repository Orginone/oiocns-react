// import API from '@/services';
import { message } from 'antd';
// import { toPageData } from '../index';
import { resetParams, toPageData } from '@/utils/tools';
// import { IdStatusReq, Page } from '@/typings/requestType';
import { kernel } from '@/ts/base';
import { AppStore } from '@/ts/core/market';
import Provider from '@/ts/core/provider';
import { TargetType } from '@/ts/core/enum';
import { format } from 'path';
import { DataType } from 'typings/globelType';

// type OrgType = '人员' | 'other';

/**
 * tabs 状态选项
 *  tab,key 待办：1  我发起的：2
 */
type statusItem = {
  key: tabStatus;
  tab: string;
};
/**页面模块类型*/
export type pageModel = 'friend' | 'org' | 'order' | 'store' | 'product' | 'application';
/**筛选字段和模块对应的枚举 */
enum pageModelTagName {
  friend = TargetType.Person,
}

/**待办：1  我发起的：2*/
export type tabStatus = '1' | '2' | '3' | '4' | '5' | '6';
/** tabs 项的枚举 */
enum tabStatusFunction {
  '待办' = 1,
  '我发起的' = 2,
  '已办' = 3,
  '已完成' = 4,
  '销售订单' = 5,
  '采购订单' = 6,
}
/**操作枚举 */
enum AproveOpration {
  '取消申请' = 'retract',
  '拒绝' = 'refuse',
  '同意' = 'approve',
  '退货退款' = 'reject',
  '确认交付' = 'deliver',
  '取消订单' = 'cancel',
}
/**
 * 待办接口声明
 */
interface TodoServiceProps {
  statusList: statusItem[];
  /**各业务请求api地址*/
  apiPaths: Record<pageModel, { [key: string]: string }>;
  currentModel: pageModel; // 当前模块
  currentActiveStatus: tabStatus; // 当前选中的状态
}

class TodoService implements TodoServiceProps {
  /**各业务请求api地址*/
  apiPaths: Record<pageModel, { [key: string]: string }> = {
    friend: {
      [tabStatusFunction.待办]: `queryjoinApproval`,
      [tabStatusFunction.我发起的]: `queryJoinApply`,
      retract: `cancelJoinTeam`, // 没有撤销申请接口
      approve: `approvalJoinApply`,
      refuse: `joinTeamApproval`,
    },
    org: {
      [tabStatusFunction.待办]: `queryjoinApproval`,
      [tabStatusFunction.我发起的]: `queryJoinApply`,
      retract: `cancelJoinTeam`, // 没有撤销申请接口
      approve: `approvalJoinApply`,
      refuse: `joinTeamApproval`,
    },
    order: {
      [tabStatusFunction.销售订单]: `QuerySellOrderList`,
      [tabStatusFunction.采购订单]: `QueryBuyOrderList`,
      cancel: `CancelOrderDetail`, // 取消订单详情
      deliver: `DeliverMerchandise`, // 确认交付
      reject: `RejectMerchandise`, // 退货退款
    },
    store: {
      [tabStatusFunction.待办]: `getJoinApproval`, // 加入市场审批列表
      [tabStatusFunction.我发起的]: `getJoinMarketApplys`, // 加入市场申请列表
      retract: `cancelJoinMarketApply`, // 取消加入市场
      approve: `ApprovalJoinApply`, // 审批加入市场申请 "id": 0, "status": 0
    },
    product: {
      [tabStatusFunction.待办]: `getPublicApproval`, // 查询产品上架审批
      [tabStatusFunction.我发起的]: `QueryMerchandiseApply`, // 产品上架申请列表
      // retract: API.appstore.cancelJoin, // 没有取消应用上架
      approve: `approvalMerchandise`, // 审批加入市场申请 "id": 0, "status": 0
    },
    application: {},
  };
  /** tabs项 */
  statusList: statusItem[] = [
    { tab: '待办', key: '1' },
    { tab: '已办', key: '3' },
    { tab: '已完成', key: '4' },
    { tab: '我的发起', key: '2' },
  ];
  statusMap = {
    1: {
      color: 'blue',
      text: '待处理',
    },
    100: {
      color: 'green',
      text: '已处理',
    },
    200: {
      color: 'red',
      text: '已拒绝',
    },
  };
  /**当前页面模块名称 */
  currentModel: pageModel = 'friend';

  /** 当前tab数据状态*/
  currentActiveStatus: tabStatus = '1';

  /**设置当前状态 */
  set activeStatus(value: tabStatus) {
    this.currentActiveStatus = value;
  }
  /**获取当前状态 */
  get activeStatus() {
    return this.currentActiveStatus;
  }
  /**当前api对象 */
  get currentApi() {
    return this.apiPaths[this.currentModel];
  }
  /**当前需要过滤的typeName */
  private get currentTypeName() {
    return pageModelTagName[this.currentModel];
  }
  /** 操作类方法回调 */
  private opretionFn = async (fn: string, params: Partial<IdStatusPage>) => {
    const { msg, success } = await kernel[fn]({ data: params }); //  fn.call(fn, { data: params });
    if (success) {
      message.success('操作成功！');
    }
    return { msg, success };
  };

  /*获取列表*/
  public async getList<T extends DataType, U extends PageParams>(params: U) {
    // 根据当前查询状态判断选择什么接口
    const currentFn = this.currentApi[Number(this.currentActiveStatus)];
    if (currentFn && Provider?.getPerson) {
      const fn: Function = Provider?.getPerson[currentFn]; // this.currentApi[currentApi];
      if (fn) {
        const data = await fn.call(fn, { data: resetParams(params) });
        console.log('请求', currentFn, data);
        let formatData = toPageData<T>(data);
        if (formatData.data.length > 0 && this.currentTypeName) {
          formatData = {
            ...formatData,
            data: await this.filterByTagName(formatData.data, this.currentTypeName),
          };
        }
        return formatData;
      }
    }

    return { data: [], total: 0 };
  }
  /**
   * 根据组织类型筛选审核、申请列表数据
   */
  private filterByTagName = async (list: any[], typeName: string) => {
    return list.filter((n) => {
      return n.team.typeName === typeName;
    });
  };
  /** 拒绝*/
  public refuse = async (id: string, status?: string | number) => {
    return await this.opretionFn(
      this.currentApi.refuse,
      status
        ? {
            id,
            status,
          }
        : { id },
    );
  };
  /* 同意*/
  public approve = async (id: string, status?: string | number) => {
    return await this.opretionFn(
      this.currentApi.approve,
      status
        ? {
            id,
            status,
          }
        : { id },
    );
  };
  /**取消申请 */
  public retractApply = async (id: string, status?: string | number) => {
    return await this.opretionFn(
      this.currentApi.retract,
      status
        ? {
            id,
            status,
          }
        : { id },
    );
  };
  /**
   * menuCallback
   */
  public menuCallback = Function;
}

const todoService = new TodoService();

export default todoService;
