import Provider from '@/ts/core/provider';
import { ICompany, IPerson } from './../../core/target/itarget';
import BaseController from '../baseCtrl';

/** 空间类型申明 */
export type SpaceType = {
  /** 空间标识 */
  id: string;
  /** 空间名称 */
  name: string;
  /**是否是个人空间 */
  isUserSpace?: boolean;
  /** 个人或公司 */
  target: IPerson | ICompany;
};

/**
 * 设置层， 总控制器
 */
class SettingController extends BaseController {
  private _callbacks: (() => void)[] = [];
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
    const companys = await Provider.getPerson!.getJoinedCompanys();
    let personSpace = {
      id: Provider.getPerson!.target.id,
      name: '个人空间',
      isUserSpace: true,
      target: Provider.getPerson!,
    };
    this._workSpaces = [personSpace];
    this._curWorkSpace = personSpace;
    companys.forEach((a) => {
      this._workSpaces.push({
        id: a.target.id,
        name: a.target.name,
        isUserSpace: false,
        target: a,
      });
    });
    this.changCallback();
  }

  /** 获得所有工作空间 */
  public get getWorkSpaces() {
    return this._workSpaces;
  }

  public get getCurWorkSpace() {
    return this._curWorkSpace;
  }

  /**切换工作空间 */
  public changeWorkSpace(space: SpaceType) {
    this._curWorkSpace = space;
    this._callbacks.forEach((c) => {
      c.apply(this, []);
    });
  }

  public OnWorkSpaceChanged(callback: () => void) {
    if (callback) {
      if (this._curWorkSpace) {
        callback.apply(this, []);
      }
      this._callbacks.push(callback);
    }
  }
}

export const settingCtrl = new SettingController();
