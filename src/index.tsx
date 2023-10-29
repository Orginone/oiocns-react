// // vite-plugin-imp、vite-plugin-style-import
// // 两款按需加载都存在部分问题，目前先按照全局引入
// // 引入 less 文件，使vite的配置可以替换主题

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';
const container = document.getElementById('root') as Element | DocumentFragment;
const root = createRoot(container);
root.render(<App />);
