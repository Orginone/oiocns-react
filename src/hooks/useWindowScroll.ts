import { useEffect, useState } from 'react';

//定义偏移量对象
interface ScrollOffset {
  x: number;
  y: number;
}

const useWindowScroll = () => {
  const [off, setOff] = useState<ScrollOffset>({
    x: window.scrollX,
    y: window.scrollY,
  });
  useEffect(() => {
    //监听
    window.addEventListener('scroll', () => {
      setOff({
        x: window.scrollX,
        y: window.scrollY,
      });
    });
    return () => {
      //移除监听
      window.removeEventListener('scroll', () => {
        setOff({
          x: window.scrollX,
          y: window.scrollY,
        });
      });
    };
  });
  return off;
};
export default useWindowScroll;
