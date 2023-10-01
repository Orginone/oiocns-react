import { FCOptions, defineFC } from '@/utils/react/fc';
import { FC, ReactNode, useContext } from 'react';
import { IPageContext } from '../render/PageContext';
import { HostMode } from '../core/IViewHost';
import { ElementMeta, ExtractMetaToType } from '../core/ElementMeta';
import { PageElement } from '../core/PageElement';
import { HTMLAttributes } from 'react';
import { PageContext } from '../render/PageContext';

type WithCommonProps<P extends {}> = P 
  & Pick<HTMLAttributes<any>, "className" | "style"> 
  & Pick<PageElement, "children">;

export interface ElementOptions<M extends ElementMeta, P extends {}> extends FCOptions<P> {
  /** 组件名称，必填 */
  displayName: string;
  /** 元素的描述元数据 */
  meta: M;
}

export interface ElementInit<M extends ElementMeta, P extends {}> extends ElementOptions<M, P> {
  render(this: void, props: WithCommonProps<P>, context: IPageContext<HostMode>): ReactNode;
}

export type ElementFC<M extends ElementMeta = ElementMeta, P extends {} = {}> = FC<P> & ElementOptions<M, P>;

export function defineElement<M extends ElementMeta, P extends {} = ExtractMetaToType<M>>(
  component: Readonly<ElementInit<M, P>>,
): ElementFC<M, P> {
  const originRender = component.render;
  // Hook组件定义的渲染函数，自动注入context
  (component.render as any) = (props: WithCommonProps<P>) => {
    const ctx = useContext(PageContext);
    return originRender(props, ctx);
  }
  return defineFC(component as any) as any;
}
