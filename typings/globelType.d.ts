import React from 'react';
import { RouteConfig } from 'react-router-config';
import type { Properties, PropertiesHyphen } from 'csstype';

interface DataType {
  [key: string]: any;
}

type PageShowType = 'table' | 'card'; //数据页面展示形式 表格 / 卡片

/**
 * 前端业务分页结果的数据类型
 */
export type PageData<T> = {
  success: boolean;
  total: number;
  data: T[];
  msg?: string;
};
interface IRouteConfig extends RouteConfig {
  // 路由路径
  path: string;
  // 路由组件
  component?: any;
  // 302 跳转
  redirect?: string;
  exact?: boolean;
  // 路由信息
  title: string;
  // 元数据
  meta?: any;
  // 图标
  icon?: string | React.ReactNode;
  // 是否校验权限, false 为不校验, 不存在该属性或者为true 为校验, 子路由会继承父路由的 auth 属性
  auth?: boolean;
  // 子路由
  routes?: IRouteConfig[];
}

interface MenuItemType {
  item?: any;
  key: string;
  label: string;
  menuType?: string;
  checked?: boolean;
  itemType: string;
  count?: number;
  tag?: string[];
  icon?: React.ReactNode;
  expIcon?: React.ReactNode;
  menus?: OperateMenuType[];
  children: MenuItemType[];
  parentMenu?: MenuItemType;
  beforeLoad?: () => Promise<void>;
}

interface OperateMenuType {
  key: string;
  label: string;
  model?: string;
  children?: OperateMenuType[];
  icon: React.ReactNode;
  beforeLoad?: () => Promise<boolean>;
}

type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never;

declare global {
  interface Dictionary<T> {
    [key: string]: T;
  }

  interface AnyFunction {
    (...args: any[]): any;
  }

  type AnyKey = keyof any;

  interface Constructor<T> {
    new (...args: any[]): T;
  }

  /** vue源码方案，将联合类型转成交叉类型 */
  type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I,
  ) => void
    ? I
    : never;

  /** github高星方案，将联合类型转元组 */
  type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
    ? []
    : [...UnionToTuple<Exclude<U, Last>>, Last];
}

export interface CSSProperties
  extends Properties<string | number>,
    PropertiesHyphen<string | number> {
  /**
   * The index signature was removed to enable closed typing for style
   * using CSSType. You're able to use type assertion or module augmentation
   * to add properties or an index signature of your own.
   *
   * For examples and more information, visit:
   * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
   */
  [v: `--${string}`]: string | number | undefined;
}
