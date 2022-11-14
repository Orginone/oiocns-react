export type ListProps = Pick<PaginationProps, 'current' | 'pageSize'> &
  Partial<CommonParamsType>;

class Base {
  protected _formatPage = (params: ListProps) => {
    const sevicePage: CommonParamsType = {
      limit: params.pageSize,
      offset: params.current - 1,
      ...params,
    };
    delete sevicePage.current;
    delete sevicePage.pageSize;
    return sevicePage;
  };
}

export default Base;
