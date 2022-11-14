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

// m--n 之间的数字
const renderNum = (m: number, n: number) => {
  return Math.floor(Math.random() * (n + 1 - m) + m);
};

export { debounce, renderNum };
