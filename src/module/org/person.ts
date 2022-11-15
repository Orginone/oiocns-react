import API from '../../services';
import { CommonResponse, Page, PageData, PageResponse } from '../typings';
import { PageReq, toPageData } from './../index';
import { Person, AllApply } from '.';

/**
 * 人员(用户)业务
 */
class PersonService {
  /**
   * 搜索人员
   * @params 查询参数：过滤条件或分页请求
   * @returns 单位、公司列表
   */
  public searchPerson(params: string | PageReq): Promise<Person[]> {
    let body: PageReq;
    if (typeof params === 'string') {
      body = { filter: params, offset: 0, limit: 20 };
    } else {
      body = params;
    }
    return API.person.searchPersons({ data: body }).then(
      (res: PageResponse<Person>): Person[] => {
        if (res.success) {
          return res.data.result || [];
        } else {
          console.error(res.msg);
          return [];
        }
      },
      (error: any) => {
        throw error;
      },
    );
  }

  /**
   * 获取好友列表
   * @param page Antd分页信息
   * @returns 好友列表
   */
  public getFriends(page: Page): Promise<PageData<Person>> {
    return API.person.getFriends({ data: new PageReq(page) }).then(
      (res: PageResponse<Person>): PageData<Person> => toPageData(res),
      (error: any) => {
        throw error;
      },
    );
  }

  /**
   * 申请加好友
   * @param id 人员ID
   * @returns
   */
  public applyJoin(id: string): Promise<CommonResponse> {
    return API.person.applyJoin({ data: { id } }).then(
      (res: CommonResponse) => res,
      (error: any) => {
        throw error;
      },
    );
  }

  /**
   * 获取好友列表
   * @param page Antd分页信息
   * @returns 好友列表
   */
  public getAllApply(page: Page): Promise<PageData<AllApply>> {
    return API.person.getAllApply({ data: new PageReq(page) }).then(
      (res: PageResponse<AllApply>): PageData<AllApply> => toPageData(res),
      (error: any) => {
        throw error;
      },
    );
  }

  // cancelJoin
  /**
   * 取消申请
   * @param id 申请ID
   * @returns
   */
  public cancelJoin(id: string): Promise<CommonResponse> {
    return API.person.cancelJoin({ data: { id } }).then(
      (res: CommonResponse) => res,
      (error: any) => {
        throw error;
      },
    );
  }
}

const personService = new PersonService();

export default personService;
