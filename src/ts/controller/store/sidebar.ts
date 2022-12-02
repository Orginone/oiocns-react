import StoreContent from './content';
import { Market } from '@/ts/core/market';
// import Company from '@/ts/core/target/company';
import { XMarket } from '@/ts/base/schema';
import BaseController from '../baseCtrl';
import { kernel } from '@/ts/base';
import userCtrl from '../setting/userCtrl';
/**
 * @desc: 仓库模块 导航控件
 * @return {*}
 */
type MenuTypes = 'app' | 'docx' | 'data' | 'assets';
type footerTreeType = {
  appTreeData: AppTreeType[];
  docxTreeData: any[];
  dataTreeData: any[];
  assetsTreeData: any[];
};
// 商店列表 数据类型
type AppTreeType = {
  title: string;
  key: string;
  id: string;
  node?: Market;
  children?: any[];
};
const selfAppMenu = 'selfAppMenu';
class StoreClassify extends BaseController {
  public marketMenber: any;
  constructor() {
    super();
    kernel.anystore.subscribed(selfAppMenu, 'user', (data: any) => {
      console.log('订阅数据推送 自定义目录===>', data.data);
      if (data?.data?.length > 0) {
        this.appFooterTree.appTreeData = data.data;
      }
    });
  }
  // static curCompoy: Company = Provider.getPerson.curCompany as Company; // 获取当前所处的单位

  // 顶部菜单区域
  public static SelfMenu = [
    { label: '应用', key: 'app', icon: 'AppstoreOutlined' }, // 菜单项务必填写 key
    { label: '文档', key: 'doc', icon: 'FileTextOutlined' },
    { label: '数据', key: 'data', icon: 'FundOutlined' },
    { label: '资源', key: 'assets', icon: 'DatabaseOutlined' },
  ];
  // 商店导航
  static ShopMenu = [{ title: '开放市场', onclick: {}, children: this.SelfMenu }];
  public _curMarket: Market | undefined = new Market({
    id: '358266491960954880',
  } as XMarket); // 当前商店信息
  public curPageType: 'app' | 'market' = 'app'; // 当前功能页面 app-我的应用页面  market-市场页面
  public curMenu: { app: MenuTypes; market: MenuTypes } = { app: 'app', market: 'app' }; // 当前所选菜单
  public curMenuData: any[] = StoreClassify.SelfMenu; // 当前展示菜单数据
  public curTreeData: any; // 当前展示树内容
  public breadcrumb: string[] = ['仓库', '我的应用']; //导航展示
  // public TreeCallBack!: Function; //页面传进来的更新树形区域 钩子
  //选择商店后 触发展示区回调
  // 记录 已选菜单
  recordPageType: { app: MenuTypes; market: MenuTypes } = { app: 'app', market: 'app' };

  // 底部区域
  // 缓存 所有 tree 展示数据
  public appFooterTree: footerTreeType = {
    appTreeData: [
      {
        title: '默认分类',
        key: '1-1',
        id: '1',
        children: [],
      },
      { title: '我的应用', key: '1-2', id: '2', children: [] },
    ],
    docxTreeData: [],
    dataTreeData: [],
    assetsTreeData: [],
  };
  public marketFooterTree: footerTreeType = {
    appTreeData: [],
    docxTreeData: [],
    dataTreeData: [],
    assetsTreeData: [],
  };
  public get getMarketData() {
    return this.marketFooterTree.appTreeData;
  }

  /**
   * @desc: 控制层对应操作页面变化展示数据
   * @param {'app' | 'market'} type
   * @return {*}
   */
  public changePageType(type: 'app' | 'market') {
    this.curPageType = type;
    // this.curMenu[this.curPageType] = key;
    // this.curMenu[type] = this.recordPageType[type];
    this.curTreeData = this[`${type}FooterTree`][`${this.curMenu[type]}Treedata`] || [];
    setTimeout(() => {
      this.changCallbackPart(`${type}TreeData`, this.curTreeData);
    }, 5);
  }
  /**
   * @desc 处理点击顶部导航获取tree 数据
   * @param  {any}  item 单个菜单
   */
  public handleMenuClick(key: MenuTypes) {
    this.curMenu[this.curPageType] = key;
    const targetData = this[`${this.curPageType}FooterTree`][`${key}TreeData`];
    if (targetData?.length > 0) {
      this.curTreeData = targetData;
      // this.TreeCallBack(targetData);
      this.changCallbackPart(`${key}TreeData`, targetData);
      return;
    }
    //1. 直接触发展示区 更新展示数据
    key === 'app' && StoreContent.changeMenu(key);
    //2. 控制底部分类
    this.getTreeData();
  }

  /**
   * @desc: 获取树形组件 展示数据
   * @return {*}
   */
  public getTreeData() {
    // 1.获取市场
    //获取文档
    const data =
      this[`${this.curPageType}FooterTree`][
        `${this.curMenu[this.curPageType]}TreeData`
      ] || [];
    console.log('获取treeData', this.curPageType, this.curMenu, data);

    //TODO: 临时处理数据与 资源导航展示
    if (
      this.curMenu[this.curPageType] == 'data' ||
      this.curMenu[this.curPageType] == 'assets'
    ) {
      this.changCallbackPart(`${this.curPageType}TreeData`, []);
      return;
    }
    if (data.length > 0) {
      this.curTreeData = data;
      this.changCallbackPart(`${this.curPageType}TreeData`, [...this.curTreeData]);
    } else {
      console.log('获取-tree');

      this.getOwnMarket();
    }
  }

  /**
   * @desc: 页面操作--切换目录
   * @param {any} treeItem
   * @return {*}
   */
  public handleSelectTree(treeItem: any) {
    //TODO:
    // //修改面包屑 当前展示区域
    this.breadcrumb[1] = '我的应用';
    this.breadcrumb[2] = treeItem.title || '获取失败';
    console.log('面包靴 应用', this.breadcrumb);
    // this.TreeCallBack(market);
  }
  /**
   * @desc: 我的应用页面更新 自定义目录
   * @param {any} list
   */
  public updataSelfAppMenu(list: any[]) {
    this.appFooterTree.appTreeData = list;
    this.cacheSelfMenu(list);
    this.changCallbackPart(`appTreeData`, [...list]);
  }
  /* ----------------------------------------市场功能区--------------------------------------- */
  /**
   * 页面操作--切换商店
   */
  public async handleSelectMarket(market: Market) {
    this._curMarket = market;
    //修改面包屑 当前展示区域
    this.breadcrumb[2] = '应用市场';
    this.breadcrumb[3] = market.market.name || '商店';
    console.log('面包屑 商店', this.breadcrumb);
    // 商店用户管理
    const res = await market.getMember({ offset: 0, limit: 10, filter: '' });
    if (res?.success) {
      this.marketMenber = res?.data?.result;
    }
    this.changCallback();
    return this.marketMenber;

    // this.changCallbackPart(`${this.curPageType}TreeData`, [...this.curTreeData]);
    // this.TreeCallBack(market);
  }

  public removeMember = async (targetIds: string[]) => {
    console.log('移出成员ID合集', targetIds);
    const res = await this._curMarket?.removeMember(targetIds);
    console.log('移出成员', res);
  };

  /**
   * @desc: 获取市场列表
   * @param {number} params.offset 起始位置
   * @param {number} params.limit  数量限制
   * @param {string} params.filter 过滤关键字
   * @return {*}
   */
  public async getOwnMarket(isCaback = true) {
    const marketTree = await userCtrl.User!.getJoinMarkets();
    let arr: any = marketTree.map((itemModel: Market, index: any) => {
      const item = itemModel.market;
      let arrs = ['基础详情', '用户管理'];
      arrs.push(`${item.belongId === userCtrl.User?.target.id ? '删除商店' : '退出商店'}`);
      return {
        title: item.name,
        key: `0-${index}`,
        id: item.id,
        node: itemModel,
        children: [],
        belongId: item.belongId,
        menus: arrs,
      };
    });

    this.marketFooterTree.appTreeData = arr;
    if (!isCaback) {
      return marketTree;
    }
    isCaback && this.changCallbackPart(`${this.curPageType}TreeData`, arr);
  }

  /**
   * 缓存自定义目录
   * @param message 新消息，无则为空
   */
  public cacheSelfMenu(data: any): void {
    console.log('缓存触发', data);

    kernel.anystore.set(
      selfAppMenu,
      {
        operation: 'replaceAll',
        data: {
          data: data,
        },
      },
      'user',
    );
  }
}

const storeClassify = new StoreClassify();

export default storeClassify;
