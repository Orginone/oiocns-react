type CommonParamsType = {
  offset: number;
  limit: number;
  filter?: string;
  current?: number;
  pageSize?: number;
  status?: string | number;
  id?: string | number;
};
// 翻页props
type PaginationProps = {
  total: number;
  currentPage: number;
  current: any;
  pageSize: number;
  pageSizes: number[];
  layout: string;
};

/**
 * 分页查询
 * 请求体
 */
interface PageParams {
  page: number;
  pageSize: number;
  filter?: string;
}
/**
 * ID分页查询
 * 请求体
 */
interface IdPage extends PageParams {
  id: string;
}

/**
 * 通过状态字段分页查询
 * 请求体
 */
interface StatusPage extends PageParams {
  status: number | string;
}

/**
 * ID和状态分页查询
 * 请求体
 */
interface IdStatusPage extends PageParams {
  id: number | string;
  status: number | string;
}
