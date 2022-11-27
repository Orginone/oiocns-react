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

  /** 删除部门 */
  public deleteDepartMent(id: string) {
    if (this._curDepartment?.target.id == id) {
      this._curDepartment = undefined;
    }
    // 一级部门
    const depart = this._departments.find((a) => {
      return a.target.id == id;
    });
    if (depart != undefined) {
      (settingCtrl.getCurWorkSpace?.target as ICompany).deleteDepartment(id);
      this._departments = this._departments.filter((a) => a.target.id != id);
    } else {
      this._departments.find((a) => {
        this._deleteDepartment(id, a);
      });
    }
    this.changCallback();
  }

  private async _deleteDepartment(id: string, department: IDepartment) {
    const res = await department.getDepartments();
    res.find((a) => {
      if (a.target.id == id) {
        department.deleteDepartment(id);
        return;
      } else {
        this._deleteDepartment(id, a);
      }
    });
  }
}

export const departmentCtrl = new DepartmentController();
