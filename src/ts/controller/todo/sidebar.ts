// TODO 获取应用待办
import { Product } from '@/ts/core/market';
import Provider from '@/ts/core/provider';
import { MenuProps } from 'antd';

const apps: MenuProps[`items`] = [
  {
    label: '公益仓',
    key: '/todo/gyc',
    icon: `HomeOutlined`,
  }, // <HomeOutlined /> },
  { label: '办公OA', key: '/todo/oa', icon: `FileTextOutlined` }, // <FileTextOutlined /> },
  { label: '资产管理', key: '/todo/asset', icon: `FundOutlined` }, // <FundOutlined /> },
  { label: '资产监控', key: '/todo/monitor', icon: `DatabaseOutlined` }, // <DatabaseOutlined />, children: [] },
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
]; //.map((n) => ({ ...n, icon: React.createElement(Icon[n.icon]) }));

class SideBar {
  private _topMenu = {
    type: 'group',
    label: '平台待办',
    children: systemTodo,
  };
  private _bottomMenu = {
    type: 'group',
    label: '应用待办',
    children: apps,
  };
  private _currentBread: string[];
  /**当前菜单 */
  get menuItems() {
    return [this._topMenu, this._bottomMenu];
  }
  get curentBread() {
    return this._currentBread || [];
  }
  constructor() {
    this.getOwnProducts();
    this._currentBread = [];
  }
  /**点击左侧菜单 */
  public handleClickMenu = (name: string, productInstans: Product) => {
    console.log('左侧菜单点击应用对象', productInstans.prod);
    if (productInstans) {
      this._currentBread = ['应用待办', productInstans.prod.name];
    } else {
      this._currentBread = ['平台待办', name];
    }
  };

  /**
   * 查询我的应用
   */
  private getOwnProducts = async () => {
    const data: Product[] | undefined = await Provider.getPerson?.getOwnProducts();
    console.log('menu', data);
    let menu: { label: string; key: string; node: Product }[] = [];
    if (data && data.length > 0) {
      // 遍历数据生成待办应用列表
      menu = data.map((product) => {
        const prod = product.prod;
        return {
          label: prod.name,
          key: '/todo/' + prod.id,
          node: product,
        };
      });
    }
    this._bottomMenu = {
      type: 'group',
      label: '应用待办',
      children: menu,
    };
  };
}

export default new SideBar();
