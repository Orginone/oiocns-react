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
import { SpaceType } from '@/store/type';

export default class Provider {
  private static person: Person;
  private static _workSpace: SpaceType;

  public static get userId() {
    return Provider.person.target.id;
  }

  /**
   * 获取工作空间
   * @returns 工作空间
   */
  public static getWorkSpace(): SpaceType {
    return Provider._workSpace;
  }

  /**
   * 切换工作空间
   * @param workSpace
   */
  public static setWorkSpace(workSpace: SpaceType) {
    Provider._workSpace = workSpace;
  }

  /**
   * 是否个人空间
   * @returns
   */
  public static isUserSpace(): boolean {
    return Provider._workSpace.id == Provider.person.target.id;
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
      this._workSpace = { id: this.person.target.id, name: '个人空间' };
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
