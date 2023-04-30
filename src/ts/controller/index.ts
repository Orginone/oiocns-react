import UserProvider from '@/ts/core/user';
import MenuTypeList from "@/ts/core/Menu"
import { Emitter } from '../base/common';
import { ICompany, IPerson, ISpace, ITarget } from '../core';
/**
 * 设置控制器
 */
class IndexController extends Emitter {
  public currentKey: string = '';
  private _provider: UserProvider;
  private _menuIcon:MenuTypeList;
  constructor() {
    super();
    this._provider = new UserProvider();
    this._menuIcon = new MenuTypeList()
    this._provider.subscribe(async () => {
      await this._provider.refresh();
      this.changCallback();
    });
  }
  /** 是否已登录 */
  get logined(): boolean {
    return this._provider.user != undefined;
  }
  /** 数据提供者 */
  get provider(): UserProvider {
    return this._provider;
  }
  /** 当前用户 */
  get user(): IPerson {
    return this._provider.user!;
  }
  /** 框架结构icon */
  public MenuList(code:any){
     return this._menuIcon.GetMenuInfo(code)
  }
  /** 组织树 */
  public async getTeamTree(
    space: ISpace = this.user,
    isShare: boolean = true,
  ): Promise<ITarget[]> {
    const result: any[] = [];
    result.push(space);
    if (space === this.user) {
      result.push(...(await this.user.getCohorts(false)));
    } else if (isShare) {
      result.push(...(await (space as ICompany).getJoinedGroups(false)));
    }
    return result;
  }

  /** 组织树 */
  public async getCompanyTeamTree(
    company: ICompany,
    isShare: boolean = true,
  ): Promise<ITarget[]> {
    const result: any[] = [];
    result.push(company);
    if (isShare) {
      const groups = await company.getJoinedGroups(false);
      result.push(...groups);
    }
    return result;
  }
  /** 加载组织树 */
  public buildTargetTree(targets: ITarget[], menus?: (item: ITarget) => any[]) {
    const result: any[] = [];
    for (const item of targets) {
      result.push({
        id: item.id,
        item: item,
        isLeaf: item.subTeam.length == 0,
        menus: menus ? menus(item) : [],
        name: item === this.user ? '我的好友' : item.name,
        children: this.buildTargetTree(item.subTeam, menus),
      });
    }
    return result;
  }
}

export default new IndexController();
