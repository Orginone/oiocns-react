import { ProductModel } from '@/ts/base/model';
import IProduct from '@/ts/core/market/iproduct';
import { IMTarget } from '@/ts/core/target/itarget';
import { kernel } from '../../base';
import BaseController from '../baseCtrl';
import userCtrl, { UserPartTypes } from '../setting/userCtrl';
import { marketColumns, myColumns, shareInfoColumns } from './config';
import { Modal } from 'antd';
const selfAppMenu = 'selfAppMenu';
const RecentlyApps = 'RecentlyApps';
const { confirm } = Modal;

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
interface RecMsg<T> {
  Key: string;
  Name: string;
  UpdateTime: string;
  data: T[];
}
class SelfAppController extends BaseController {
  private _curSpace: IMTarget = userCtrl.User;
  /* -----**菜单数据区---------- */
  private _curMenuKey!: string; //当前选中菜单key
  private _treeData!: TreeType[]; //缓存树形数据
  /* -----**应用功能区---------- */
  public breadcrumb: string[] = ['仓库', '我的应用']; //面包屑
  private _curProduct: IProduct | undefined = undefined;
  // 顶部最近使用应用
  public recentlyUsedAppsIds: string[] = [];
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
  private selfAppsData: IProduct[] = [];

  // 获取数据
  public get curProduct(): IProduct | undefined {
    return this._curProduct || undefined;
  }
  public get tableData(): IProduct[] {
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

  set curProduct(prod: IProduct | undefined) {
    this._curProduct = prod;
  }

  constructor() {
    super();
    /* 监听空间切换 */
    userCtrl.subscribePart(UserPartTypes.Space, async () => {
      this._curSpace = userCtrl.IsCompanySpace ? userCtrl.Company : userCtrl.User;
      this.resetData();
    });
    /* 获取 历史缓存的 自定义目录 */
    kernel.anystore.subscribed(selfAppMenu, 'user', (Msg: RecMsg<TreeType>) => {
      // console.log('订阅数据推送 自定义目录===>', Msg.data);
      const { data = defaultTreeData } = Msg;
      this._treeData = data;
      this.changCallbackPart(SelfCallBackTypes.TreeData);
    });
    kernel.anystore.subscribed(RecentlyApps, 'user', (Msg: RecMsg<string>) => {
      // console.log('订阅数据推送 最近使用应用===>', Msg.data);
      const { data = [] } = Msg;
      this.recentlyUsedAppsIds = data;
      this.changCallbackPart(SelfCallBackTypes.Recently);
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
   * 缓存 最近使用应用
   * @param message 新消息，无则为空
   */
  public cacheRecently(): void {
    console.log('缓存 最近使用应用');
    if (this.recentlyUsedAppsIds.length > 7) {
      this.recentlyUsedAppsIds.pop();
    }
    this.changCallbackPart(SelfCallBackTypes.Recently);
    kernel.anystore.set(
      RecentlyApps,
      {
        operation: 'replaceAll',
        data: {
          data: this.recentlyUsedAppsIds,
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
      case 'shareInfo':
        return shareInfoColumns;
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
   * @return {IProduct[]} 应用列表
   */
  public async querySelfApps(reload = false) {
    const list = await this._curSpace.getOwnProducts(reload);
    this.selfAppsData = list;
    this.changCallbackPart(SelfCallBackTypes.TableData);
  }

  /**
   * @desc: 添加最近使用应用
   * @param {IProduct} data
   */
  public OpenApp(data: IProduct) {
    this.recentlyUsedAppsIds.unshift(data.prod.id);
    this.changCallbackPart(SelfCallBackTypes.Recently);
  }

  /**
   * @desc 创建应用
   * @params
   */
  public createProduct = async (
    data: Omit<ProductModel, 'id' | 'belongId'>,
  ): Promise<any> => {
    const Target = userCtrl.IsCompanySpace ? userCtrl.Company : userCtrl.User;
    data.typeName = 'Web应用';
    const res = await Target.createProduct(data);
    if (res.success) {
      this.querySelfApps(true);
      return true;
    }
    return false;
  };

  /**
   * @desc: 判断当前操作对象是否为已选产品 不是则 修改选中
   * @param {Product} item
   */
  public selectedProduct(item: IProduct) {
    // 判断当前操作对象是否为已选产品 不是则 修改选中
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
    let { success, msg } = await this._curProduct!.createExtend(
      teamId,
      destIds,
      destType,
    );

    if (!success) {
      console.error(msg);
    } else {
      console.log('共享成功');
    }
  }
  /**
   * @description: 移除确认
   * @return {*}
   */
  public async handleDeleteApp() {
    confirm({
      content: `确认删除《 ${this._curProduct!.prod.name} 》?`,
      onOk: async () => {
        await this._curSpace.deleteProduct(this._curProduct!.prod.id);
        this.querySelfApps(true);
      },
      onCancel() {},
    });
  }
}

export default new SelfAppController();
