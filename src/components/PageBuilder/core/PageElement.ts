import type { CSSProperties } from "@/components/PageBuilder/core/dom";

export type NoFunctionPropertyObject<T extends {}> = {
  [P in keyof T & string]: T[P] extends AnyFunction ? never : T[P];
};

export interface PageElement<K extends string = string, P extends {} = Dictionary<any>, D = any> {
  id: string;
  kind: K;
  name: string;
  data?: D;
  children: PageElement[];


  /** CSS类名 */
  className?: string | string[];
  /** 可以使用camelCase或者kebab-case的对象形式代表CSS样式 */
  style?: string | CSSProperties;
  /** 属性 */
  props: NoFunctionPropertyObject<P>;
}



declare module "@/ts/base/model" {
  interface IPageTemplate<T extends string> {

    rootElement: PageElement;
  }
}