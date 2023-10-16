import React from 'react';

/** 监听浏览器宽度以指定值触发变更，响应式布局 */
const useWidthToggle = (toggleWidth: number): boolean => {
  const [toggle, setToggle] = React.useState(window.innerWidth > toggleWidth);
  const resizeToggle = React.useCallback(() => {
    setToggle(window.innerWidth > toggleWidth);
  }, []);
  React.useEffect(() => {
    window.addEventListener('resize', resizeToggle);
    return () => {
      window.removeEventListener('resize', resizeToggle);
    };
  }, [toggle]);
  return toggle;
};

export default useWidthToggle;
