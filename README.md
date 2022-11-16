# 奥集能平台前端

![Image text](./config/logo/logo1.jpg)

## 简介

奥集能是面向下一代互联网发展趋势，以所有权作为第一优先级，运用零信任安全机制，面向组织提炼和抽象 “沟通、办事、仓库、商店和设置” 等基础功能，融合 b 端和 c 端全场景业务的新一代分布式应用架构。
本仓库是奥集能的前端 react 实现。

### 项目目录

```
├── .husky                              // husky git hooks配置目录
    ├── _                               // husky 脚本生成的目录文件
    ├── commit-msg                      // commit-msg钩子，用于验证 message格式
    ├── pre-commit                      // pre-commit钩子，主要是和eslint配合
├── config                              // 全局配置文件
    ├── vite                            // vite 相关配置 代理相关
    ├── constant.ts                     // 项目配置
    ├── themeConfig.ts                  // 主题配置
├── dist                                // 默认的 build 输出目录
├── mock                                // 前端数据mock
├── public                              // vite项目下的静态目录
└── src                                 // 源码目录
    ├── assets                          // 公共的文件（如image、css、font等）
    ├── bizcomponents                   // 业务组件
    ├── components                      // 项目组件
    ├── enums                           // 自定义 常量（枚举写法）
    ├── hooks                           // 自定义 hooks
    ├── layouts                         // 全局布局
    ├── routes                          // 路由
    ├── services                         // api封装
    ├── store                           // 状态管理器
    ├── utils                           // 工具库
    ├── pages                           // 页面模块目录 UI层
        ├── Home                        // Home页面模块
        ├── ...
    ├── app.tsx                           // 顶层文件
    ├── index.tsx                         // 项目入口文件
    ├── typings                           // 项目type类型定义文件夹
├── .editorconfig                       // IDE格式规范
├── .env                                // 环境变量
├── .eslintignore                       // eslint忽略
├── .eslintrc                           // eslint配置文件
├── .gitignore                          // git忽略
├── .npmrc                              // npm配置文件
├── .prettierignore                     // prettierc忽略
├── .prettierrc                         // prettierc配置文件
├── commitlint.config                   // git提交配置文件
├── index.html                          // 入口文件
├── LICENSE.md                          // LICENSE
├── package.json                        // package
├── postcss.config.js                   // postcss
├── README.md                           // README
├── tsconfig.json                       // typescript配置文件
└── vite.config.ts                      // vite
```

## 前往 product/rules 查看编码规则

## 进度

- [x] 本地 mockdata.json 完成基础页面逻辑
- [ ] 完成接口调试,对 mock 进行替换
- [ ] 完成最小可用功能,发布
- [ ] 升级,补充
- [ ] 移除多余组件
