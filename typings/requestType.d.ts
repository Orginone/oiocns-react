type CommonParamsType = {
  offset: number;
  limit: number;
  filter?: string;
  current?: number;
  pageSize?: number;
  status?: string | number;
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

interface ResultType {
  code: number;
  data: any;
  msg: string;
  success: boolean;
}
