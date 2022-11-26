import { message } from 'antd';
import {
  friendTodo,
  teamTodo,
  storeTodo,
  productTodo,
  orderTodo,
} from '@/ts/core/todo/index';
import {
  ApplicationTodo,
  FriendTodo,
  ProductTodo,
  StoreTodo,
  TeamTodo,
} from '@/ts/core/todo/todo';
import { XOrder, XOrderDetail } from '@/ts/base/schema';
import { OrderStatus } from '@/ts/core/todo/interface';
import OrderTodo from '@/ts/core/todo/order';

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

/**待办：1  我发起的：2*/
export type tabStatus = '1' | '2' | '3' | '4' | '5' | '6';
/**
 * 待办接口声明
 */
interface TodoServiceProps {
  friend: FriendTodo;
  org: TeamTodo;
  store: StoreTodo;
  product: ProductTodo;
  order: OrderTodo;
  // 当前应用待办appid
  currentAppid: string;
  applicationInstance: ApplicationTodo | undefined;

  statusList: statusItem[];
  currentModel: pageModel; // 当前模块
  activeStatus: tabStatus; // 当前选中的状态
}

class TodoService implements TodoServiceProps {
  applicationInstance: ApplicationTodo | undefined;
  friend = friendTodo;
  org = teamTodo;
  store = storeTodo;
  product = productTodo;
  order = orderTodo;
  currentAppid: string = '';
  /** 平台待办tabs项 */
  statusList: statusItem[] = [
    { tab: '待办', key: '1' },
    { tab: '已办', key: '2' },
    { tab: '我的发起', key: '3' },
  ];
  /**订单管理tabs项 */
  orderTabs: statusItem[] = [
    { tab: '销售订单', key: '5' },
    { tab: '采购订单', key: '6' },
  ];
  /**应用待办tabs */
  applicationTabs: statusItem[] = [
    { tab: '待办', key: '1' },
    { tab: '抄送待审阅', key: '4' },
    { tab: '已办', key: '2' },
    { tab: '我的发起', key: '3' },
  ];
  /**当前页面模块名称 */
  currentModel: pageModel = 'friend';
  /** 当前tab数据状态*/
  activeStatus: tabStatus = '1';
  /**数据状态枚举 */
  get statusMap() {
    return {
      1: {
        color: 'blue',
        text: this.currentModel === 'order' ? '待交付' : '待处理',
      },
      100: {
        color: 'green',
        text: '已同意',
      },
      200: {
        color: 'red',
        text: '已拒绝',
      },
      102: {
        color: 'green',
        text: '已发货',
      },
      220: {
        color: 'gold',
        text: '买方取消订单',
      },
      221: {
        color: 'volcano',
        text: '卖方取消订单',
      },
      222: {
        color: 'default',
        text: '已退货',
      },
    };
  }
  /**当前实例 */
  get currentInstance(): FriendTodo | TeamTodo | StoreTodo | ProductTodo {
    return this[this.currentModel];
  }
  /**  获取平台待办列表 */
  public get currentList() {
    const listStatusCode = {
      '1': 'todoList',
      '2': 'doList',
      '3': 'applyList',
      '5': 'saleList',
      '6': 'buyList',
    };
    const selfList = listStatusCode[this.activeStatus];
    return this.currentInstance[selfList];
  }
  /**  获取应用待办列表 */
  public applicationList = async () => {
    if (!this.applicationInstance) return;
    const listStatusCode = {
      '1': 'getTodoList',
      '2': 'getDoList',
      '3': 'getApplyList',
      '4': 'getNoticeList',
    };
    const selfListFn = listStatusCode[this.activeStatus];
    return await this.applicationInstance[selfListFn]();
  };
  /** 生成平台待办操作菜单*/
  tableOperation = (item: any, callback: Function) => {
    const afterOperate = (success: boolean, name: string) => {
      if (success) {
        message.success(`${name}成功`);
        callback(true);
      } else {
        message.error(`${name}失败`);
      }
    };
    return this.activeStatus == '1'
      ? [
          {
            key: 'approve',
            label: '同意',
            onClick: () => {
              this.currentInstance.approve(item).then(({ success }) => {
                afterOperate(success, '同意');
              });
            },
          },
          {
            key: 'refuse',
            label: '拒绝',
            onClick: () => {
              this.currentInstance.reject(item).then(({ success }) => {
                afterOperate(success, '拒绝');
              });
            },
          },
        ]
      : this.activeStatus == '2'
      ? [
          {
            key: 'approve',
            label: '同意',
            onClick: () => {
              this.currentInstance.approve(item).then(({ success }) => {
                afterOperate(success, '同意');
              });
            },
          },
        ]
      : [
          {
            key: 'retractApply',
            label: '取消申请',
            onClick: () => {
              this.currentInstance.cancel(item).then(({ success }) => {
                afterOperate(success, '取消');
              });
            },
          },
        ];
  };
  /** 生成订单操作菜单  */
  orderOperation = (item: XOrder | XOrderDetail, callback: Function) => {
    const afterOperate = (success: boolean, name: string) => {
      if (success) {
        message.success(`${name}成功`);
        callback(true);
      } else {
        message.error(`${name}失败`);
      }
    };
    // 是否是待发货的订单状态
    let allowToCancel = item.status < 102;
    if (this.activeStatus == `6`) {
      if (typeof (item as XOrder).details === 'object') {
        // 说明他是采购订单的主订单 不能取消订单
        allowToCancel = false;
      }
    }
    const menu = [];
    if (allowToCancel) {
      menu.push({
        key: 'retractApply',
        label: '取消订单',
        onClick: () => {
          this.order
            .cancel(
              item,
              this.activeStatus == '5'
                ? OrderStatus.sellerCancel
                : OrderStatus.buyerCancel,
            )
            .then(({ success }) => {
              afterOperate(success, '取消订单');
            });
        },
      });
      if (this.activeStatus == `5`) {
        menu.push({
          key: 'approve',
          label: '确认交付',
          onClick: () => {
            this.order.deliver(item as XOrderDetail).then(({ success }) => {
              afterOperate(success, '确认交付');
            });
          },
        });
      }
    } else if (item.status == 102 && this.activeStatus == `6`) {
      menu.push({
        key: 'reject',
        label: '退货退款',
        onClick: () => {
          this.order.reject(item as XOrderDetail).then(({ success }) => {
            afterOperate(success, '退货退款');
          });
        },
      });
    }
    return menu;
  };

  public menuCallback = Function;
}

const todoService = new TodoService();

export default todoService;
