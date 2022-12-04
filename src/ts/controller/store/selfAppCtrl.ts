import { ProductModel } from '@/ts/base/model';
import { BaseProduct } from '@/ts/core/market';
import { IMTarget } from '@/ts/core/target/itarget';
import { kernel } from '../../base';
import BaseController from '../baseCtrl';
import userCtrl, { UserPartTypes } from '../setting/userCtrl';
import { marketColumns, myColumns } from './config';
const selfAppMenu = 'selfAppMenu';

const defaultTreeData: TreeType[] = [
  {
    title: '我的应用',
    key: 'app',
    id: '1',
    children: [],
  },
  {
    title: '文档',
    key: 'doc',
    id: '2',
    children: [],
  },
  {
    title: '数据',
    key: 'data',
    id: '3',
    children: [],
  },
  {
    title: '资源',
    key: 'assets',
    id: '4',
    children: [],
  },
];

export type MenuOptTypes =
  | '新增子级'
  | '重命名'
  | '创建副本'
  | '拷贝链接'
  | '移动到'
  | '固定为常用'
  | '删除';

export enum SelfCallBackTypes {
  'TreeData' = 'TreeData',
  'TableData' = 'TableData',
  'Recently' = 'Recently',
}
export interface TreeType {
  title: string;
  key: string;
  id: string;
  children: TreeType[];
}
interface RecMsg {
  Key: string;
  Name: string;
  UpdateTime: string;
  data: TreeType[];
}
class SelfAppController extends BaseController {
  private _curSpace: IMTarget = userCtrl.User;
  /* -----**菜单数据区---------- */
  private _curMenuKey!: string; //当前选中菜单key
  private _treeData!: TreeType[]; //缓存树形数据
  /* -----**应用功能区---------- */
  public breadcrumb: string[] = ['仓库', '我的应用']; //面包屑
  private _curProduct: BaseProduct | undefined = undefined;
  // 顶部最近使用应用
  private recentlyUsedApps!: BaseProduct[];
  // 常用菜单
  public static oftenUsedMenus = [
    { label: '应用', key: 'app', icon: 'AppstoreOutlined' }, // 菜单项务必填写 key
    { label: '文档', key: 'doc', icon: 'FileTextOutlined' },
    { label: '数据', key: 'data', icon: 'FundOutlined' },
    { label: '资源', key: 'assets', icon: 'DatabaseOutlined' },
  ];
  /* 菜单列表 */
  private static _MenuOpts = [
    '新增子级',
    '重命名',
    '创建副本',
    '拷贝链接',
    '移动到',
    '固定为常用',
    '删除',
  ];

  // 存储 我的应用原数据 提供过滤使用
  private selfAppsData: BaseProduct[] = [];

  // 获取数据
  public get curProduct(): BaseProduct | undefined {
    return this._curProduct || undefined;
  }
  public get tableData(): BaseProduct[] {
    return this.selfAppsData;
  }
  public get treeData(): TreeType[] {
    return this._treeData;
  }
  public get MenuOpts(): string[] {
    return SelfAppController._MenuOpts;
  }

  public get curMenuKey(): string {
    return this._curMenuKey;
  }

  // 设置数据

  set curMenuKey(key: string) {
    this._curMenuKey = key;
  }

  set curProduct(prod: BaseProduct | undefined) {
    this._curProduct = prod;
  }

  constructor() {
    super();
    /* 监听空间切换 */
    userCtrl.subscribePart(UserPartTypes.Space, async () => {
      // console.log('监听单位切换', userCtrl.Space, userCtrl.SpaceData);
      this._curSpace = userCtrl.IsCompanySpace ? userCtrl.Space : userCtrl.User;
      this.resetData();
    });
    /* 获取 历史缓存的 自定义目录 */
    kernel.anystore.subscribed(selfAppMenu, 'user', (Msg: RecMsg) => {
      // console.log('订阅数据推送 自定义目录===>', Msg.data);
      const { data = defaultTreeData } = Msg;
      this._treeData = data;
      this.changCallbackPart(SelfCallBackTypes.TreeData);
    });
  }

  private resetData() {
    this._curMenuKey = 'app';
    this.breadcrumb = ['仓库', '我的应用'];
    this._curProduct = undefined;
    this.querySelfApps();
  }
  public handleMenuOpt(type: MenuOptTypes, _data: TreeType) {
    console.log('菜单操作', type, _data);
  }

  /**
   * 缓存自定义目录
   * @param message 新消息，无则为空
   */
  public cacheSelfMenu(data: TreeType[]): void {
    console.log('缓存触发', data);
    if (!data || !(data instanceof Array)) {
      return console.error('缓存自定义目录格式有误,请重试');
    }
    this._treeData = data || defaultTreeData;
    this.changCallbackPart(SelfCallBackTypes.TreeData);
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
  /**
   * @desc: 获取表格头部展示数据
   * @return {*}
   */
  public getColumns(pageKey?: string) {
    switch (pageKey) {
      case 'appInfo':
      case 'myApp':
        return myColumns;
      case 'market':
        return marketColumns;
      default:
        return [];
    }
    //TODO:待完善
  }
  /**
   * @desc: 获取我的应用列表
   * @return {BaseProduct[]} 应用列表
   */
  public async querySelfApps() {
    const list = await this._curSpace.getOwnProducts();
    console.log('获取我的应用表格数据', list);
    this.selfAppsData = list;
    this.changCallbackPart(SelfCallBackTypes.TableData);
  }

  /**
   * @desc: 添加最近使用应用
   * @param {BaseProduct} data
   */
  public OpenApp(data: BaseProduct) {
    this.recentlyUsedApps.unshift(data);
    this.changCallbackPart(SelfCallBackTypes.Recently);
  }

  /**
   * @desc 创建应用
   * @params
   */
  public createProduct = async (data: ProductModel) => {
    const Target = userCtrl.Space ?? userCtrl.User;
    Target!.createProduct(data);
  };

  /**
   * @desc: 判断当前操作对象是否为已选产品 不是则 修改选中
   * @param {Product} item
   */
  public selectedProduct(item: BaseProduct) {
    // 判断当前操作对象是否为已选产品 不是则 修改选中
    // item.prod.id !== this.curProduct?._prod.id &&
    console.log('修改当前操作应用', item);

    this._curProduct = item;
  }

  /**
   * @desc: 查询分享信息
   */
  public async queryProductExtend(destType: string, teamId: string) {
    console.log('查询分享信息', destType, teamId);
    if (!destType) {
      return;
    }
    let { success, data, msg } = await this._curProduct!.queryExtend(
      destType,
      teamId || '0',
    );
    console.log('分享信息', success, data, msg);
    if (!success) {
      console.error(msg);
      return [];
    } else {
      console.log('分享信息', data.result);
      return data.result;
    }
  }
  /**
   * @desc: 分享应用
   */
  public async ShareProduct(teamId: string, destIds: string[], destType: string) {
    let { success, msg } = await this._curProduct!.Extend(teamId, destIds, destType);

    if (!success) {
      console.error(msg);
    } else {
      console.log('共享成功');
    }
  }
}

export default new SelfAppController();
