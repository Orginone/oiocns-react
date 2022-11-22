import { kernel, model } from '../base';
<<<<<<< HEAD
import spaceTarget from './target/sbase';
import Person from './target/person';
/** 空间类型申明 */
export type SpaceType = {
  /** 空间标识 */
  id: string;
  /** 空间名称 */
  name: string;
};
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

  public static async getAllWorkSpaces(): Promise<{ id: string; name: string }[]> {
    var workSpaces: { id: string; name: string }[] = [];
    if (this._person != null) {
      workSpaces.push({ id: this._person.target.id, name: '个人空间' });
      const companys = await this._person.getJoinedCompanys();
      companys.forEach((element) => {
        workSpaces.push({ id: element.target.id, name: element.target.name });
      });
    }
    return workSpaces;
=======
import Person from './target/person';
import { SpaceType } from '@/store/type';

export default class Provider {
  private static person: Person;
  private static _workSpace: SpaceType;

  public static get userId() {
    return Provider.person.target.id;
>>>>>>> 7e9c3588492b99929d9d4783190142669762ddac
  }

  /**
   * 获取工作空间
   * @returns 工作空间
   */
<<<<<<< HEAD
  public static async getWorkSpace(): Promise<spaceTarget | undefined> {
    if (this._workSpace == null) {
      let id = sessionStorage.getItem('_workSpaceId') + '';
      const companys = await this._person.getJoinedCompanys();
      let company = companys.find((company) => {
        return company.target.id == id;
      });
      this._workSpace = company ? company : this._person;
    }
    return this._workSpace;
=======
  public static getWorkSpace(): SpaceType {
    return Provider._workSpace;
>>>>>>> 7e9c3588492b99929d9d4783190142669762ddac
  }

  /**
   * 切换工作空间
   * @param workSpace
   */
<<<<<<< HEAD
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
=======
  public static setWorkSpace(workSpace: SpaceType) {
    Provider._workSpace = workSpace;
>>>>>>> 7e9c3588492b99929d9d4783190142669762ddac
  }

  /**
   * 是否个人空间
   * @returns
   */
  public static isUserSpace(): boolean {
<<<<<<< HEAD
    return this._workSpace?.target.id == this._person?.target.id;
=======
    return Provider._workSpace.id == Provider.person.target.id;
>>>>>>> 7e9c3588492b99929d9d4783190142669762ddac
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
<<<<<<< HEAD
      this.setPerson(res.data.person);
      var workspace = await Provider.getWorkSpace();
      workspace?.queryjoinApproval();
=======
      this.person = new Person(res.data.person);
      this._workSpace = { id: this.person.target.id, name: '个人空间' };
      sessionStorage.setItem('_loginPerson', JSON.stringify(res.data.person));
>>>>>>> 7e9c3588492b99929d9d4783190142669762ddac
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
