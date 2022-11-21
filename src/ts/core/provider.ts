import { kernel, model } from '../base';
import MarketActionTarget from './target/mbase';
import Person from './target/person';

/**
 * 提供层
 */
export default class Provider {
  private static person: Person;
  private static _workSpace: MarketActionTarget | undefined;

  public static get userId() {
    return this.person.target.id;
  }

  public static async getAllWorkSpaces(): Promise<{ id: string; name: string }[]> {
    var workSpaces = [];
    if (this.person != null) {
      workSpaces.push({ id: this.person.target.id, name: '个人空间' });
      const companys = await this.person.getJoinedCompanys();
      companys.forEach((element) => {
        workSpaces.push({ id: element.target.id, name: element.target.name });
      });
    }
    return workSpaces;
  }

  /**
   * 获取当前工作空间
   * @returns 工作当前空间
   */
  public static async getWorkSpace(): Promise<MarketActionTarget | undefined> {
    if (this._workSpace == null) {
      var id = sessionStorage.getItem('_workSpaceId') + '';
      if (this.person.target.id == id) {
        return this.person;
      } else {
        const companys = await this.person.getJoinedCompanys();
        return companys.find((company) => {
          return company.target.id == id;
        });
      }
    }
    return this._workSpace;
  }

  /**
   * 切换工作空间
   * @param workSpace
   */
  public static async setWorkSpace(id: string) {
    sessionStorage.setItem('_workSpaceId', id);
    if (this.person.target.id == id) {
      this._workSpace = this.person;
    } else {
      const companys = await this.person.getJoinedCompanys();
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
    return this._workSpace?.target.id == this.person.target.id;
  }

  public static get getPerson(): Person {
    if (this.person == null) {
      this.person = new Person(JSON.parse(sessionStorage.getItem('_loginPerson') + ''));
    }
    return this.person;
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
      this.person = new Person(res.data.person);
      this.setWorkSpace(this.person.target.id);
      sessionStorage.setItem('_loginPerson', JSON.stringify(res.data.person));
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
      this.person = new Person(res.data.person);
      sessionStorage.setItem('_loginPerson', JSON.stringify(res.data.person));
    }
    return res;
  }
}
