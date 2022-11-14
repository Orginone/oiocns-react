import API from '@/services';
import Base from './base';

export type ListProps = Pick<PaginationProps, 'current' | 'pageSize'> &
  Partial<CommonParamsType>;
// 组织单位
class PersonServices extends Base {
  /**
   * changeWorkspace 改变工作空间
   * @params {ListProps}
   */
  public async changeWorkspace(params: { id: string }) {
    const { data, success } = await API.person.changeWorkspace({
      data: params,
    });
    if (!success) {
      return { data: {}, success };
    }
    return { data, success };
  }

  /**
   * queryInfo 获取用户信息
   */
  public async getUserInfo() {
    const { data, success } = await API.person.queryInfo();
    if (!success) {
      return { data: {}, total: 0, success };
    }
    return { data, success };
  }
}
const services = new PersonServices();

export default services;
