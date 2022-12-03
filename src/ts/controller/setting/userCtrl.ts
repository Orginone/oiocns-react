import BaseController from '../baseCtrl';
import { kernel, model, schema } from '../../base';
import { ICompany, IPerson, SpaceType } from '../../core/target/itarget';
import Person from '../../core/target/person';
export enum UserPartTypes {
  'User' = 'user',
  'Space' = 'space',
}
const sessionUserName = 'sessionUser';
const sessionSpaceName = 'sessionSpace';
/** 用户控制器 */
class UserController extends BaseController {
  private _user: IPerson | undefined;
  private _curSpace: ICompany | undefined;
  /**构造方法 */
  constructor() {
    super();
    const userJson = sessionStorage.getItem(sessionUserName);
    if (userJson && userJson.length > 0) {
      this._loadUser(JSON.parse(userJson));
      this._curSpace = this._findCompany(sessionStorage.getItem(sessionSpaceName) || '');
      if (this._curSpace) {
        this.changCallbackPart(UserPartTypes.Space);
      }
    }
  }
  /** 是否已登录 */
  get Logined(): boolean {
    return this._user != undefined;
  }
  /** 是否为单位空间 */
  get IsCompanySpace(): boolean {
    return this._curSpace != undefined;
  }
  /** 当前用户 */
  get User(): IPerson {
    if(this._user){
      return this._user;
    }else{
      return { id: '', target: {id: ''} } as unknown as Person;
    }
  }
  /** 当前单位空间 */
  get Space(): ICompany {
    if(this._curSpace){
      return this._curSpace;
    }else{
      return { id: '', target: {id: ''} } as unknown as ICompany;
    }
  }
  /** 当前空间数据 */
  get SpaceData(): SpaceType {
    if (this._curSpace) {
      return this._curSpace.getSpaceData;
    }
    return this._user!.getSpaceData;
  }
  /** 设置当前空间 */
  public setCurSpace(id: string) {
    if (id === this._user!.target.id) {
      this._curSpace = undefined;
    } else {
      this._curSpace = this._findCompany(id);
    }
    this.changCallbackPart(UserPartTypes.Space);
  }

  /**
   * 登录
   * @param account 账户
   * @param password 密码
   */
  public async login(account: string, password: string): Promise<model.ResultType<any>> {
    let res = await kernel.login(account, password);
    if (res.success) {
      await this._loadUser(res.data.person);
    }
    return res;
  }
  /**
   * 注册用户
   * @param name 姓名
   * @param motto 座右铭
   * @param phone 电话
   * @param account 账户
   * @param password 密码
   * @param nickName 昵称
   */
  public async register(
    name: string,
    motto: string,
    phone: string,
    account: string,
    password: string,
    nickName: string,
  ): Promise<model.ResultType<any>> {
    let res = await kernel.register(name, motto, phone, account, password, nickName);
    if (res.success) {
      await this._loadUser(res.data.person);
    }
    return res;
  }
  /**
   * 变更密码
   * @param account 账号
   * @param password 密码
   * @param privateKey 私钥
   * @returns
   */
  public async resetPassword(
    account: string,
    password: string,
    privateKey: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.resetPassword(account, password, privateKey);
  }

  private async _loadUser(person: schema.XTarget): Promise<void> {
    sessionStorage.setItem(sessionUserName, JSON.stringify(person));
    this._user = new Person(person);
    await this._user.getJoinedCompanys();
    this.changCallbackPart(UserPartTypes.User);
  }

  private _findCompany(id: string): ICompany | undefined {
    if (this._user && id.length > 0) {
      for (const item of this._user.joinedCompany) {
        if (item.target.id === id) {
          return item;
        }
      }
    }
  }
}

export default new UserController();
