import { useState } from 'react';

/* 
    针对对Boolean之间的切换,展开收起功能
*/

const useToggle = (initialState: boolean = false) => {
  const [toggle, setToggle] = useState(initialState);
  const switchToogle: any = () => {
    setToggle(!toggle);
  };
  return [toggle, switchToogle];
};
export default useToggle;
