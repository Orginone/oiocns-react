import { useRef } from 'react';

// 第一个参数为单击事件函数 第二个参数为双击事件函数
const useClick = (callback, doubleCallback) => {
  const clickRef = useRef({
    clickCount: 0,
    time: 0,
    timer: 0,
  });
  return (...args) => {
    clickRef.current.clickCount += 1;
    clickRef.current.time = Date.now();
    clickRef.current.timer = setTimeout(() => {
      if (
        Date.now() - clickRef.current.time <= 200 &&
        clickRef.current.clickCount === 2
      ) {
        doubleCallback && doubleCallback.apply(null, args);
      }
      if (clickRef.current.clickCount === 1) {
        callback && callback.apply(null, args);
      }
      clearTimeout(clickRef.current.timer);
      clickRef.current.clickCount = 0;
    }, 200) as any;
  };
};
export default useClick;
