import Provider from '@/ts/core/provider';
import { IPerson } from '@/ts/core/target/itarget';
import BaseController from '../baseCtrl';
import CompanyController from './companyCtrl';

/** 空间类型申明 */
export type SpaceType = {
  /** 空间标识 */
  id: string;
  /** 空间名称 */
  name: string;
  /**是否是个人空间 */
  isUserSpace?: boolean;
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
    this._person = Provider.getPerson;
    let personSpace = {
      id: Provider.getPerson!.target.id,
      name: '个人空间',
      isUserSpace: true,
      controller: this,
    };
    this._curWorkSpace = personSpace;
    this._workSpaces.push(personSpace);
    const companys = await Provider.getPerson!.getJoinedCompanys();
    companys.forEach((a) => {
      this._workSpaces.push({
        id: a.target.id,
        name: a.target.name,
        isUserSpace: false,
        controller: new CompanyController(a),
      });
    });
    this.changCallback();
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
    this._curWorkSpace = space;
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
