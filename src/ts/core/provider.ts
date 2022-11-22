import { kernel, model } from '../base';
import spaceTarget from './target/sbase';
import Person from './target/person';
const sessionStorageName = 'sessionPerson';
export default class Provider {
  private static _person: Person;
  private static _workSpace: spaceTarget | undefined;

  /**
   * 当前用户ID
   */
  public static get userId(): string {
    if (this.getPerson) {
      return this.getPerson.target.id;
    }
    throw new Error('未登录');
  }

  public static getAllWorkSpaces(): { id: string; name: string }[] {
    var workSpaces: { id: string; name: string }[] = [];
    if (this._person != null) {
      workSpaces.push({ id: this._person.target.id, name: '个人空间' });
      this._person.getJoinedCompanys().then((companys) => {
        companys.forEach((element) => {
          workSpaces.push({ id: element.target.id, name: element.target.name });
        });
        return workSpaces;
      });
    }
    return workSpaces;
  }

  /**
   * 获取当前工作空间
   * @returns 工作当前空间
   */
  public static getWorkSpace(): spaceTarget | undefined {
    if (this._workSpace == null) {
      var id = sessionStorage.getItem('_workSpaceId') + '';
      if (this._person.target.id == id) {
        return this._person;
      } else {
        this._person.getJoinedCompanys().then((companys) => {
          return companys.find((company) => {
            return company.target.id == id;
          });
        });
      }
    }
  }

  /**
   * 切换工作空间
   * @param workSpace
   */
  public static async setWorkSpace(id: string) {
    sessionStorage.setItem('_workSpaceId', id);
    if (this._person.target.id == id) {
      this._workSpace = this._person;
    } else {
      const companys = await this._person.getJoinedCompanys();
      this._workSpace = companys.find((company) => {
        return company.target.id == id;
      });
    }
  }

  /**
   * 是否个人空间
   * @returns
   */
  public static isUserSpace(): boolean {
    return this._workSpace?.target.id == this._person?.target.id;
  }

  /**
   * 当前用户
   */
  public static get getPerson(): Person | undefined {
    if (this._person === undefined) {
      const sp = sessionStorage.getItem(sessionStorageName);
      if (sp && sp.length > 0) {
        this.setPerson(JSON.parse(sp));
      }
    }
    return this._person;
  }

  /**
   * 设置当前用户
   * @param data 数据
   */
  private static setPerson(data: any) {
    this._person = new Person(data);
    this.setWorkSpace(this._person.target.id);
    sessionStorage.setItem(sessionStorageName, JSON.stringify(data));
  }
  /**
   * 登录
   * @param account 账户
   * @param password 密码
   */
  public static async login(
    account: string,
    password: string,
  ): Promise<model.ResultType<any>> {
    let res = await kernel.login(account, password);
    if (res.success) {
      this.setPerson(res.data.person);
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
  public static async register(
    name: string,
    motto: string,
    phone: string,
    account: string,
    password: string,
    nickName: string,
  ): Promise<model.ResultType<any>> {
    let res = await kernel.register(name, motto, phone, account, password, nickName);
    if (res.success) {
      this.setPerson(res.data.person);
    }
    return res;
  }
}
