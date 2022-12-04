import { kernel } from '../../base';
import { CommonStatus, TargetType } from '../enum';
import { model, schema } from '../../base';
import consts from '../consts';
import IMarket from './imarket';

export default class Market implements IMarket {
  market: schema.XMarket;
  pullTypes: TargetType[];

  constructor(store: schema.XMarket) {
    this.market = store;
    this.pullTypes = [TargetType.Person, ...consts.CompanyTypes];
  }

  /**
   * 更新商店信息
   * @param name 商店名称
   * @param code 商店编号
   * @param samrId 监管组织/个人
   * @param remark 备注
   * @param ispublic 是否公开
   * @returns
   */
  public async update(
    name: string,
    code: string,
    samrId: string,
    remark: string,
    ispublic: boolean,
  ): Promise<model.ResultType<any>> {
    const res = await kernel.updateMarket({
      id: this.market.id,
      name,
      code,
      samrId,
      remark,
      public: ispublic,
      belongId: this.market.belongId,
    });
    if (res.success) {
      this.market.name = name;
      this.market.code = code;
      this.market.samrId = samrId;
      this.market.remark = remark;
      this.market.public = ispublic;
    }
    return res;
  }

  /**
   * 分页获取商店成员
   * @param page 分页参数
   * @returns 加入的商店成员
   */
  public async getMember(
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMarketRelationArray>> {
    return await kernel.queryMarketMember({
      id: this.market.id,
      page: page,
    });
  }

  /**
   * 分页获取加入商店申请
   * @param page
   */
  public async getJoinApply(
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMarketRelationArray>> {
    return await kernel.queryJoinMarketApply({
      id: this.market.id,
      page,
    });
  }

  /**
   * 审批商店成员加入申请
   * @param id 申请ID
   * @param status 审批结果
   * @returns 是否成功
   */
  public async approvalJoinApply(
    id: string,
    status: number = CommonStatus.RejectStartStatus,
  ): Promise<model.ResultType<any>> {
    return await kernel.approvalJoinApply({ id, status });
  }

  /**
   * 拉对象加入商店
   * @param targetIds 对象ID集合
   * @param typenames 对象类型
   * @returns 是否成功
   */
  public async pullMember(targetIds: string[]): Promise<model.ResultType<any>> {
    return await kernel.pullAnyToMarket({
      targetIds: targetIds,
      marketId: this.market.id,
      typeNames: this.pullTypes,
    });
  }

  /**
   * 移除商店成员
   * @param targetIds 成员ID集合
   * @param typename 成员类型
   * @return 移除人员结果
   */
  public async removeMember(targetIds: string[]): Promise<model.ResultType<any>> {
    return await kernel.removeMarketMember({
      targetIds,
      marketId: this.market.id,
      typeNames: this.pullTypes,
    });
  }
  public getMerchandise = async (
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMerchandiseArray>> => {
    return await kernel.searchMerchandise({
      id: this.market.id,
      page: page,
    });
  };

  /**
   * 获取商品上架申请列表
   * @param page 分页参数
   * @returns 返回商品上架申请列表
   */
  public async getMerchandiseApply(
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMerchandiseArray>> {
    return await kernel.queryMerchandiesApplyByManager({
      id: this.market.id,
      page: page,
    });
  }

  /**
   * 审批商品上架申请
   * @param id 申请ID
   * @param status 审批结果
   * @returns 是否成功
   */
  public async approvalPublishApply(
    id: string,
    status: number = CommonStatus.RejectStartStatus,
  ): Promise<model.ResultType<any>> {
    return await kernel.approvalMerchandise({ id, status });
  }

  /**
   * 下架商品
   * @param merchandiseId 下架商品ID
   * @returns 下架是否成功
   */
  public async unPublish(
    merchandiseId: string,
    belongId: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.deleteMerchandiseByManager({
      id: merchandiseId,
      belongId: belongId,
    });
  }
}
