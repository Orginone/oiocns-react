const debounce = (fun: any, delay?: number) => {
  let timer: any = '';
  let that = this;
  return (args: any) => {
    let _args = args;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fun.call(that, _args);
    }, delay ?? 300);
  };
};

/**
 * @desc: 处理 翻页参数问题
 * @param {T} params
 * @return {*}
 */
const _resetParams = (params: any) => {
  const { page, pageSize, ...rest } = params;
  const num = (page - 1) * pageSize;

  return {
    offset: num >= 0 ? num : 0,
    limit: pageSize || 20,
    ...rest,
  };
};

// m--n 之间的数字
const renderNum = (m: number, n: number) => {
  return Math.floor(Math.random() * (n + 1 - m) + m);
};

export { debounce, renderNum };
