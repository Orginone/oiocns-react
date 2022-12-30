/* eslint-disable no-unused-vars */
import userCtrl from '../setting/userCtrl';
import { Emitter } from '../../base/common';
import { DomainTypes, emitter, IGroup } from '../../core';
import { IIdentity } from '../../core/target/authority/iidentity';
import { XTarget, XTargetArray } from '../../base/schema';

/**
 * 公益仓根集团代码
 */
const WELFARE_GROUP_CODE = 'gongyicanggroup';

/** 公益仓--角色分类 */
export enum WelfareRole {
  WelfareOrg = '公益组织',
  Supervision = '监管单位',
  StorageAgency = '仓储机构',
  Donationer = '捐赠方', // 组织或者个人
  Demander = '受捐方', // 需求方：组织或者个人
}

/**
 * 公益仓控制器
 */
class WelfareController extends Emitter {
  // 公益仓根集团
  private _rootGroup!: IGroup;
  /** 公益仓下所有组织 */
  private _companies!: XTarget[];
  /** 所有监管单位 */
  private _supervisions!: XTarget[];
  /** 所有公益组织 */
  private _welfareOrgs!: XTarget[];
  /** 所有仓储机构 */
  private _storageAgencys!: XTarget[];
  // 当前单位在公益仓应用下的角色(监管单位、公益组织、仓储机构、捐赠方、受捐方)
  private _roles: WelfareRole[] = [];
  // 是否 物资管理员、资产管理员、管理员
  private _isAmdin!: boolean;

  /**构造方法 */
  constructor() {
    super();
    emitter.subscribePart([DomainTypes.User, DomainTypes.Company], async () => {
      setTimeout(async () => {
        // TODO 空间切换时重新初始化
        this.init();
      });
    });
  }

  private async init() {
    await this.initRootGroup();
    if (this._rootGroup) {
      await this.initCompnies();
      this.initSupervisions();
      this.initWelfareOrgs();
      this.initStorageAgencys();
      this.initRoles();
    } else {
      throw new Error('当前单位未加入公益仓集团');
    }

    console.log('_rootGroup', this._rootGroup);
    console.log('_companies', this._companies);
    console.log('_supervisions', this._supervisions);
    console.log('_welfareOrgs', this._welfareOrgs);
    console.log('_roles', this._roles);
  }

  /**
   * 初始化公益仓根集团
   */
  private async initRootGroup() {
    if (typeof userCtrl.company.getJoinedGroups !== 'function') {
      throw new Error('个人暂未开放公益仓');
    } else {
      const groups: IGroup[] = await userCtrl.company.getJoinedGroups();
      this._rootGroup = groups.find(
        (g) => g.target.code === WELFARE_GROUP_CODE,
      ) as IGroup;
    }
  }
  /**
   * 初始化公益仓所有组织
   */
  private async initCompnies() {
    const res: XTargetArray = await this._rootGroup.loadMembers({
      offset: 0,
      limit: 1000000,
      filter: '',
    });
    this._companies = res.result || [];
  }
  /**
   * 初始化监管方
   */
  private initSupervisions() {
    this._supervisions = this._companies.filter(
      (c) => c.id === this._rootGroup.target.belongId,
    );
  }
  /**
   * 初始化公益组织列表
   */
  private initWelfareOrgs() {
    this._welfareOrgs = this._companies.filter(
      (c) => c.id !== this._rootGroup.target.belongId,
    );
  }
  /**
   * 初始化仓储机构列表
   */
  private initStorageAgencys() {
    // TODO 待修改（等待集团建好）
    this._storageAgencys = [];
  }

  private initRoles() {
    const isSupervision = this._supervisions.some((c) => c.id === userCtrl.company.id);
    if (isSupervision) {
      this._roles.push(WelfareRole.Supervision);
    }
    const isWelfareOrg = this._welfareOrgs.some((c) => c.id === userCtrl.company.id);
    if (isWelfareOrg) {
      this._roles.push(WelfareRole.WelfareOrg);
    }
    const isStorageAgency = this._storageAgencys.some(
      (c) => c.id === userCtrl.company.id,
    );
    if (isStorageAgency) {
      this._roles.push(WelfareRole.StorageAgency);
    }
    // 默认为捐赠者或者受捐者
    if (!this._roles || this._roles.length === 0) {
      this._roles = [WelfareRole.Donationer, WelfareRole.Demander];
    }
  }

  /**
   * 判断是否是管理员
   * @returns boolean
   */
  public async isAdmin(): Promise<boolean> {
    const identitys: IIdentity[] = await userCtrl.user.getIdentitys();
    const adminNames = ['管理员', '物资管理员', '资产管理员'];
    const result = identitys.some((i) => adminNames.includes(i.name));
    return result;
  }
}

export default new WelfareController();
