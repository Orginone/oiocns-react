/**
 * Proxy
 * 本地反向代理
 */
import type { ProxyOptions } from 'vite';

// import { VITE_PROXY_HTTP } from '../constant';

type ProxyTargetList = Record<
  string,
  // eslint-disable-next-line no-unused-vars
  ProxyOptions & { rewrite?: (path: string) => string }
>;

/**
 * Generate proxy
 * @param list
 */
export function createProxy() {
  const ProxyList: ProxyTargetList = {
    '/orginone': {
      target: 'https://asset.orginone.cn', // 后台接口
      changeOrigin: true, // 是否允许跨域
      ws: true,
    },
  };
  return ProxyList;
}
