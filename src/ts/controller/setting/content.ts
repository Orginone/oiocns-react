/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-19 10:49:44
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-21 15:18:59
 * @FilePath: /oiocns-react/src/ts/controller/setting/content.ts
 * @Description: 控制器 实例化要调用的接口基类 提供ui层数据
 */
import Company from '../../core/target/company';
// import Person from '../../core/target/person';
import Provider from '../../core/provider';
import { TargetType } from '../../core/enum';
import { XTarget } from '../../base/schema';
import UserdataService from '../../core/target/user';
import Types from '@/module/typings';

// 新建一个对象 ，避免代码冲突
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

// 返回类型定义
export type ObjType = {
  // 消息
  msg: string;
  // 结果
  success: boolean;
};

// 返回类型定义
export type ResultType<T> = {
  // http代码
  code: number;
  // 数据体
  data: T;
  // 消息
  msg: string;
  // 结果
  success: boolean;
};

class SettingController {
  // openorclose
  isOpenModal: boolean = false;
  // 当前操作的部门
  selectId: string = '';
  // 工作空间的操作
  currentWorkSpaceId: string;
  currentIsUserWorkSpace: boolean;

  // 查询接口, 把公司底下的部门返回到这底下
  allCompanyDepts: Map<string, Array<spaceObjs>> = new Map();

  private userDataService: UserdataService = UserdataService.getInstance();

  // 切换空间的时候重新初始化，所以需要new
  constructor() {
    Provider.getWorkSpace();
    // 如果是一个公司的工作空间，需要初始化一个部门数组
    // 切换工作空间的时候 初始化控制器。
    if (!Provider.isUserSpace()) {
      const compid: any = Provider.getWorkSpace().id;
      if (!this.allCompanyDepts.get(compid)) {
        this.allCompanyDepts.set(compid, new Array());
      }
    }
  }

  // 调试代码
  public async test() {
    const params: deptParams = {
      name: '部门二',
      code: 'BMtwo',
      teamName: '部门二',
      teamCode: 'BMtwo',
      remark: '部门二',
    };
    // 调试 ID
    //console.log(await this.createDepartment(params));
    let arrays!: spaceObjs[];
    await this.flushDepartments('0', arrays);
    console.log(arrays);
    console.log(this.allCompanyDepts);
  }

  /**
   * 获取控制器里面的子部门
   */
  public getDepartments(): Array<spaceObjs> {
    // 要选中公司的工作区
    if (Provider.isUserSpace()) {
      return [];
    }
    const compid: any = Provider.getWorkSpace().id;
    return this.allCompanyDepts.get(compid) ?? [];
  }

  /**
   * 需要递归查询并缓存当前单位底下的所有部门底下的子部门
   * @param parentId
   * @returns
   */
  public async flushDepartments(parentId: string, arrays: spaceObjs[]) {
    let compid = parentId;
    if (parentId === '0') {
      compid = Provider.getWorkSpace().id;
    }

    const companys: Company[] = await this.userDataService.getBelongTargets(
      compid,
      TargetType.Department,
    );
    if (companys.length > 0) {
      companys.map(async (e) => {
        // 查找是否有children
        let arrayChild: spaceObjs[] = [];
        const company2s: Company[] = await this.userDataService.getBelongTargets(
          e.target.id,
          TargetType.Department,
        );
        if (company2s.length > 0) {
          this.flushDepartments(e.target.id, arrayChild);
        }

        const spaceObj: spaceObjs = {
          id: e.target.id,
          key: e.target.id,
          title: e.target.name,
          parentId: compid!,
          companyId: compid!,
          children: arrayChild,
        };
        arrays.push(spaceObj);
      });
    }
  }

  // 创建二级以下的部门
  public async createSecondDepartment(param: deptParams): Promise<ObjType> {
    return {
      msg: '您还未选中工作空间！',
      success: false,
    };
  }

  /**
   * 创建一级部门
   * @param param parentId 为空就是一级部门
   * @returns
   */
  public async createDepartment(param: deptParams): Promise<ObjType> {
    // 要选中公司的工作区
    if (Provider.isUserSpace()) {
      return {
        msg: '您还未选中单位空间！',
        success: false,
      };
    }

    const compid = Provider.getWorkSpace()!.id;
    // 判断是否有公司数据

    //let curCompanys: Company[] = await Provider.getPerson.getJoinedCompanys();
    // 获取当前单位
    //let curCompany: Company = curCompanys.filter((e) => e.target.id === compid)[0];
    // 判断是否重复 TODO
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
      compid, // 上一层ID
      true,
      compid, // 属于哪个公司的ID
    );
    if (res.success && res.data) {
      const xtarget = res.data as XTarget;
      // 部门创建成功， 就加入到列表里面
      const spaceObj: spaceObjs = {
        id: xtarget.id,
        key: xtarget.id,
        title: xtarget.name,
        parentId: compid,
        companyId: compid,
        children: [],
      };
      this.allCompanyDepts.get(compid)?.push(spaceObj);
    }
    return {
      msg: res.msg,
      success: res.success,
    };
  }
}

const settingController = new SettingController();

export default settingController;
