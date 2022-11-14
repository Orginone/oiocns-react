// 市场业务
export default class CommonClass {
  public nameSpace: string; //命名空间--用于区分功能
  // 接口注册
  protected searchApi: Function | undefined; // 查 数据
  protected createApi: Function | undefined; // 增 数据
  protected deleteApi: Function | undefined; // 删 数据
  protected updateApi: Function | undefined; // 改 数据
  protected joinTargetApi?: Function | undefined; // 向...加入
  protected quitTargetApi?: Function | undefined; // 从...退出
  // 功能数据
  public List: any[] = []; //列表数据
  public Total: number = 0; //列表 总数
  public QueryParams: any = {}; //记录历史请求参数
  constructor(data: {
    nameSpace: string; //命名空间--用于区分功能
    searchApi?: Function | undefined; // 查 数据
    createApi?: Function | undefined; // 增 数据
    deleteApi?: Function | undefined; // 删 数据
    updateApi?: Function | undefined; // 改 数据
    joinTargetApi?: Function | undefined; // 向...加入
    quitTargetApi?: Function | undefined; // 从...退出
  }) {
    this.nameSpace = data.nameSpace;
    // this[`${data.nameSpace}List`] = []; //列表 数据
    // this[`${data.nameSpace}Total`] = 0; //列表 总数
    // 接口注册
    this.searchApi = data.searchApi;
    this.createApi = data.createApi;
    this.deleteApi = data.deleteApi;
    this.updateApi = data.updateApi;
    this.joinTargetApi = data.joinTargetApi;
    this.quitTargetApi = data.quitTargetApi;
  }
  private _resetParams = <T extends { page: number; pageSize: number }>(params: T) => {
    const { page, pageSize, ...rest } = params;

    return {
      offset: (page - 1) * pageSize || 0,
      limit: pageSize || 20,
      ...rest,
    };
  };

  // 获取列表
  public async getList<T extends { page: number; pageSize: number }>(
    params: T,
  ): Promise<void> {
    if (!this.searchApi) return;
    const { data, success } = await this.searchApi({
      data: this._resetParams<T>(params),
    });
    if (success) {
      const { result = [], total = 0 } = data;
      this.List = result;
      this.Total = total;
      //记录搜索条件
      this.QueryParams = params;
    }
  }

  /**
   * @desc: 创建
   * @param {T} params
   * @return {*}
   */
  public async creatItem<T>(params: T): Promise<void> {
    if (!this.createApi) return;
    const { success } = await this.createApi({
      data: params,
    });

    if (success) {
      await this.getList(this.QueryParams);
      console.log('123' + this.List.length);
    }
  }

  /**
   * @desc: 更新
   * @param {T} params
   * @return {*}
   */
  public async updateItem<T>(params: T) {
    if (!this.updateApi) return;
    const { success } = await this.updateApi({
      data: params,
    });
    if (success) {
      await this.getList(this.QueryParams);
    }
  }

  /**
   * @desc: 删除
   * @param {string} id
   * @return {*}
   */
  public async deleteItem(id: string) {
    if (!this.deleteApi) return;
    const { success } = await this.deleteApi({
      data: { id },
    });
    if (success) {
      await this.getList(this.QueryParams);
    }
  }

  /**
   * @desc: 从...中退出
   * @param {string} targetId 目标Id
   * @return {*}
   */
  public async quitTarget(targetId: string | number) {
    if (!this.quitTargetApi) {
      return console.log('未注册 退出功能');
    }
    const { success } = await this.quitTargetApi({
      data: { id: targetId },
    });
    if (success) {
      await this.getList(this.QueryParams);
    }
  }
  /**
   * @desc: 向...中加入
   * @param {string} targetId 目标Id
   * @return {*}
   */
  public async joinTarget(targetId: string | number) {
    if (!this.joinTargetApi) {
      return console.log('未注册 加入功能');
    }
    const { success } = await this.joinTargetApi({
      data: { id: targetId },
    });
    if (success) {
      await this.getList(this.QueryParams);
    }
  }
}
