/**
 * vite plugin
 */

import legacy from '@vitejs/plugin-legacy';
// @vitejs/plugin-react-refresh 已被启用
// 使用 @vitejs/plugin-react代替
import react from '@vitejs/plugin-react';

export function createVitePlugins(viteEnv: string, isBuild: boolean) {
  if (isBuild) {
    return [react(), legacy()];
  }
  return [react()];
}
