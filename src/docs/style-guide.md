# 奥集能css规范


## 全局样式变量


采用antd提供的全局样式变量。优先采用全局提供变量。如：

```ts
// config/theme/variables.less

// 下面是复写less变量，如果需要复写，可以通过以下入口挑选具体变量复写即可
@import 'antd/es/style/default';

// 修改前缀
@ant-prefix: 'ogo';
// 自定义覆盖 style

@primary-color: #154ad8;
@error-color: #f76c6f;
@border-radius-base: 4px;
@arrow-border-radius: 4px;
@component-background: #fafafa;
@layout-body-background: #eff4f9;

@layout-footer-background: @component-background;
@layout-sider-background: @component-background;
@layout-header-background: @component-background;
@layout-trigger-color-light: @component-background;

@header-height: 50px;
@padding-xs: 8px;
@margin-xs: 8px;
@margin-xxs: 4px;
@padding-xxs: 4px;

// 白色字体颜色
@white-color: #fff;
// 表格全局样式
@table-header-background: #f5f6fc;
@table-header-bg: #f5f6fc;
@descriptions-bg: #f5f6fc;

// 左侧菜单
@system-menu-active-background: #f9fbfe; //系统默认分类选中时背景颜色
@system-menu-color: #a6aec7; //系统默认分类字体颜色
@custom-menu-active-background: #e6f1ff; // 自定义分类选中时背景颜色
@tree-directory-selected-color: rgba(0, 0, 0, 0.85);
@tree-directory-selected-bg: #e6f1ff;

// form
@label-color: rgba(0, 0, 0, 0.45);
@input-bg: #f2f4f9;
@select-background: #f2f4f9;
@item-hover-bg: #f2f4f9;
@input-placeholder-color: #909399;

@border-color-base: #ebeef5; // 边框颜色
@border-color-split: #ebeef5;
@item-card-radius: 10px; // 小卡片圆角

```

由于，某些组件我们未定制样式，如果需要修改ant原有样式，请先从Ant提供的[全局变量](https://github.com/ant-design/ant-design/blob/4.x-stable/components/style/themes/default.less)挑选并放入`variables.less`中。
**注意补充注释，表明哪个组件？**


例如：
```less
// form
@label-color: rgba(0, 0, 0, 0.45);
@input-bg: #f2f4f9;
@select-background: #f2f4f9;
@item-hover-bg: #f2f4f9;
@input-placeholder-color: #909399;

@border-color-base: #ebeef5; // 边框颜色
@border-color-split: #ebeef5;
@item-card-radius: 10px; // 小卡片圆角
```

## 样式

样式统一写入global.less文件中，备注对应的组件, 且把组件内的所有样式

```less

/**
  WorkBench
*/
.workbench {
    width: 100%;
    &-main {
        display: flex;
    }
}

```

## css命名

css类名使用bem规则

```less

.main {
    // 这里最终解析出 `navigation-item`
    &-item {
      &__active {
        // 激活状态 `即 main-item__active`
      }   
    }
}
```

id采用驼峰式命名

```less 

/* id */
#myDialog {
    ...
}

```
less中的变量、函数、混合、placeholder采用中划线分割

```less 

/* 变量 */
@primary-color: #154ad8;

```
