import { useEffect, useState } from 'react';
interface pageApiType {
  nameSpace: string; //命名空间--用于区分功能块
  searchApi?: Function; // 查 数据
  createApi?: Function; // 增 数据
  deleteApi?: Function; // 删 数据
  updateApi?: Function; // 改 数据
  //   joinTargetApi?: Function; // 向...加入
  //   quitTargetApi?: Function; // 从...退出
}
interface PagequeryParamsBaseType {
  page: number;
  pageSize: number;
  id?: number | string;
  status?: number | string;
}
type resultParams = {
  offset: number;
  limit: number;
} & Omit<PagequeryParamsBaseType, 'page' | 'pageSize'>;
const usePageApi = <T extends PagequeryParamsBaseType, P extends any>({
  nameSpace,
  searchApi,
  createApi,
  deleteApi,
  updateApi,
}: // joinTargetApi,
// quitTargetApi,
pageApiType) => {
  const [list, setList] = useState<P[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [queryParams, setqueryParams] = useState<any>({});
  const queryLastTime: number = 0;
  let nameSpaceStr = [...nameSpace];
  nameSpaceStr[0] = nameSpaceStr[0].toUpperCase();
  const resNameSpaceStr = nameSpaceStr.join('');
  /**
   * @desc: 处理 翻页参数问题
   * @param {T} params
   * @return {*}
   */
  const _resetParams = (params: T): resultParams => {
    const { page, pageSize, ...rest } = params;
    const num = (page - 1) * pageSize;

    return {
      offset: num >= 0 ? num : 0,
      limit: pageSize || 20,
      ...rest,
    };
  };
  /**
   * @desc: 判断是否刷新
   * @param {resultParams} newParams
   * @return {*}
   */
  const _canRefreshData = (newParams: resultParams): boolean => {
    // 缓存处理 条件如下 强制刷新 / 数据超时 / 已存在数据 但是请求参数未变化
    const nowTime = new Date().getTime();
    const bool = nowTime - queryLastTime < 5 * 3600 * 1000;
    return (
      bool ||
      (list.length > 0 && JSON.stringify(newParams) === JSON.stringify(queryParams))
    );
  };
  /**
   * @desc: 刷新列表
   * @return {*}
   */
  const refresh = async () => {
    await queryData(queryParams, true);
  };

  /**
   * @desc: 获取列表
   * @param {T} params
   * @param {*} isRefresh
   * @return {*}
   */
  async function queryData(params: T, isRefresh = false): Promise<void> {
    if (!searchApi) return;

    const reslutParams: resultParams = _resetParams(params);
    if (!isRefresh || _canRefreshData(reslutParams)) {
      return;
    }

    const { data, success } = await searchApi({
      data: reslutParams,
    });
    if (success) {
      const { result = [], total = 0 } = data;
      setList([...result]);
      setTotal(total);
      //记录搜索条件
      setqueryParams({ ...params });
    } else {
      setList([]);
      setTotal(0);
    }
  }

  /**
   * @desc: 创建
   * @param {T} params
   * @return {*}
   */
  async function creatFun<T>(params: T): Promise<void> {
    if (!createApi) return;
    const { success } = await createApi({
      data: params,
    });
    if (success) {
      await refresh;
    }
  }

  /**
   * @desc: 更新
   * @param {T} params
   * @return {*}
   */
  async function updateFun<T>(params: T) {
    if (!updateApi) return;
    const { success } = await updateApi({
      data: params,
    });
    if (success) {
      await refresh;
    }
  }

  /**
   * @desc: 删除
   * @param {string} id
   * @return {*}
   */
  async function deleteFun(id: string) {
    if (!deleteApi) return;
    const { success } = await deleteApi({
      data: { id },
    });
    if (success) {
      await refresh;
    }
  }

  // /**
  //  * @desc: 从...中退出
  //  * @param {string} targetId 目标Id
  //  * @return {*}
  //  */
  // async function quitTarget(targetId: string | number) {
  //   if (!quitTargetApi) {
  //     return console.log('未注册 退出功能');
  //   }
  //   const { success } = await quitTargetApi({
  //     data: { id: targetId },
  //   });
  //   if (success) {
  //     await refresh;
  //   }
  // }
  // /**
  //  * @desc: 向...中加入
  //  * @param {string} targetId 目标Id
  //  * @return {*}
  //  */
  // async function joinTarget(targetId: string | number) {
  //   if (!joinTargetApi) {
  //     return console.log('未注册 加入功能');
  //   }
  //   const { success } = await joinTargetApi({
  //     data: { id: targetId },
  //   });
  //   if (success) {
  //     await refresh;
  //   }
  // }
  return [queryData, list, total, creatFun, deleteFun, updateFun, refresh];

  // return {
  //   [`query${resNameSpaceStr}Data`]: queryData,
  //   [`${resNameSpaceStr}Data`]: list,
  //   [`${resNameSpaceStr}Total`]: total,
  //   creatFun,
  //   deleteFun,
  //   updateFun,
  //   quitTarget,
  //   joinTarget,
  //   refresh,
  // };
};

export default usePageApi;
