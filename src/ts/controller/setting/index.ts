import BaseController from './SingletonPublish';
import UserdataService from '../../core/target/user';
import Company from '../../core/target/company';
import { TargetType } from '../../core/enum';
import React from 'react';
import * as Icon from '@ant-design/icons';
export interface spaceObjs {
  id: string;
  title: string;
  key: string;
  children: Array<spaceObjs>;
  // 上级部门的ID
  parentId: string;
  // 对应公司的ID
  companyId: string;
}
class SettingController extends BaseController {
  private _isOpenModal: boolean = false;
    // 我的用户服务
  private userDataService: UserdataService = UserdataService.getInstance();
  // 对应公司的ID
  // 测试的时候先写死， 到时候切换成 当前工作空间ID
  companyID: string = '381107910723375104';
   /** 页面isOpen控制是否显示弹窗 */
  public get getIsOpen() {
    return this._isOpenModal;
  }
  
  /**设弹窗 */ 
  public async setIsOpen(params: boolean) {
    console.log(params);
    this._isOpenModal = params;
  }

   /**
   * 递归查询前单位底下的所有部门底下的子部门
   * @param parentId
   * @returns
   */
    public async getDepartments(parentId: string): Promise<spaceObjs[]> {
      let arrays: spaceObjs[] = [];
      let compid = parentId;
      if (parentId === '0') {
        compid = this.companyID;
      }
      const companys: Company[] = await this.userDataService.getBelongTargets(
        compid,
        TargetType.Department,
      );
      if (companys.length > 0) {
        for (const comp of companys) {
          // 查找是否有children
          let arrayChild: spaceObjs[] = [];
          const company2s: Company[] = await this.userDataService.getBelongTargets(
            comp.target.id,
            TargetType.Department,
          );
          if (company2s.length > 0) {
           const getValue = await this.getDepartments(comp.target.id);
           arrayChild = getValue.map((item) => {
             return {...item, icon:React.createElement(Icon['ApartmentOutlined'])}
           })
          }
          const spaceObj: spaceObjs = {
            id: comp.target.id,
            key: comp.target.id,
            title: comp.target.name,
            parentId: compid!,
            companyId: compid!,
            children: arrayChild,
          };
          arrays.push(spaceObj);
        }
      }
      return arrays;
    }
}
const settingController = new SettingController();

export default settingController;