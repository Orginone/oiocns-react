import { useEffect, useState } from 'react';
import { generateUuid } from '@/ts/base/common';

/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useObjectUpdate = (data: any): [string, () => void] => {
  const [key, setKey] = useState(generateUuid());
  // 手动刷新
  const forceUpdate = () => {
    setKey(generateUuid());
  };
  useEffect(() => {
    forceUpdate();
  }, [data]);
  return [key, forceUpdate];
};

export default useObjectUpdate;
