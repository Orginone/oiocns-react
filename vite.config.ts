import dayjs from 'dayjs';
import path from 'path';
import type { ConfigEnv, UserConfig } from 'vite';

import { themeVariables } from './config/theme';
import { createVitePlugins } from './config/vite/plugins';
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
    base: '/',
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
      port: 8080,
      // 是否使用https请求
      //  https: true,
      // 扩展访问端口
      host: true,
      hmr: true,
      watch: {
        usePolling: true, // WSL必须,否则热更新无效
      },
      proxy: {
        '/orginone': {
          target: 'https://asset.orginone.cn', // 后台接口
          changeOrigin: true, // 是否允许跨域
          ws: true,
        },
      },
    },
    build: {
      outDir: 'dist', // 指定输出路径
      minify: 'terser', // 混淆器,terser构建后文件体积更小
      sourcemap: false, // 输出.map文件
      chunkSizeWarningLimit: 2048,
      terserOptions: {
        compress: {
          drop_debugger: true, // 生产环境移除debugger
        },
        output: {
          // 去掉注释内容
          comments: true,
        },
      },
      rollupOptions: {
        treeshake: false,
        external: ['handsontable'],
        output: {
          chunkFileNames: 'static/js/[hash].js',
          entryFileNames: 'static/js/[hash].js',
          assetFileNames: 'static/[ext]/[hash].[ext]',
          manualChunks: {
            'react-vendor': [
              'react',
              'react-use',
              'react-dom',
              'react-icons',
              'qrcode.react',
              'react-router-dom',
              'react-office-viewer',
              'react-router-config',
            ],
            'antv-vendor': [
              '@antv/x6',
              '@antv/x6-plugin-dnd',
              '@antv/x6-react-shape',
              '@antv/x6-plugin-selection',
            ],
            'editor-vendor': [
              'for-editor',
              'html2canvas',
              '@wangeditor/editor',
              '@wangeditor/editor-for-react',
            ],
            'uiw-vendor': [
              '@uiw/codemirror-extensions-langs',
              '@uiw/codemirror-theme-vscode',
              '@uiw/react-codemirror',
            ],
            'xlsx-vendor': ['xlsx'],
            'play-vendor': ['jol-player'],
            'dev-vendor': ['devextreme-react'],
            'emoji-vendor': ['@emoji-mart/react', '@emoji-mart/data', 'emoji-mart'],
            'antd-vendor': ['antd', '@ant-design/icons', '@ant-design/pro-components'],
          },
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
