import Provider from '@/ts/core/provider';
import Company from '@/ts/core/target/company';
import { IPerson } from '@/ts/core/target/itarget';
import BaseController from '../baseCtrl';
import CompanyController from './companyCtrl';
import MarketTarget from '../../core/target/mbase';

/** 空间类型申明 */
export type SpaceType = {
  /** 空间标识 */
  id: string;
  /** 空间名称 */
  name: string;
  /**是否是个人空间 */
  isUserSpace?: boolean;
  /** 当前空间的对象 */
  targtObj?: MarketTarget;
  /** 控制器 */
  controller: CompanyController | SettingController;
};

/**
 * 设置层， 总控制器
 */
class SettingController extends BaseController {
  private _person: IPerson | undefined;
  private _curWorkSpace: SpaceType | undefined;
  private _workSpaces: SpaceType[] = [];

  constructor() {
    super();
    Provider.onSetPerson(async () => {
      await this._initialization();
    });
  }

  /** 初始化 */
  private async _initialization() {
    if (Provider.getPerson) {
      this._person = Provider.getPerson;
      const companys = await this._person.getJoinedCompanys();
      let personSpace = {
        id: Provider.getPerson!.target.id,
        name: '个人空间',
        isUserSpace: true,
        targtObj: Provider.getPerson!,
        controller: this,
      };

      this._workSpaces = [personSpace];
      this._curWorkSpace = personSpace;
      companys.forEach((a) => {
        this._workSpaces.push({
          id: a.target.id,
          name: a.target.name,
          isUserSpace: false,
          targtObj: a as Company,
          controller: new CompanyController(a),
        });
      });
      this.changCallback();
    }
  }

  /** 获取当前人员 */
  public get getPerson() {
    return this._person;
  }
  /** 获得加入的群组 */
  public get getCohorts() {
    return this._person?.getJoinedCohorts();
  }

  /** 获得所有工作空间 */
  public get getWorkSpaces() {
    return this._workSpaces;
  }

  /**
   * 获得当前空间
   */
  public get getCurWorkSpace() {
    return this._curWorkSpace;
  }

  /**切换工作空间 */
  public changeWorkSpace(space: SpaceType) {
    // 切换工作空间的时候， 直接把对象放到缓存里面
    for (const bean of this._workSpaces) {
      if (bean.id === space.id) {
        this._curWorkSpace = bean;
        break;
      }
    }
    this.changCallback();
  }

  public getCurrentCtrl() {
    if (this._curWorkSpace) {
      return this._curWorkSpace?.controller;
    } else {
      return this;
    }
  }
}

export const settingCtrl = new SettingController();
