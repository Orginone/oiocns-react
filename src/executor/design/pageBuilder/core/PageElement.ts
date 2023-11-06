/* eslint-disable no-unused-vars */
import { CSSProperties } from 'typings/globelType';

export type NoFunctionPropertyObject<T extends {}> = {
  [P in keyof T & string]: T[P] extends AnyFunction ? never : T[P];
};

export interface PageElement<
  K extends string = string,
  P extends {} = Dictionary<any>,
  D = any,
> {
  id: string;
  kind: K;
  name: string;
  data?: D;
  /** 子元素（默认插槽） */
  children: PageElement[];

  /** CSS类名 */
  className?: string | string[];
  /** 可以使用camelCase或者kebab-case的对象形式代表CSS样式 */
  style?: string | CSSProperties;
  /** 属性 */
  props: NoFunctionPropertyObject<P>;
  /** 插槽 */
  slots?: Dictionary<PageElement | PageElement[]>;
}

declare module '@/ts/base/schema' {
  interface XPageTemplate {
    rootElement: PageElement;
  }
}
