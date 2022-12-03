import React from 'react';
import * as Icon from '@ant-design/icons';

import Company from '@/ts/core/target/company';
import { TargetType } from '@/ts/core/enum';
import { XTarget, XTargetArray } from '@/ts/base/schema';
import UserCtrl from '@/ts/controller/setting/userCtrl';
import CompanyCtrl from '@/ts/controller/setting/companyCtrl';
import { IObjectItem } from '@/ts/core/store/ifilesys';
import docCtrl from '@/ts/controller/store/docsCtrl';
import { IDepartment } from '@/ts/core/target/itarget';
import Department from '@/ts/core/target/department';

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

// 创建部门的入参
export type deptParams = {
  name: string;
  code: string;
  teamName: string;
  teamCode: string;
  remark: string;
  parentId?: string;
  targetType?: TargetType.Department;
};

/** 任务模型 */
export type SettingModel = {
  name: string;
  size: number;
  process?: number;
  createTime: Date;
};

// 返回类型定义
export type ObjType = {
  // 消息
  msg: string;
  // 结果
  success: boolean;
};

/**请求接口的服务 */
class SettingService {
  private _isOpenModal: boolean = false;
  // private _root: IFileSystemItem;
  // 我的用户服务
  private companyCtrl: CompanyCtrl;
  // 对应公司的ID
  private companyID: string = '';
  /** 页面isOpen控制是否显示弹窗 */
  public get getIsOpen() {
    return this._isOpenModal;
  }
  public set setCompanyID(id: string) {
    this.companyID = id;
  }
  constructor() {
    if (UserCtrl.Space != null) {
      this.companyCtrl = new CompanyCtrl(new Company(UserCtrl.Space?.target));
    } else {
      this.companyCtrl = new CompanyCtrl(new Company(UserCtrl.User?.target));
    }
  }

  /**设弹窗 */
  public async setIsOpen(params: boolean) {
    // console.log(params);
    this._isOpenModal = params;
  }

  // 创建二级以下的部门
  public async createSecondDepartment(
    param: deptParams,
    deptId: string,
  ): Promise<ObjType> {
    const compid = this.companyID;

    const datas: XTargetArray = await this.companyCtrl
      .getUserService()
      .searchMyCompany(param.code, TargetType.Department);
    if (datas.total > 0) {
      return {
        msg: '重复创建',
        success: false,
      };
    }
    const res = await this.companyCtrl.getUserService().createDepart(
      param.name,
      param.code,
      param.teamName,
      param.teamCode,
      param.remark,
      compid!, // 团队ID
      false,
      deptId, // 属于哪个部门的ID
    );

    return {
      msg: res.msg,
      success: res.success,
    };
  }

  /**
   * 递归查询前单位底下的所有部门底下的子部门
   * @param parentId
   * @returns
   */
  public async getDepartments(parentId: string): Promise<IDepartment[]> {
    let arrays: IDepartment[] = [];
    let compid: string = parentId;
    if (parentId === '0') {
      compid = this.companyID + '';
    }
    const companys: Company[] = await this.companyCtrl
      .getUserService()
      .getBelongTargets(compid, TargetType.Department);
    if (companys.length > 0) {
      for (const comp of companys) {
        // 查找是否有children
        let arrayChild: IDepartment[] = [];
        const company2s: Company[] = await this.companyCtrl
          .getUserService()
          .getBelongTargets(comp.target.id, TargetType.Department);
        if (company2s.length > 0) {
          const getValue = await this.getDepartments(comp.target.id);
          // console.log('getValue', getValue);
          arrayChild = getValue?.map((item) => {
            return { ...item, icon: React.createElement(Icon['ApartmentOutlined']) };
          });
        }
        let dept = new Department(comp.target);
        dept.departments = arrayChild;
        arrays.push(dept);
      }
    }
    return arrays;
  }
  /**
   * 创建一级部门
   * @param param parentId 为空就是一级部门
   * @returns
   */
  public async createDepartment(param: deptParams): Promise<ObjType> {
    // 判断是否创建二级部门
    if (param.parentId != null && param.parentId != this.companyID) {
      return await this.createSecondDepartment(param, param.parentId);
    }
    // 要选中公司的工作区
    const compid = this.companyID;
    // Provider.getWorkSpace()!.id;
    // 判断是否有公司数据

    //let curCompanys: Company[] = await Provider.getPerson.getJoinedCompanys();
    // 获取当前单位
    //let curCompany: Company = curCompanys.filter((e) => e.target.id === compid)[0];
    // 判断是否重复 TODO
    const datas: XTargetArray = await this.companyCtrl
      .getUserService()
      .searchMyCompany(param.code, TargetType.Department);

    if (datas.total > 0) {
      return {
        msg: '重复创建',
        success: false,
      };
    }

    const res = await this.companyCtrl.getUserService().createDepart(
      param.name,
      param.code,
      param.teamName,
      param.teamCode,
      param.remark,
      compid + '', // 上一层ID
      true,
      compid + '', // 属于哪个公司的ID
    );
    return {
      msg: res.msg,
      success: res.success,
    };
  }

  // 查询部门的内容
  public async searchDeptment(departId: string): Promise<XTargetArray> {
    return await this.companyCtrl.getUserService().searchDeptment(departId);
  }

  // 查询公司底下所有的用户
  public async searchAllPersons(departId?: string): Promise<XTarget[]> {
    const comp: Company = new Company(UserCtrl.User.target!);
    let res: XTarget[];
    if (departId == null) {
      comp.target.id = this.companyID + '';
      comp.target.typeName = TargetType.Company;
      res = await comp.getPersons();
      // console.log('===查询公司底下的用户', res);
    } else {
      comp.target.id = departId;
      comp.target.typeName = TargetType.Department;
      res = await comp.getPersons();
      // console.log('===查询部门底下的用户', res);
    }
    return res;
  }

  // 上传到我的文件夹目录，然后再保存 share_link，到时候预览
  public async upload(key: string, name: string, file: Blob): Promise<IObjectItem> {
    return await docCtrl.upload(key, name, file);
  }
}

const settingService = new SettingService();
export default settingService;
