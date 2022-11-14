import { useEffect, useState } from 'react';

//定义size对象
interface WindowSize {
  width: number;
  height: number;
}
const useWindowSize = () => {
  const [size, setSize] = useState<WindowSize>({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });

  useEffect(() => {
    //监听size变化
    window.addEventListener('resize', () => {
      setSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    });
    return () => {
      //组件销毁时移除监听
      window.removeEventListener('resize', () => {
        setSize({
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
        });
      });
    };
  }, []);
  return size;
};
export default useWindowSize;
