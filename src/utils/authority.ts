import { ITarget } from '../ts/core';
import userCtrl from '../ts/controller/setting';
import { XMarket } from '@/ts/base/schema';

// 平台角色
enum CommonAuthority {
  'SuperAdmin' = 'super-admin',
  'RelationAdmin' = 'relation-admin',
  'ThingAdmin' = 'thing-admin',
  'MarketAdmin' = 'market-admin',
  'ApplicationAdmin' = 'application-admin',
}

const IsAuthorityAdmin = async (
  target: ITarget,
  authoritys: string[],
): Promise<boolean> => {
  if (target.id == userCtrl.user.id) {
    return true;
  }
  if(!target || !target.judgeHasIdentity) {
    debugger
  }
  return await target.judgeHasIdentity(authoritys);
};

export const IsSuperAdmin = async (target: ITarget): Promise<boolean> => {
  return await IsAuthorityAdmin(target, [CommonAuthority.SuperAdmin]);
};

export const IsThingAdmin = async (target: ITarget): Promise<boolean> => {
  return IsAuthorityAdmin(target, [
    CommonAuthority.SuperAdmin,
    CommonAuthority.ThingAdmin,
  ]);
};

export const IsRelationAdmin = async (target: ITarget): Promise<boolean> => {
  return await IsAuthorityAdmin(target, [
    CommonAuthority.SuperAdmin,
    CommonAuthority.RelationAdmin,
  ]);
};

export const IsMarketAdmin = async (market: XMarket): Promise<boolean> => {
  if (market.belongId == userCtrl.user.id) {
    return true;
  }
  let companys = await userCtrl.user.getJoinedCompanys();
  let company = companys.find((a) => a.id == market.belongId);
  if (company) {
    return await IsAuthorityAdmin(company, [
      CommonAuthority.SuperAdmin,
      CommonAuthority.MarketAdmin,
    ]);
  }
  return false;
};

export const IsApplicationAdmin = async (target: ITarget): Promise<boolean> => {
  return await IsAuthorityAdmin(target, [
    CommonAuthority.SuperAdmin,
    CommonAuthority.ApplicationAdmin,
  ]);
};
