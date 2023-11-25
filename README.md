# 奥集能平台前端

![Image text](https://user-images.githubusercontent.com/8328012/201800690-9f5e989e-4ed3-4817-85b9-b594ac89fd31.png)

## 架构简介
面向下一代互联网发展趋势，基于动态演化的复杂系统多主体建模方法，以所有权作为第一优先级，运用零信任安全机制，按自组织分形理念提炼和抽象“沟通、办事、门户、数据、关系”等基础功能，为b端和c端融合的全场景业务的提供新一代分布式应用架构。    
## 基本功能
### 奥集能
奥集能（Orginone 发音[ˈɔːdʒɪnʌn]）个人和组织数字化一站式解决方案！   
奥：奥妙，莫名其妙。集，聚集，无中生有。能，赋能，点石成金。   
### 门户
按权限自定义工作台、动态信息，新闻资讯，交易商城，监控大屏，驾驶舱等各类页面。以用户为中心，汇聚各类数据和信息。
### 沟通
为个人和组织提供可靠、安全、私密的即时沟通工具，好友会话隐私保护作为第一优先级，同事和组织等工作会话单位数据权利归属优先。   
### 办事
满足个人、组织和跨组织协同办事需求，适应各类业务流程场景，支持发起、待办、已办、抄送、归档等不同状态流程类业务审核审批和查询。      
### 数据
用户对数据标准和存储方式拥有绝对控制权，自主选择存储资源，自定义数据标准、业务模型和管理流程，无代码配置应用，便捷迁移外部数据，支持通用文件系统管理功能。   
### 关系
支持个人和组织的关系的建立，好友和成员的管理，家庭、群组、单位、部门、集团等各类组织形态的构建，快速将工作和业务关系数字化、在线化，支持灵活的权限、角色和岗位管理等不同颗粒度的访问控制功能。   

### 本存储是奥集能的前端 react 实现。
- 体验地址：https://ocia.orginone.cn 
- 注册账号后可以申请加入一起研究群：research，协同研发群：asset_devops
### 项目目录

```
├── .husky                              // husky git hooks配置目录
    ├── _                               // husky 脚本生成的目录文件
    ├── commit-msg                      // commit-msg钩子，用于验证 message格式
    ├── pre-commit                      // pre-commit钩子，主要是和eslint配合
├── config                              // 全局配置文件
    ├── vite                            // vite 相关配置 代理相关
    ├── vite                            // 主题配置及全局less变量
    ├── constant.ts                     // 项目配置
├── dist                                // 默认的 build 输出目录
├── docs                                // 文档目录
├── public                              // vite项目下的静态目录
└── src                                 // 源码目录
    ├── assets                          // 公共的文件（如image、css、font等）
    ├── components                      // 项目组件
    ├── executor                        // 文件操作执行器
    ├── config                          // 通用配置文件：常量、列表等
    ├── hooks                           // 自定义 hooks
    ├── layouts                         // 全局布局
    ├── routes                          // 路由
    ├── ts                              // 前端内核ts代码
    ├── utils                           // 工具库
    ├── pages                           // 页面模块目录 UI层
        ├── Home                        // Home页面模块
        ├── ...
    ├── global.less                     // 全局样式复写
    ├── app.tsx                         // 顶层文件
    ├── index.tsx                       // 项目入口文件
    ├── typings                         // 项目type类型定义文件夹
    ├── icons                           // 项目react-icons文件夹
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

### 技术栈及代码规范

 本项目开发使用的主要技术栈为 **React 全家桶、Type Script、Less**，用来完成项目的框架、样式以及逻辑交互。配合使用 **EsLint 语法检查规则**，**Ant Design**、**Ant Design Pro** UI 组件库，**React-Query**缓存技术，以及其它的一些前端第三方包。

代码规范请前往 **project/rules** 文件夹下查看编码规则和规范。

[css规范](./docs/style-guide.md)
[敏捷规范](./docs/scrum-guid.md)
[icon规范](./docs/icon-guid.md)

### 项目依赖环境、安装和运行

奥集能是基于 **node 14+** 以上的环境运行，通过 **yarn** 或者 **npm install** 下载安装项目依赖包，并通过**npm run serve** 命令本地运行项目。

### 参与贡献

1. fork 项目
   1. 首先，找到 fork 按钮，点击以后，你的存储内就会出现一个一模一样的项目。
2. 项目开发
   1. 按照奥集能项目的编码规则，对代码进行开发。
3. 跟上主项目的步伐
   1. 在你开发的过程中，主项目的代码也可能在更新。此时就需要你同步主项目的代码，找到 **Pull request** 按钮，点击。
   2. 在左侧选择你的存储的项目，右侧为主项目，此时你能在下面看到两个项目的区别，**点击 create pull request 按钮。**
   3. 填写 title，**点击 create pull request 按钮。**
   4. 进入 pull request 页面，拉到最下面，**点击 Merge pull request 按钮并确认，**现在你和主项目的代码就是同步的了。
4. Pull request
   1. 当你觉得你的代码开发完成，可以推送时，在确保你的修改全部推送到了你的存储的项目中，然后进入你的存储的项目页面，**点击 New pull request 按钮**，
   2. 然后**点击 create pull request 按钮**进行代码提交。
5. 审核
   1. 待项目的开发者审批完成之后，就是贡献成功了。


