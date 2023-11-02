/**
 * vite plugin
 */

import legacy from '@vitejs/plugin-legacy';
// @vitejs/plugin-react-refresh 已被启用
// 使用 @vitejs/plugin-react代替
import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';

// import configVisualizerPlugin from './visualizer';

export function createVitePlugins(viteEnv: string, isBuild: boolean) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // have to
    react(),
  ];

  // @vitejs/plugin-legacy
  isBuild &&
    vitePlugins.push(
      legacy({
        targets: ['defaults'],
        renderLegacyChunks: true,
      }),
    );

  // vite-plugin-style-import
  // vitePlugins.push(configStyleImportPlugin(isBuild));

  // rollup-plugin-visualizer
  // if (isBuild) {
  //   vitePlugins.push(configVisualizerPlugin());
  // }

  //vite-plugin-theme
  // vitePlugins.push(configThemePlugin(isBuild));

  return vitePlugins;
}
