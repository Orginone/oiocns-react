/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-19 10:49:44
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-21 15:18:59
 * @FilePath: /oiocns-react/src/ts/controller/setting/content.ts
 * @Description: 控制器 实例化要调用的接口基类 提供ui层数据
 */
import Company from '../../core/target/company';
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
  // 测试的时候先写死， 到时候切换成 当前工作空间ID
  companyID: string = '381107910723375104';

  // 我的用户服务
  private userDataService: UserdataService = UserdataService.getInstance();

  // 切换空间的时候重新初始化，所以需要new
  constructor() {
    Provider.getWorkSpace();
    // 如果是一个公司的工作空间，需要初始化一个部门数组
    // 切换工作空间的时候 初始化控制器。
  }

  // 测试代码不使用
  // public async test() {
  //   const params: deptParams = {
  //     name: '部门六一一',
  //     code: 'BMSixONE',
  //     teamName: '部门六一一',
  //     teamCode: 'BMSixONE',
  //     remark: '部门六一一',
  //   };
  //   console.log(params);

  //   // const compid = '383264515724283904';
  //   // const deptid = '381107910723375104';
  //   // 381107910723375104
  //   // console.log(await this.createSecondDepartment(params));
  //   let arrays: spaceObjs[] = await this.getDepartments('0');
  //   console.log('-------', arrays);
  // }

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
          arrayChild = await this.getDepartments(comp.target.id);
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
      // companys.forEach(async (e) => {});
    }
    return arrays;
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

    // 加入到 公司部门底下的缓存
    return {
      msg: res.msg,
      success: res.success,
    };
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
  // 查询公司底下所有的用户
  // 查询部门底下的用户
  // 拉人进部门， 或移除人出部门
  //
}

const settingController = new SettingController();

export default settingController;
