import { MarketTypes } from 'typings/marketType';
import API from '@/services';
import StoreContent from './content';
import Provider from '@/ts/core/provider';
import AppStore from '@/ts/core/market/appstore';
/**
 * @desc: 仓库模块 导航控件
 * @return {*}/
 */
type menyuType = 'app' | 'docx' | 'data' | 'assets';
type footerTreeType = {
  appTreeData: any[];
  docxTreeData: any[];
  dataTreeData: any[];
  assetsTreeData: any[];
};
/**
 * @desc: 处理 翻页参数问题
 * @param {T} params
 * @return {*}
 */
const _resetParams = (params: any) => {
  const { page, pageSize, ...rest } = params;
  const num = (page - 1) * pageSize;

  return {
    offset: num >= 0 ? num : 0,
    limit: pageSize || 20,
    ...rest,
  };
};
class StoreClassify {
  private _curMarket: MarketTypes.MarketType; // 当前商店实例

  private currentMenu!: '应用';
  private curTreeData: any;
  public TreeCallBack!: Function; //页面传进来的 钩子

  // 底部区域
  // 缓存 tree 展示数据
  public footerTree: footerTreeType = {
    appTreeData: [],
    docxTreeData: [],
    dataTreeData: [],
    assetsTreeData: [],
  };

  // 顶部区域
  static SelfMenu = [
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
    this.curTreeData = this.footerTree[`${key}TreeData`];
    //1. 直接触发展示区 更新展示数据
    StoreContent.changeMenu(key);
    //2. 控制底部分类
    this.getTreeData();
  }

  /**
   * @desc: 获取树形组件 展示数据
   * @return {*}
   */
  protected getTreeData() {
    //TODO:调用获取节点信息接口
    this.getMarketList();
  }
  /**
   * @desc: 获取市场列表
   * @param {number} params.offset 起始位置
   * @param {number} params.limit  数量限制
   * @param {string} params.filter 过滤关键字
   * @return {*}
   */
  getOwnMarket = async () => {
    const marketTree = await Provider.person.getJoinMarkets();
    console.log('获取拥有的市场55', marketTree);

    let arr = marketTree.map((itemModel: AppStore, index: any) => {
      const item = itemModel.selfData;
      return {
        title: item.name,
        key: `0-${index}`,
        id: item.id,
        children: [],
        node: item,
      };
    });

    this.footerTree.appTreeData = arr;

    this.TreeCallBack(arr);
  };
  /**
   * @desc: 获取市场列表
   * @param {number} params.offset 起始位置
   * @param {number} params.limit  数量限制
   * @param {string} params.filter 过滤关键字
   * @return {*}
   */
  public async getMarketList() {
    const params = {
      page: 1,
      pageSize: 100,
      filter: '',
    };
    const { data, success } = await API.market.searchOwn({
      data: _resetParams(params),
    });
    if (success) {
      const { result = [], total = 0 } = data;
      console.log('获取拥有的市场API', result);
      let arr = result.map((item: { name: any; id: any }, index: any) => {
        return {
          title: item.name,
          key: `0-${index}`,
          id: item.id,
          children: [],
        };
      });
      this.footerTree.appTreeData = arr;
      this.TreeCallBack(arr);
    }
  }
}

const storeClassify = new StoreClassify();

export default storeClassify;
