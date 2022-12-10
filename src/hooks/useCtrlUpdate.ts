import { useEffect, useState } from 'react';
import { Emitter, generateUuid } from '@/ts/base/common';
import { emitter } from '@/ts/core';

/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useCtrlUpdate = (ctrl: Emitter, onSpaceUpdate?: Function): [string, () => void] => {
  const [key, setKey] = useState(generateUuid());
  // 手动刷新
  const forceUpdate = () => {
    setKey(generateUuid());
  };
  useEffect(() => {
    let sid = '';
    const id = ctrl.subscribe((key) => {
      setKey(key);
    });
    if (onSpaceUpdate) {
      sid = emitter.subscribe((key) => {
        onSpaceUpdate.apply(this, [key]);
      });
    }
    return () => {
      ctrl.unsubscribe(id);
      if (onSpaceUpdate) {
        emitter.unsubscribe(sid);
      }
    };
  }, []);
  return [key, forceUpdate];
};

export default useCtrlUpdate;
