import { TargetType } from '@/ts/core/enum';
import { IObjectItem } from '@/ts/core/store/ifilesys';
import { IDepartment } from '@/ts/core/target/itarget';
import { schema } from '@/ts/base';
import Department from '@/ts/core/target/department';
// import Company from '@/ts/core/target/company';
// import { XTarget, XTargetArray } from '@/ts/base/schema';
import UserCtrl from '@/ts/controller/setting/userCtrl';
import docCtrl from '@/ts/controller/store/docsCtrl';

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
export default class SettingService {
  // 单例
  private static _instance: SettingService;
  public static getInstance() {
    if (this._instance == null) {
      this._instance = new SettingService();
    }
    return this._instance;
  }

  private companyID: string = '';
  private _isOpenModal: boolean = false;
  // 对应公司的ID

  // 部门树，选中的节点
  private _currTreeDeptNode: string = '';
  /**选中的跟部门 */
  private _root: IDepartment;

  /** 页面isOpen控制是否显示弹窗 */
  public get getIsOpen() {
    return this._isOpenModal;
  }
  public get getRoot() {
    return this._root;
  }

  public set setRoot(target: schema.XTarget) {
    this._root = new Department(target);
  }

  public set setCompanyID(id: string) {
    this.companyID = id;
  }
  public getCurrTreeDeptNode() {
    return this._currTreeDeptNode;
  }
  public setCurrTreeDeptNode(id: string) {
    this._currTreeDeptNode = id;
  }
  constructor() {
    if (UserCtrl.Company != null) {
      this.setCompanyID = UserCtrl.Company?.target.id;
      this._root = new Department(UserCtrl.Company?.target);
    } else {
      this.setCompanyID = '';
      this._root = new Department(UserCtrl.User?.target);
    }
  }

  /**设弹窗 */
  public async setIsOpen(params: boolean) {
    this._isOpenModal = params;
  }

  private async _search(
    item: IDepartment,
    key: string,
  ): Promise<IDepartment | undefined> {
    if (item.target.id === key) {
      return item;
    }

    const depts = await item.getDepartments(false);
    for (const i of depts) {
      const res = await this._search(i, key);
      if (res) {
        return res;
      }
    }
  }

  public async refItem(key: string): Promise<IDepartment | undefined> {
    return await this._search(this._root, key);
  }

  // 上传到我的文件夹目录，然后再保存 share_link，到时候预览
  public async upload(key: string, name: string, file: Blob): Promise<IObjectItem> {
    return await docCtrl.upload(key, name, file);
  }
}
