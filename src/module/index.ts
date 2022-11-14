import {
  CommonResponse,
  IdPage,
  IdStatusPage,
  Page,
  PageData,
  PageResponse,
  StatusPage,
} from './typings';

/**
 * 分页查询
 * 请求体
 */
export class IdPageReq {
  id: number | string;
  offset: number;
  limit: number;
  filter?: string;
  constructor(p: IdPage) {
    this.id = p.id;
    this.offset = (p.page - 1) * p.pageSize || 0;
    this.limit = p.pageSize || 20;
    this.filter = p.filter;
  }
}

/**
 * 分页查询
 * 请求体
 */
export class StatusPageReq {
  status: number | string;
  offset: number;
  limit: number;
  filter?: string;
  constructor(p: StatusPage) {
    this.offset = (p.page - 1) * p.pageSize || 0;
    this.limit = p.pageSize || 20;
    this.filter = p.filter;
    this.status = p.status;
  }
}

/**
 * ID和状态分页查询
 * 请求体
 */
export class IdStatusPageReq {
  id: number | string;
  status: number | string;
  offset: number;
  limit: number;
  filter?: string;
  constructor(p: IdStatusPage) {
    this.id = p.id;
    this.offset = (p.page - 1) * p.pageSize || 0;
    this.limit = p.pageSize || 20;
    this.filter = p.filter;
    this.status = p.status;
  }
}

/**
 * 分页查询
 * 请求体
 */
export class PageReq {
  offset: number;
  limit: number;
  filter?: string;
  constructor(p: Page) {
    this.offset = (p.page - 1) * p.pageSize || 0;
    this.limit = p.pageSize || 20;
    this.filter = p.filter;
  }
}

/**
 * 后台响应 => 前端业务结果(分页)
 * @param res 后台分页响应
 * @returns
 */
export function toPageData<T>(res: PageResponse<T>): PageData<T> {
  if (res.success) {
    return {
      success: true,
      data: res.data?.result || [],
      total: res.data?.total || 0,
      msg: res.msg,
    };
  } else {
    console.error(res?.msg);
    return { success: false, data: [], total: 0, msg: res.msg };
  }
}

/**
 * 后台响应 => 前端业务结果(数组、不分页)
 * @param res 后台分页响应
 * @returns
 */
export function toArrayData<T>(res: PageResponse<T>): Array<T> {
  if (res.success) {
    return res.data?.result || [];
  } else {
    console.error(res.msg);
    return [];
  }
}

/**
 * 后台响应 => 前端业务结果(对象、不分页)
 * @param res 后台分页响应
 * @returns
 */
export function toData(res: CommonResponse): Record<string, any> {
  if (res.success) {
    return res.data;
  } else {
    console.error(res.msg);
    return res.data;
  }
}
