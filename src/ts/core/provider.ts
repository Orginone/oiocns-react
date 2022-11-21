/*
 * @Author: SEN
 * @Date: 2022-11-17 13:30:54
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-17 13:55:49
 * @FilePath: /oiocns-react/src/ts/core/provider.ts
 * @Description: 登录和注册的接口提供层
 */
import { kernel, model } from '../base';
import Person from './target/person';

export default class Provider {
  private static person: Person;

  public static get userId() {
    return this.person.target.id;
  }

  public static get spaceId() {
    return this.person.spaceId;
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
