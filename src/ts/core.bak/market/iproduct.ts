import { model, schema } from '../../base';
import IMerchandise from './imerchandise';
import IResource from './iresource';

export default interface IProduct {
  id: string;
  /** 应用实体 */
  prod: schema.XProduct;
  /** 商品列表 */
  merchandises: IMerchandise[];
  /** 应用资源 */
  resource: IResource[];
  /**
   * 获取商品列表
   */
  getMerchandises(reload: boolean): Promise<IMerchandise[]>;
  /**
   * 拓展操作 应用分享
   * @param teamId 组织Id
   * @param destIds 目标Id
   * @param destType 目标类型
   * @returns
   */
  createExtend(teamId: string, destIds: string[], destType: string): Promise<boolean>;
  /**
   * 取消应用分享
   * @param teamId 组织Id
   * @param destIds 目标Id
   * @param destType 目标类型
   * @returns
   */
  deleteExtend(teamId: string, destIds: string[], destType: string): Promise<boolean>;
  /**
   * 查询拓展 (应用分享)
   * @param destType 目标类型
   * @param teamId 组织Id
   * @returns
   */
  queryExtend(destType: string, teamId?: string): Promise<model.IdNameArray>;

  /**
   * 上架商品
   * @param params.Caption 标题
   * @param params.MarketId 市场ID
   * @param params.SellAuth 售卖权限
   * @param params.Information 详情信息
   * @param {number} params.Price 价格
   * @param {string} params.Days 期限
   * @returns 是否上架成功
   */
  publish(params: {
    caption: string;
    marketId: string;
    sellAuth: '所属权' | '使用权';
    information: string;
    price: number;
    days: string;
  }): Promise<boolean>;
  /**
   * 下架商品
   * @param merchandiseId 下架商品ID
   * @returns 下架是否成功
   */
  unPublish(merchandiseId: string): Promise<boolean>;
  /**
   * 更新应用
   * @param name 应用名称
   * @param code 应用编号
   * @param typeName 应用类型
   * @param remark 应用信息
   * @param resources 应用资源
   */
  update(
    name: string,
    code: string,
    typeName: string,
    remark: string,
    photo: string,
    resources: model.ResourceModel[],
  ): Promise<boolean>;
}
