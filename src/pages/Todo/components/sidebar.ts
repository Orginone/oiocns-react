// TODO 获取应用待办
// import { loadApplicationTodos, MenuTodoType } from '@/ts/core/todo';
// import { ApplicationTodo } from '@/ts/core/todo/';
// import { MenuProps } from 'antd';
// import todoService from '.';

const apps = [
  {
    label: '公益仓',
    key: '/todo/gyc',
    icon: `HomeOutlined`,
  },
  { label: '办公OA', key: '/todo/oa', icon: `FileTextOutlined` },
  { label: '资产管理', key: '/todo/asset', icon: `FundOutlined` },
  { label: '资产监控', key: '/todo/monitor', icon: `DatabaseOutlined` },
];
// 平台待办
const systemTodo = [
  { label: '好友申请', key: '/todo/friend', icon: `UserOutlined` },
  { label: '单位审核', key: '/todo/org', icon: `AuditOutlined` },
  {
    label: '商店审核',
    key: 'appAndStore',
    icon: `ShopOutlined`,
    children: [
      {
        label: '应用上架',
        key: '/todo/product',
        icon: `ShopOutlined`,
      },
      { label: '加入市场', key: '/todo/store', icon: `ShopOutlined` },
    ],
  },
  { label: '订单管理', key: '/todo/order', icon: `UnorderedListOutlined` },
];

class SideBar {
  private _topMenu = systemTodo;
  private _bottomMenu: MenuTodoType[] = apps;

  private _currentBread: string[];
  _currentMenuId: string = ''; // 当前 应用待办id
  /**当前菜单 */
  get menuItems() {
    return [
      {
        type: 'group',
        label: '平台待办',
        children: this._topMenu,
      },
      {
        type: 'group',
        label: '应用待办',
        children: this._bottomMenu,
      },
    ];
  }
  get curentBread() {
    return this._currentBread || [];
  }
  constructor() {
    this.loadApplicationTodos();
    this._currentBread = [];
  }
  /**点击左侧菜单 */
  public handleClickMenu = (productInstans: ApplicationTodo) => {
    if (productInstans) {
      this.currentMenuId = productInstans.id;
    } else {
      this.currentMenuId = '';
    }
  };
  set currentMenuId(value: string) {
    this._currentMenuId = value;
    if (value !== '' && this.currentApplication) {
      todoService.applicationInstance = this.currentApplication.node;
      this._currentBread = ['应用待办', this.currentApplication.label];
    } else {
      todoService.applicationInstance = undefined;
      this._currentBread = [];
    }
  }
  get currentApplication() {
    return this._bottomMenu && this._currentMenuId !== ''
      ? this._bottomMenu.find((n) => n && (n.key + '').indexOf(this._currentMenuId) > -1)
      : null;
  }
  /**
   * 查询我的应用
   */
  private loadApplicationTodos = async () => {
    const data = await loadApplicationTodos();
    this._bottomMenu = data;
  };
}

export default new SideBar();
