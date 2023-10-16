import React from 'react';
/** 超时响应句柄,防止频繁提交 */
const useTimeoutHanlder = (): [
  (hanlder: Function, timeout: number) => void,
  () => void,
] => {
  const [timeoutHanlder, setTimeoutHanlder] =
    React.useState<ReturnType<typeof setTimeout>>();
  // 提交句柄
  const submitHanlder = (hanlder: Function, timeout: number) => {
    if (timeout === 0) {
      hanlder();
    } else {
      clearHanlder();
      setTimeoutHanlder(
        setTimeout(() => {
          clearHanlder();
          hanlder();
        }, timeout),
      );
    }
  };
  // 清理句柄
  const clearHanlder = () => {
    if (timeoutHanlder) {
      clearTimeout(timeoutHanlder);
      setTimeoutHanlder(undefined);
    }
  };
  return [submitHanlder, clearHanlder];
};

export default useTimeoutHanlder;
