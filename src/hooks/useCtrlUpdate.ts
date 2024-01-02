import { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { Emitter, generateUuid } from '@/ts/base/common';
import { command } from '@/ts/base';

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
  }, [ctrl]);
  return [key, forceUpdate];
};

/**
 * 根据标识监听命令hook
 * @param flag 标识
 * @param callback? 回调
 * @returns hooks 常量
 */
export const useFlagCmdEmitter = (
  flag: string,
  callback?: Function,
): [boolean, string, () => void] => {
  const [key, setKey] = useState(generateUuid());
  const [loaded, setLoaded] = useState(orgCtrl.provider.inited);
  // 手动刷新
  const forceUpdate = () => {
    setKey(generateUuid());
  };
  useEffect(() => {
    const id = command.subscribeByFlag(flag, (done: boolean) => {
      forceUpdate();
      if (done === true) {
        setLoaded(true);
      }
      if (callback) {
        callback();
      }
    });
    return () => {
      command.unsubscribeByFlag(id);
    };
  }, []);
  return [loaded, key, forceUpdate];
};

export default useCtrlUpdate;
