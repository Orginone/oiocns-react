import StoreContent from './content';
import Provider from '@/ts/core/provider';
import AppStore from '@/ts/core/market/appstore';
// import Company from '@/ts/core/target/company';
/**
 * @desc: 仓库模块 导航控件
 * @return {*}/
 */
type menyuType = 'app' | 'docx' | 'data' | 'assets';
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
  // static curCompoy: Company = Provider.getPerson().curCompany as Company;
  public _curMarket: AppStore; // 当前商店信息
  public currentMenu: 'myApps' | 'market' = 'myApps'; // 当前功能页面 myApps-我的应用页面  market-市场页面
  private curTreeData: any; // 当前展示树内容
  public breadcrumb: string[] = ['仓库', '我的应用']; //导航展示
  public TreeCallBack: undefined | ((data: any[]) => void) = undefined; //页面传进来的更新树形区域 钩子
  public SelectMarketCallBack: undefined | ((item: AppStore) => void) = undefined; //选择商店后 触发展示区回调

  // 底部区域
  // 缓存 所有 tree 展示数据
  public footerTree: footerTreeType = {
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

  // 顶部菜单区域
  public static SelfMenu = [
    { title: '应用', code: 'app' },
    { title: '文档', code: 'docx' },
    { title: '数据', code: 'data' },
    { title: '资源', code: 'assets' },
  ];
  // 商店导航
  // static ShopMenu = [{ title: '开放市场', children: this.SelfMenu }];

  /**
   * @desc 处理点击顶部导航获取tree 数据
   * @param  {any}  item 单个菜单
   */
  public handleMenuClick(key: menyuType) {
    if (this.footerTree[`${key}TreeData`].length > 0) {
      this.curTreeData = this.footerTree[`${key}TreeData`];
      return;
    }
    //1. 直接触发展示区 更新展示数据
    StoreContent.changeMenu(key);
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

    if (this.currentMenu === 'myApps') {
      //TODO:获取 自定义分类树
      this.curTreeData = this.footerTree.appTreeData;
      this.TreeCallBack && this.TreeCallBack(this.curTreeData);
    } else {
      this.getOwnMarket();
    }
  }

  /**
   * 页面操作--切换商店
   */
  public handleSelectTree(market: AppStore) {
    this._curMarket = market;
    //修改面包屑 当前展示区域
    this.breadcrumb[2] = '应用市场';
    this.breadcrumb[3] = market.getStore.name || '商店';
    console.log('面包靴 应用', this.breadcrumb);
    this.SelectMarketCallBack && this.SelectMarketCallBack(market);
  }
  /* --------------------市场功能区--------------------- */
  /**
   * 页面操作--切换商店
   */
  public handleSelectMarket(market: AppStore) {
    this._curMarket = market;
    //修改面包屑 当前展示区域
    this.breadcrumb[2] = '应用市场';
    this.breadcrumb[3] = market.getStore.name || '商店';
    console.log('面包靴 商店', this.breadcrumb);

    this.SelectMarketCallBack && this.SelectMarketCallBack(market);
  }
  /**
   * @desc: 获取市场列表
   * @param {number} params.offset 起始位置
   * @param {number} params.limit  数量限制
   * @param {string} params.filter 过滤关键字
   * @return {*}
   */
  private async getOwnMarket() {
    const marketTree = await Provider.getPerson().getJoinMarkets();
    let arr: any = marketTree.map((itemModel: AppStore, index: any) => {
      const item = itemModel.getStore;
      return {
        title: item.name,
        key: `0-${index}`,
        id: item.id,
        node: item,
        children: [],
      };
    });

    this.footerTree.appTreeData = arr;

    this.TreeCallBack && this.TreeCallBack(arr);
  }
}

const storeClassify = new StoreClassify();

export default storeClassify;
