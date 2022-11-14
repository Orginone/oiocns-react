import { MarketTypes } from 'typings/marketType';
import { Org, Team, User } from '../org';
/*
    平台待办审核 
    待办数据类型
*/
interface ApprovelTeam extends Team {
  target: Org;
}
/** 基础审批接口类型声明 */
interface ApprovalType {
  id: string;
  targetId: string;
  teamId: string;
  status: number;
  createUser: string;
  updateUser: string;
  version: string;
  createTime: string;
  updateTime: string;
  target: Omit<User, 'team'>; // 排除User team字段
}
/** 好友/单位审批接口类型声明*/
interface TeamApprovalType extends ApprovalType {
  team: ApprovelTeam;
}
/** 市场审批接口类型声明*/
interface MarketApprovalType extends ApprovalType {
  market: MarketTypes.MarketType;
}
/** 应用上架审批接口类型声明*/
interface ProductApprovalType extends MarketApprovalType {
  sellAuth: string;
  days: string;
  price: string | number;
  product: MarketTypes.ProductType;
}

interface OderDetailType {
  [key: string]: any;
}
