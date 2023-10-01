import { useEffect, useState } from 'react';

/**
 * 需异步加载后执行的hooks
 * @param callback 在此处执行异步方法() => {return loadAsync();}
 * @returns hooks 常量
 */
function useAsyncLoad<T>(callback: () => Promise<T>): [boolean, T | undefined] {
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<T>();
  useEffect(() => {
    setTimeout(async () => {
      const data = await callback();
      if (data) {
        setResult(data);
      }
      setLoaded(true);
    }, 20);
  }, []);
  return [loaded, result];
}

export default useAsyncLoad;
