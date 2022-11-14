# 文件创建规范

1. 模块及组件的文件夹 首字母必须大写
2. 模块名称下创建 components 存放子组件 子组件需用文件夹包裹
3. src/module 模块文件夹存放各业务代码，命名规则为：业务名.service.ts; service类处理好相关的业务，返回给UI层的数据是已处理好的数据

- 示例如下:

```
└── anydata  // 边缘数据
├── appstore // 应用市场
├── chat     // 即时通讯(沟通聊天)
├── org      // 组织(关系)
   ├──index.d.ts            // 组织业务类型定义
   ├──typings.d.ts          // 组织请求和响应类型定义
   ├──cohort.service.ts     // 群组业务
   ├──company.service.ts    // 单位(公司业务)
   ├──person.service.ts     // 人员相关业务
   ├──workflow.service.ts   // 工作流相关业务
```

4. 公共组件(非业务) 放入 src/components 下,文件夹 首字母必须大写
5. 公共业务组件(业务) 放入 src/bizcomponents 下,文件夹 首字母必须大写
6.

案例如下:

```
└── src                   //源码目录
├── Home                  //模块名称（首页）
  ├── components          //子组件文件夹
    ├── BannerCom         //banner 组件
      ├── index.tsx       //banner 内容
      ├── index.less      //banner 样式
    ├── SelfAppCom        //我的应用 组件
      ├── index.tsx       //我的应用 内容
      ├── index.less      //我的应用 样式
    |── ......
  ├── index.tsx           //模块容器
  ├── index.less          //模块样式
├── Chat                  //模块名称（消息）
......
```

## git commit 规范

```
<类型>[可选的作用域]: <描述>

主要 type

feat: 增加新功能
add: 增加新文件
fix: 修复 bug

特殊 type

docs: 只改动了文档相关的内容
style: 不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
build: 构造工具的或者外部依赖的改动，例如 vite, webpack, npm
refactor: 代码重构时使用
revert: 执行 git revert 打印的 message

其他 type

test: 添加测试或者修改现有测试
perf: 提高性能的改动
ci: 与 CI（持续集成服务）有关的改动
chore: 不修改 src 或者 test 的其余修改，例如构建过程或辅助工具的变动
other: 其他修改
```

## git 分支规范

- main 为主分支 验证通过的功能 提交至此分支 由 dev 分支 合并提交
- release 待验证的功能提交到此 由 dev 分支 合并提交
- dev 开发分支 只允许的开发分支合并到 dev 由个人分支 合并提交 验证后提交至 release

```
个人分支规则
personal/个人分支名称
```

## CSS 使用规范

css文件命名 名称.module.less

使用 import cls  from 'less文件地址'
