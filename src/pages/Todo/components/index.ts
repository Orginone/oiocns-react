import { CommonStatus } from '@/ts/core/enum';
import { IApplyItem, IApprovalItem, IOrderApplyItem } from '@/ts/core/todo/itodo';
import { message } from 'antd';
import { OrderStatus } from '@/ts/core/enum';
import { XOrderDetail } from '@/ts/base/schema';

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
// interface TodoServiceProps {
//   friend: FriendTodo;
//   org: TeamTodo;
//   store: StoreTodo;
//   product: ProductTodo;
//   order: OrderTodo;
//   // 当前应用待办appid
//   currentAppid: string;
//   applicationInstance: ApplicationTodo | undefined;
//   statusList: statusItem[];
//   currentModel: pageModel; // 当前模块
//   activeStatus: tabStatus; // 当前选中的状态
// }
/** 平台待办tabs项 */
const statusList: statusItem[] = [
  { tab: '待办', key: '1' },
  { tab: '已办', key: '2' },
  { tab: '我的发起', key: '3' },
];
/**订单管理tabs项 */
const orderTabs: statusItem[] = [
  { tab: '销售订单', key: '5' },
  { tab: '采购订单', key: '6' },
];
/**应用待办tabs */
const applicationTabs: statusItem[] = [
  { tab: '待办', key: '1' },
  { tab: '抄送待审阅', key: '4' },
  { tab: '已办', key: '2' },
  { tab: '我的发起', key: '3' },
];
/** 生成平台待办操作菜单*/
const tableOperation = (
  active: string,
  item: IApprovalItem | IApplyItem,
  callback: (refresh: boolean) => void,
) => {
  const afterOperate = (success: boolean) => {
    if (success) {
      message.success(`操作成功`);
      callback(true);
    } else {
      message.error(`操作失败`);
    }
  };
  switch (active) {
    case '1':
      return [
        {
          key: 'approve',
          label: '同意',
          onClick: () =>
            (item as IApprovalItem)
              .pass(CommonStatus.ApproveStartStatus, '')
              .then(({ success }) => {
                afterOperate(success);
              }),
        },
        {
          key: 'refuse',
          label: '拒绝',
          onClick: () =>
            (item as IApprovalItem).reject(200, '').then(({ success }) => {
              afterOperate(success);
            }),
        },
      ];
    case '2':
      return [
        {
          key: 'approve',
          label: '同意',
          onClick: () =>
            (item as IApprovalItem)
              .pass(CommonStatus.ApproveStartStatus, '')
              .then(({ success }) => {
                afterOperate(success);
              }),
        },
      ];
    case '3':
      return [
        {
          key: 'retractApply',
          label: '取消申请',
          onClick: () =>
            (item as IApplyItem)
              .cancel(CommonStatus.RejectStartStatus, '')
              .then(({ success }) => {
                afterOperate(success);
              }),
        },
      ];
    default:
      return [
        {
          key: 'retractApply',
          label: '已阅',
          onClick: () =>
            (item as IApprovalItem)
              .pass(CommonStatus.ApproveStartStatus, '')
              .then(({ success }) => {
                afterOperate(success);
              }),
        },
      ];
  }
};
const statusMap = {
  1: {
    color: 'blue',
    text: '待处理',
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
/** 生成订单操作菜单  */
const orderOperation = (
  activeStatus: string,
  data: IApprovalItem | IOrderApplyItem,
  callback: Function,
  _record?: XOrderDetail,
) => {
  const afterOperate = (success: boolean, name: string) => {
    if (success) {
      message.success(`${name}成功`);
      callback(true);
    } else {
      message.error(`${name}失败`);
    }
  };
  const item = data.Data;
  // 是否是待发货的订单状态
  let allowToCancel = item.status < 102;
  if (activeStatus == `6`) {
    if (_record) {
      allowToCancel = _record ? _record.status < 102 : false;
    } else {
      allowToCancel =
        !!item.details &&
        item.details.find((n: XOrderDetail) => n.status < OrderStatus.Deliver);
    }
  }
  const menu = [];
  if (allowToCancel) {
    menu.push({
      key: 'retractApply',
      label: '取消订单',
      onClick: () => {
        if (activeStatus == '5') {
          (data as IApprovalItem)
            .reject(OrderStatus.SellerCancel, '')
            .then(({ success }) => afterOperate(success, '取消订单'));
        } else if (_record) {
          (data as IOrderApplyItem)
            .cancelItem(_record?.id, OrderStatus.BuyerCancel, '')
            .then(({ success }) => afterOperate(success, '取消订单'));
        }
      },
    });
    if (activeStatus == `5`) {
      menu.push({
        key: 'approve',
        label: '确认交付',
        onClick: () => {
          (data as IApprovalItem).pass(OrderStatus.Deliver, '').then(({ success }) => {
            afterOperate(success, '确认交付');
          });
        },
      });
    }
  } else if (_record && _record.status == OrderStatus.Deliver) {
    menu.push({
      key: 'reject',
      label: '退货退款',
      onClick: () => {
        (data as IOrderApplyItem)
          .reject(_record.id, OrderStatus.RejectOrder, '')
          .then(({ success }) => {
            afterOperate(success, '退货退款');
          });
      },
    });
  }
  return menu;
};
// class TodoService {
//   applicationInstance: ApplicationTodo | undefined;
//   friend = friendTodo;
//   org = teamTodo;
//   store = storeTodo;
//   product = productTodo;
//   order = orderTodo;
//   currentAppid: string = '';

//   /**当前页面模块名称 */
//   currentModel: pageModel = 'friend';
//   /** 当前tab数据状态*/
//   activeStatus: tabStatus = '1';
//   /**数据状态枚举 */

//   /**当前实例 */
//   get currentInstance(): FriendTodo | TeamTodo | StoreTodo | ProductTodo {
//     return this[this.currentModel];
//   }
//   /**  获取平台待办列表 */
//   public get currentList() {
//     const listStatusCode = {
//       '1': 'todoList',
//       '2': 'doList',
//       '3': 'applyList',
//       '5': 'saleList',
//       '6': 'buyList',
//     };
//     const selfList = listStatusCode[this.activeStatus];
//     return this.currentInstance[selfList] || [];
//   }
//   /**  获取应用待办列表 */
//   public applicationList = async () => {
//     if (!this.applicationInstance) return;
//     const listStatusCode = {
//       '1': 'getTodoList',
//       '2': 'getDoList',
//       '3': 'getApplyList',
//       '4': 'getNoticeList',
//     };
//     const selfListFn = listStatusCode[this.activeStatus];
//     return await this.applicationInstance[selfListFn]();
//   };
//   /** 生成平台待办操作菜单*/
//   tableOperation = (
//     item: XRelation | XMarketRelation | XMarketRelation | XMerchandise,
//     callback: Function,
//   ) => {
//     const afterOperate = (success: boolean, name: string) => {
//       if (success) {
//         message.success(`${name}成功`);
//         callback(true);
//       } else {
//         message.error(`${name}失败`);
//       }
//     };
//     return this.activeStatus == '1'
//       ? [
//           {
//             key: 'approve',
//             label: '同意',
//             onClick: () => {
//               this.currentInstance.approve(item).then(({ success }) => {
//                 afterOperate(success, '同意');
//               });
//             },
//           },
//           {
//             key: 'refuse',
//             label: '拒绝',
//             onClick: () => {
//               this.currentInstance.reject(item).then(({ success }) => {
//                 afterOperate(success, '拒绝');
//               });
//             },
//           },
//         ]
//       : this.activeStatus == '2'
//       ? [
//           {
//             key: 'approve',
//             label: '同意',
//             onClick: () => {
//               this.currentInstance.approve(item).then(({ success }) => {
//                 afterOperate(success, '同意');
//               });
//             },
//           },
//         ]
//       : [
//           {
//             key: 'retractApply',
//             label: '取消申请',
//             onClick: () => {
//               this.currentInstance.cancel(item).then(({ success }) => {
//                 afterOperate(success, '取消');
//               });
//             },
//           },
//         ];
//   };
//   /** 生成订单操作菜单  */
//   orderOperation = (item: XOrder | XOrderDetail, callback: Function) => {
//     const afterOperate = (success: boolean, name: string) => {
//       if (success) {
//         message.success(`${name}成功`);
//         callback(true);
//       } else {
//         message.error(`${name}失败`);
//       }
//     };
//     // 是否是待发货的订单状态
//     let allowToCancel = item.status < 102;
//     if (this.activeStatus == `6`) {
//       if (typeof (item as XOrder).details === 'object') {
//         // 说明他是采购订单的主订单 不能取消订单
//         allowToCancel = false;
//       }
//     }
//     const menu = [];
//     if (allowToCancel) {
//       menu.push({
//         key: 'retractApply',
//         label: '取消订单',
//         onClick: () => {
//           this.order
//             .cancel(
//               item,
//               this.activeStatus == '5'
//                 ? OrderStatus.SellerCancel
//                 : OrderStatus.BuyerCancel,
//             )
//             .then(({ success }) => {
//               afterOperate(success, '取消订单');
//             });
//         },
//       });
//       if (this.activeStatus == `5`) {
//         menu.push({
//           key: 'approve',
//           label: '确认交付',
//           onClick: () => {
//             this.order.deliver(item as XOrderDetail).then(({ success }) => {
//               afterOperate(success, '确认交付');
//             });
//           },
//         });
//       }
//     } else if (item.status == 102 && this.activeStatus == `6`) {
//       menu.push({
//         key: 'reject',
//         label: '退货退款',
//         onClick: () => {
//           this.order.reject(item as XOrderDetail).then(({ success }) => {
//             afterOperate(success, '退货退款');
//           });
//         },
//       });
//     }
//     return menu;
//   };

//   public menuCallback = Function;
// }

// const todoService = new TodoService();
// export default todoService;
export {
  applicationTabs,
  orderOperation,
  orderTabs,
  statusList,
  statusMap,
  tableOperation,
};
