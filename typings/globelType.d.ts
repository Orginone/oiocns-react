import { RouteConfig } from 'react-router-config';

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
