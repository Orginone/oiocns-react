/**
 * 公共返回Response
 * 请求体
 */
export type CommonResponse = {
  code: number;
  data: Record<string, any>;
  msg: string;
  success: boolean;
};

/**
 * 前端业务分页结果的数据类型
 */
export type PageData<P = {}> = {
  success: boolean;
	total: number;
	data: P[];
  msg?: string;
}

/**
 * 后台分页查询返回的数据
 */
export type PageResponseData<P = {}> = {
  limit: number;
  total: number;
  result: P[];
};

/**
 * 分页返回Response
 * 请求体
 */
export type PageResponse<P = {}> = {
  code: number;
  data: PageResponseData<P>;
  msg: string;
  success: boolean;
};

/**
 * 扩展
 * 请求体
 */
export type ExtendReq = {
  teamId: number | string;
  sourceId: number | string;
  sourceType: string;
  destIds: number[] | string[];
  destType: string;
};

/**
 * ID查询
 * 请求体
 */
export type IdReq = {
  id: number | string;
};

/**
 * ID和状态查询
 * 请求体
 */
export type IdStatusReq = {
  id: number | string;
  status: number | string;
};

/**
 * 查询扩展
 * 请求体
 */
export type QueryExtendReq = {
  teamId: number | string;
  sourceId: number | string;
  sourceType: string;
  destType: string;
};

/**
 * ID分页查询
 * 请求体
 */
export type IdPage = {
  id: number | string;
  page: number;
  pageSize: number;
  filter?: string;
};

/**
 * 通过状态字段分页查询
 * 请求体
 */
export type StatusPage = {
  status: number | string;
  page: number;
  pageSize: number;
  filter?: string;
};

/**
 * ID和状态分页查询
 * 请求体
 */
export type IdStatusPage = {
  id: number | string;
  status: number | string;
  page: number;
  pageSize: number;
  filter?: string;
};

/**
 * 分页查询
 * 请求体
 */
export type Page = {
  page: number;
  pageSize: number;
  filter?: string;
};

/**
 * ProTable Response
 * 表格需要的响应格式
 */
export type TableResponse<T> = {
  total: number;
  data: T;
  msg?: string;
  success: boolean;
};
