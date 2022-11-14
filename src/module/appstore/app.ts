import API from '@/services';

class AppService {
  constructor() {}
  /**
   *@desc 获取应用资源
   * @param appid 应用id
   * @return 返回应用资源
   */
  public async getResource(appid: string) {
    const { data, success } = await API.product.searchResource({
      data: {
        id: appid,
        offset: 0,
        limit: 1000,
        filter: '',
      },
    });
    if (!success) {
      return;
    }
    const { result = [], total = 0 } = data;
    let tabs = result;
    console.log('资源', result);

    return tabs;
  }
}
const appService = new AppService();

export default appService;
