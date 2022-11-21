import API from '@/services';
import { message } from 'antd';
import { toPageData } from '../index';
import { IdStatusReq, Page } from '../typings';

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
type pageModel = 'friend' | 'org' | 'order' | 'market' | 'app';

/**待办：1  我发起的：2*/
export type tabStatus = '1' | '2' | '3' | '4';

/**
 * 待办接口声明
 */
interface TodoServiceProps {
  statusList: statusItem[];
  apiPaths: Record<pageModel, { [key: string]: Function }> /**各业务请求api地址*/;
  currentModel: pageModel; // 当前模块
  currentActiveStatus: tabStatus; // 当前选中的状态
}

class TodoService implements TodoServiceProps {
  /**各业务请求api地址*/
  apiPaths: Record<pageModel, { [key: string]: Function }> = {
    friend: {
      approveList: API.person.getAllApproval,
      applyList: API.person.getAllApply,
      retract: API.person.cancelJoin,
      approve: API.person.joinSuccess,
      refuse: API.person.joinRefuse,
    },
    org: {
      approveList: API.company.getAllApproval,
      applyList: API.company.getAllApply,
      retract: API.company.cancelJoin, // 没有撤销申请接口
      approve: API.company.joinApproval,
      refuse: API.company.joinRefuse,
    },
    order: {
      approveList: API.order.searchSellList,
      applyList: API.order.searchBuyList,
      retract: API.order.cancelDetail, // 取消订单详情
      approve: API.order.deliverMerchandise, // 确认交付
      refuse: API.order.reject, // 退货退款
    },
    market: {
      approveList: API.appstore.searchJoinApplyManager, // 加入市场审批列表
      applyList: API.appstore.searchJoinApply, // 加入市场申请列表
      retract: API.appstore.cancelJoin, // 取消市场
      approve: API.appstore.approvalJoin, // 审批加入市场申请 "id": 0, "status": 0
    },
    app: {
      approveList: API.appstore.searchManagerPublishApply, // 查询产品上架申请
      applyList: API.appstore.searchPublishApply, // 加入产品上架申请列表
      // retract: API.appstore.cancelJoin, // 没有取消应用上架
      approve: API.appstore.approvalPublish, // 审批加入市场申请 "id": 0, "status": 0
    },
  };
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
  currentModel: pageModel;
  /** 当前数据状态*/
  currentActiveStatus: tabStatus = '1';
  constructor(modelName: pageModel) {
    this.currentModel = modelName;
  }
  /**设置当前状态 */
  set activeStatus(value: tabStatus) {
    this.currentActiveStatus = value;
  }
  /**获取当前状态 */
  get activeStatus() {
    return this.currentActiveStatus;
  }
  /**列表获取参数格式转换 */
  private _resetParams = <T extends Page>(params: T) => {
    const { page, pageSize, ...rest } = params;

    return {
      offset: (page - 1) * pageSize || 0,
      limit: pageSize || 20,
      ...rest,
    };
  };

  /** 操作类方法回调 */
  private opretionFn = async (fn: Function, params: Partial<IdStatusReq>) => {
    const { msg, success } = await fn.call(fn, { data: params });
    if (success) {
      message.success('操作成功！');
    }
    return { msg, success };
  };

  /*获取列表*/
  public async getList<T extends DataType, U extends Page>(params: U) {
    // 根据当前查询状态判断选择什么接口
    // console.log(this.currentModel);
    const statusApi = { '1': 'approveList', 2: 'applyList' };
    const currentApi = statusApi[this.currentActiveStatus];
    if (currentApi) {
      const fn: Function = this.apiPaths[this.currentModel][currentApi];
      if (fn) {
        const data = await fn.call(fn, { data: this._resetParams(params) });
        return toPageData<T>(data);
      }
    }
    return { data: [], total: 0 };
  }

  /** 拒绝*/
  public refuse = async (id: string, status?: string | number) => {
    return await this.opretionFn(
      this.apiPaths[this.currentModel].refuse,
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
      this.apiPaths[this.currentModel].approve,
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
      this.apiPaths[this.currentModel].retract,
      status
        ? {
            id,
            status,
          }
        : { id },
    );
  };
}

// const todoService = new TodoService();

export default TodoService;
