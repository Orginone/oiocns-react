import dayjs from 'dayjs';
import path from 'path';
import type { ConfigEnv, UserConfig } from 'vite';

import { PORT, VITE_BASE_PATH, VITE_DROP_CONSOLE } from './config/constant';
import { themeVariables } from './config/theme';
import { createVitePlugins } from './config/vite/plugins';
import { createProxy } from './config/vite/proxy';
import pkg from './package.json';

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

// 函数式配置
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build';

  return {
    base: VITE_BASE_PATH,
    plugins: createVitePlugins(mode, isBuild),
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: themeVariables,
        },
      },
    },
    resolve: {
      alias: [
        { find: /^~/, replacement: '' },
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@cfg', replacement: path.resolve(__dirname, 'config') },
      ],
    },
    server: {
      // 是否主动唤醒浏览器
      open: false,
      // 占用端口 开发环境启动的端口
      port: PORT,
      // 是否使用https请求
      //  https: true,
      // 扩展访问端口
      host: true,
      hmr: true,
      watch: {
        usePolling: true, // WSL必须,否则热更新无效
      },
      proxy: createProxy(),
    },
    build: {
      target: 'es5',
      outDir: 'dist', // 指定输出路径
      minify: 'terser', // 混淆器,terser构建后文件体积更小
      sourcemap: false, // 输出.map文件
      chunkSizeWarningLimit: 2048,
      terserOptions: {
        compress: {
          drop_console: VITE_DROP_CONSOLE, // 生产环境移除console
          drop_debugger: true, // 生产环境移除debugger
          pure_funcs: ['console.log'],
        },
        output: {
          // 去掉注释内容
          comments: true,
        },
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        // external: ['react', 'antd'], // 注意看这里
        treeshake: false,
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // manualChunks(id) {
          //   if (id.includes('components')) {
          //     // 把 components 文件里面的文件都打包到 components.js 中
          //     return 'components';
          //   }
          //   // 静态资源拆分
          //   if (id.includes('node_modules')) {
          //     return id.toString().split('node_modules/')[1].split('/')[0].toString();
          //   }
          // },
        },
        plugins: [
          {
            name: 'no-treeshake',
            transform(_, id) {
              if (id.includes('integration/jquery')) {
                return { moduleSideEffects: 'no-treeshake' };
              }
              if (id.includes('ui/data_grid')) {
                return { moduleSideEffects: 'no-treeshake' };
              }
            },
          },
        ],
      },
    },
    define: {
      // 设置应用信息
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
};
