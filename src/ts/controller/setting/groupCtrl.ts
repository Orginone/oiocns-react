import { ICompany, IGroup } from './../../core/target/itarget';
import BaseController from '../baseCtrl';
import { settingCtrl } from './settingCtrl';

class GroupController extends BaseController {
  private _curGroup: IGroup | undefined;
  private _groups: IGroup[];

  constructor() {
    super();
    settingCtrl.OnWorkSpaceChanged(async () => {
      await this._initialization();
    });
  }

  /** 初始化 */
  private async _initialization(): Promise<void> {
    let workSpace = settingCtrl.getCurWorkSpace;
    if (!workSpace?.isUserSpace) {
      this._curGroup = undefined;
      this._groups = await (workSpace?.target as ICompany).getJoinedGroups();
    }
  }

  /** 获取当前部门 */
  public get getCurGroup() {
    return this._curGroup;
  }

  /** 查询单位加入的集团 */
  public get getGroups() {
    return this._groups;
  }

  /** 设置当前部门 */
  public setCurDepartMent(group: IGroup) {
    this._curGroup = group;
    this.changCallback();
  }
}

export const groupCtrl = new GroupController();
