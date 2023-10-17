import React from 'react';
/** 超时响应句柄,防止频繁提交 */
const useTimeoutHanlder = (): [
  (hanlder: Function, timeout: number) => void,
  () => void,
] => {
  const timeoutHanlder = React.useRef<ReturnType<typeof setTimeout>>();
  // 提交句柄
  const submitHanlder = (hanlder: Function, timeout: number) => {
    if (timeout === 0) {
      hanlder();
    } else {
      clearHanlder();
      timeoutHanlder.current = setTimeout(() => {
        clearHanlder();
        hanlder();
      }, timeout);
    }
  };
  // 清理句柄
  const clearHanlder = () => {
    if (timeoutHanlder.current) {
      clearTimeout(timeoutHanlder.current);
      timeoutHanlder.current = undefined;
    }
  };
  return [submitHanlder, clearHanlder];
};

export default useTimeoutHanlder;
