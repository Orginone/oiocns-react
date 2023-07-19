import { useEffect, useState } from 'react';
import { Emitter, generateUuid } from '@/ts/base/common';

/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useCtrlUpdate = (ctrl: Emitter): [string, () => void] => {
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
