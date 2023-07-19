// git commit 规范
// <类型>[可选的作用域]: <描述>

// # 主要type
// feat:     增加新功能
// add:     增加新文件
// fix:      修复bug

// # 特殊type
// docs:     只改动了文档相关的内容
// style:    不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
// build:    构造工具的或者外部依赖的改动，例如webpack，npm
// refactor: 代码重构时使用
// revert:   执行git revert打印的message

// # 暂不使用type
// test:     添加测试或者修改现有测试
// perf:     提高性能的改动
// ci:       与CI（持续集成服务）有关的改动
// chore:    不修改src或者test的其余修改，例如构建过程或辅助工具的变动
// other:    其他

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'add', // 新增功能
        'fix', // 修复 bug
        'hotfix', //紧急更新
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build', // 打包
        'delete', //删除
        'workflow',
        'types',
        'release',
      ],
    ],
  },
};
