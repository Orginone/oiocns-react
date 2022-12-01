import BaseController from './SingletonPublish';
import UserdataService from '../../core/target/user';
import Company from '../../core/target/company';
import { TargetType } from '../../core/enum';
import React from 'react';
import * as Icon from '@ant-design/icons';
import Types from '@/module/typings';
import { XTarget, XTargetArray } from '../../base/schema';
// import { model } from '../../base';
import Provider from '../../core/provider';
import { rootDir } from '../../core/store/filesys';
import { IFileSystemItem, IObjectItem } from '../../core/store/ifilesys';
import { kernel } from '@/ts/base';

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
class SettingController extends BaseController {
  private _isOpenModal: boolean = false;
  // 我的用户服务
  private userDataService: UserdataService = UserdataService.getInstance();
  private _root: IFileSystemItem;
  // 对应公司的ID
  // 测试的时候先写死， 到时候切换成 当前工作空间ID
  companyID: string = '381107910723375104';
  /** 页面isOpen控制是否显示弹窗 */
  public get getIsOpen() {
    return this._isOpenModal;
  }
  constructor() {
    super();
    this._root = rootDir;
    Provider.onSetPerson(async () => {
      // this._home = await this._root.create(homeName);
    });
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

    const datas: Types.PageData<XTarget> = await this.userDataService.searchMyCompany(
      {
        page: 0,
        pageSize: 100,
        filter: param.code,
      },
      TargetType.Department,
    );
    if (datas.data && datas.data?.length > 0) {
      return {
        msg: '重复创建',
        success: false,
      };
    }
    const res = await this.userDataService.createDepart(
      param.name,
      param.code,
      param.teamName,
      param.teamCode,
      param.remark,
      compid, // 团队ID
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
          // console.log('getValue', getValue);
          arrayChild = getValue?.map((item) => {
            return { ...item, icon: React.createElement(Icon['ApartmentOutlined']) };
          });
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
    const datas: Types.PageData<XTarget> = await this.userDataService.searchMyCompany(
      {
        page: 0,
        pageSize: 10,
        filter: param.code,
      },
      TargetType.Department,
    );

    if (datas.data && datas.data?.length > 0) {
      return {
        msg: '重复创建',
        success: false,
      };
    }

    const res = await this.userDataService.createDepart(
      param.name,
      param.code,
      param.teamName,
      param.teamCode,
      param.remark,
      compid, // 上一层ID
      true,
      compid, // 属于哪个公司的ID
    );
    return {
      msg: res.msg,
      success: res.success,
    };
  }

  // 查询部门的内容
  public async searchDeptment(departId: string): Promise<XTargetArray> {
    const res = await kernel.queryTargetById({ ids: [departId], page: undefined });
    if (res.success) {
      return res.data;
    } else {
      return {
        offset: 0,
        limit: 0,
        total: 0,
        result: undefined,
      };
    }
  }

  // 查询公司底下所有的用户
  public async searchAllPersons(departId?: string): Promise<XTarget[]> {
    const comp: Company = new Company(Provider.getPerson?.target!);
    let res: XTarget[];
    if (departId == null) {
      comp.target.id = this.companyID;
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
    // const task: SettingModel = {
    //   process: 0,
    //   name: name,
    //   size: file.size,
    //   createTime: new Date(),
    // };

    return await this._root.upload(name, file, (p) => {});
  }
}
const settingController = new SettingController();

export default settingController;
