// 市场业务
import { MarketTypes } from 'typings/marketType';
// import { IdPage, Page } from '../typings';
import API from '@/services';
import type { ProColumns } from '@ant-design/pro-components';
import CommonClass from '../commonClass/BaseServiceClass';
// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据

// export interface MarketServiceType extends CommonClassType<MarketTypes.ProductType> {
//   PUBLIC_STORE: MarketTypes.MarketType; //共享仓库信息,用于获取共享仓库应用列表
// }

export default class MarketService extends CommonClass {
  public PUBLIC_STORE: MarketTypes.MarketType = {} as MarketTypes.MarketType; //共享仓库信息
  public ShopAppColumns: ProColumns<any>[] = []; //商店应用 表格头部展示数据
  public MyAppColumns: ProColumns<any>[] = []; //我的应用 表格头部展示数据
  public PublishColumns: ProColumns<any>[] = []; //应用上架 表格头部展示数据

  constructor(data: any) {
    super(data);
    // 获取共享仓库信息
    this.getPublicStore();
  }

  /**
   * @desc: 获取共享仓库信息
   * @return {*}
   */
  public async getPublicStore() {
    if (this.PUBLIC_STORE?.id) {
      return;
    }
    const { success, data } = await API.market.getSoftShareInfo();
    if (success) {
      this.PUBLIC_STORE = data;
    }
  }
  /* 获取商店列表 表头 */
  public getShopappColumns() {
    if (this.ShopAppColumns.length > 1) {
      return this.ShopAppColumns;
    }
    const data: any = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 50,
        render: (_key: any, _record: any, index: number) => {
          return index + 1;
        },
      },
      {
        title: '应用名称',
        dataIndex: ['prod', 'caption'],
      },
      {
        title: '来源',
        dataIndex: ['prod', 'marketId'],
      },
      {
        title: '应用类型',
        dataIndex: ['prod', 'typeName'],
      },
      {
        title: '售卖权限',
        dataIndex: ['prod', 'sellAuth'],
      },
      {
        title: '价格',
        dataIndex: ['prod', 'price'],
      },

      {
        title: '创建时间',
        dataIndex: ['prod', 'createTime'],
      },

      {
        title: '备注',
        ellipsis: true,
        dataIndex: ['prod', 'remark'],
      },
    ];
    this.ShopAppColumns = [...data];
    return data;
  }

  /* 获取我的应用列表 表头 */
  public getPublishColumns(): ProColumns<any>[] {
    if (this.PublishColumns.length > 1) {
      return this.PublishColumns;
    }
    const data: any = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 50,
        render: (_key: any, _record: any, index: number) => {
          return index + 1;
        },
      },
      {
        dataIndex: 'id',
        ellipsis: true,
        title: '应用编号',
      },
      {
        dataIndex: 'caption',
        title: '应用名称',
      },
      {
        dataIndex: 'marketId',
        ellipsis: true,
        title: '应用来源',
      },
      {
        dataIndex: 'productAuthority',
        title: '应用权限',
      },
      {
        dataIndex: 'productTypeName',
        title: '应用类型',
      },
      {
        dataIndex: 'marketName',
        ellipsis: true,
        title: '市场名称',
      },
      {
        dataIndex: 'marketCode',
        ellipsis: true,
        title: '市场编号',
      },
      {
        dataIndex: 'sellAuth',
        title: '售卖权属',
      },
      {
        dataIndex: 'price',
        title: '价格',
      },
      {
        dataIndex: 'days',
        title: '使用期限',
      },
      {
        dataIndex: 'createTime',
        title: '创建时间',
        width: 200,
      },
      {
        title: '备注',
        ellipsis: true,
        width: 200,
        dataIndex: 'information',
      },
    ];
    this.PublishColumns = [...data];
    return data;
  }
}
/* , */
