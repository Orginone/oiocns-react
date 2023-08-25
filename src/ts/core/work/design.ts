import { ReactNode } from 'react';
export interface SettingWidget {
  /** 按钮生成的 schema 的 key 值 */
  name: string;
  /** 在左侧栏按钮展示文案 */
  text: string;
  /** 在左侧栏按钮展示图标 */
  icon?: string | ReactNode;
  /** 如果是基本组件，这个字段注明它对应的 widgets */
  widget?: string;
  /** 组件对应的 schema 片段 */
  schema?: any;
  /** 组件的配置信息，使用 form-render 的 schema 来描述 */
  setting?: any;
}

export interface Setting {
  /** 最外层的分组名称 */
  title: string;
  /** 每个组件的配置，在左侧栏是一个按钮 */
  widgets: SettingWidget[];
  show?: boolean;
  useCommon?: boolean;
}
