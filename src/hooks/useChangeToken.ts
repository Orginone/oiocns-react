import { useState } from 'react';

export function useChangeToken() {
  const [token, setToken] = useState(true);
  return [
    function refresh() {
      setToken((v) => !v);
    },
    function withChangeToken() {
      // 增加一个无用的DOM data-*属性，来触发指定DOM元素的刷新
      return {
        ['data-r_change_token']: token,
      } as any;
    },
  ] as [() => void, () => any];
}
