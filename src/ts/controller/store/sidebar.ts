import StoreContent from './content';
import Provider from '@/ts/core/provider';
import AppStore from '@/ts/core/market/appstore';
import Company from '@/ts/core/target/company';
import { XMarket, XProduct } from '@/ts/base/schema';
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
  node?: AppStore;
  children?: any[];
};

class StoreClassify {
  // constructor(parameters) {}
  // static curCompoy: Company = Provider.getPerson.curCompany as Company; // 获取当前所处的单位

  // 顶部菜单区域
  public static SelfMenu = [
    { label: '应用', key: 'app', icon: 'AppstoreOutlined' }, // 菜单项务必填写 key
    { label: '文档', key: 'doc', icon: 'FileTextOutlined' },
    { label: '数据', key: 'data', icon: 'FundOutlined' },
    { label: '资源', key: 'assets', icon: 'DatabaseOutlined' },
  ];
  // 商店导航
  static ShopMenu = [{ title: '开放市场', children: this.SelfMenu }];
  public _curMarket: AppStore | undefined = new AppStore({
    id: '358266491960954880',
  } as XMarket); // 当前商店信息
  public curPageType: 'app' | 'market' = 'app'; // 当前功能页面 app-我的应用页面  market-市场页面
  public curMenu: { app: MenuTypes; market: MenuTypes } = { app: 'app', market: 'app' }; // 当前所选菜单
  public curMenuData: any[] = StoreClassify.SelfMenu; // 当前展示菜单数据
  public curTreeData: any; // 当前展示树内容
  public breadcrumb: string[] = ['仓库', '我的应用']; //导航展示
  public TreeCallBack!: Function; //页面传进来的更新树形区域 钩子
  //选择商店后 触发展示区回调
  // 记录 已选菜单
  recordPageType: { app: MenuTypes; market: MenuTypes } = { app: 'app', market: 'app' };

  // 底部区域
  // 缓存 所有 tree 展示数据
  public appFooterTree: footerTreeType = {
    appTreeData: [
      {
        title: '测试目录1',
        key: '1-1',
        id: '1',
        children: [
          { title: '测试目录33', key: '1-1-1', id: '1-1-1', children: [] },
          { title: '测试目录44', key: '1-1-2', id: '1-1-2', children: [] },
        ],
      },
      { title: '测试目录2', key: '1-2', id: '2', children: [] },
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
    this.TreeCallBack(this.curTreeData);
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
      this.TreeCallBack(targetData);
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
      this.TreeCallBack([]);
      return;
    }
    if (data.length > 0) {
      this.curTreeData = data;
      this.TreeCallBack([...this.curTreeData]);
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
  /* --------------------市场功能区--------------------- */
  /**
   * 页面操作--切换商店
   */
  public handleSelectMarket(market: AppStore) {
    this._curMarket = market;
    //修改面包屑 当前展示区域
    this.breadcrumb[2] = '应用市场';
    this.breadcrumb[3] = market.store.name || '商店';
    console.log('面包靴 商店', this.breadcrumb);

    this.TreeCallBack(market);
  }
  /**
   * @desc: 获取市场列表
   * @param {number} params.offset 起始位置
   * @param {number} params.limit  数量限制
   * @param {string} params.filter 过滤关键字
   * @return {*}
   */
  private async getOwnMarket() {
    const marketTree = await Provider.getPerson!.getJoinMarkets();
    let arr: any = marketTree.map((itemModel: AppStore, index: any) => {
      const item = itemModel.store;
      return {
        title: item.name,
        key: `0-${index}`,
        id: item.id,
        node: item,
        children: [],
      };
    });

    this.marketFooterTree.appTreeData = arr;

    this.TreeCallBack && this.TreeCallBack(arr);
  }
}

const storeClassify = new StoreClassify();

export default storeClassify;
