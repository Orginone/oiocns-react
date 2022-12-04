import { useEffect, useState } from 'react';
import { generateUuid } from '@/ts/base/common';
import baseCtrl from '@/ts/controller/baseCtrl';

/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useCtrlUpdate = (ctrl: baseCtrl): [string, () => void] => {
  const [key, setKey] = useState(generateUuid());
  // 手动刷新
  const forceUpdate = () => {
    setKey(generateUuid());
  };
  useEffect(() => {
    const id = ctrl.subscribe((key) => {
      setKey(key);
    });
    return () => {
      ctrl.unsubscribe(id);
    };
  }, []);
  return [key, forceUpdate];
};
export default useCtrlUpdate;
