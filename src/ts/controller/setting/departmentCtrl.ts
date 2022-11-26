import { ICompany } from './../../core/target/itarget';
import { IDepartment } from '../../core/target/itarget';
import BaseController from '../baseCtrl';
import { settingCtrl } from './settingCtrl';

class DepartmentController extends BaseController {
  private _curDepartment: IDepartment | undefined;
  private _departments: IDepartment[];

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
      this._curDepartment = undefined;
      this._departments = await (workSpace?.target as ICompany).getDepartments();
    }
  }

  /** 获取当前部门 */
  public get getCurDepartment() {
    return this._curDepartment;
  }

  /** 设置当前部门 */
  public setCurDepartMent(department: IDepartment) {
    this._curDepartment = department;
    this.changCallback();
  }
}

export const departmentCtrl = new DepartmentController();
