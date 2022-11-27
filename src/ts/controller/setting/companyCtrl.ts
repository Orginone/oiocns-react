import { IDepartment } from './../../core/target/itarget';
import { ICompany } from '../../core/target/itarget';
import { MarketController } from '../store/marketCtrl';

export default class CompanyController extends MarketController {
  private _company: ICompany;
  constructor(company: ICompany) {
    super(company);

    this._company = company;
  }
  /** 获得单位信息 */
  public getCompany() {
    return this._company;
  }
  /** 获得部门 */
  public async getDepartMents() {
    return await this._company.getDepartments();
  }
  /** 获得工作组 */
  public async getWorkings() {
    return await this._company.getWorkings();
  }
  /** 获得加入的集团 */
  public async getGroups() {
    return await this._company.getJoinedGroups();
  }
  /** 获得加入的群组 */
  public async getCohorts() {
    return await this._company.getJoinedCohorts();
  }
  /** 删除部门 */
  public async deleteDepartMent(id: string) {
    // 一级部门
    const departs = await this.getDepartMents();
    const depart = departs.find((a) => {
      return a.target.id == id;
    });
    if (depart != undefined) {
      this._company.deleteDepartment(id);
    } else {
      departs.find((a) => {
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
