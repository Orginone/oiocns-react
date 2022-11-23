import { DeptTree } from '@/ts/core/setting/isetting';

/**
 * 部门设置控制器
 * */ 
class settingController { 
  private _depts:DeptTree[] = [];
   /** 当前部门树 */
  public get groups() {
    return this._depts;
  }
  /**
   * 初始化获取菜单
   * */ 
  private async _initialization(): Promise<void> { 

  }
}

export const settingCtrl = new settingController();