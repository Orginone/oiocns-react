import { FCOptions, defineFC } from '@/utils/react/fc';
import { FC, HTMLAttributes, ReactNode, useContext } from 'react';
import { ElementMeta, ExtractMetaToType } from '../core/ElementMeta';
import { PageElement } from '../core/PageElement';
import { Context, PageContext } from '../render/PageContext';

type WithCommonProps<P extends {}> = P &
  Pick<HTMLAttributes<any>, 'className' | 'style'> &
  Pick<PageElement, 'children' | 'id'>;

export interface ElementOptions<M extends ElementMeta, P extends {}>
  extends FCOptions<P> {
  /** 组件名称，必填 */
  displayName: string;
  /** 元素的描述元数据 */
  meta: M;
}

export interface ElementInit<M extends ElementMeta, P extends {}>
  extends ElementOptions<M, P> {
  render(this: void, props: WithCommonProps<P>, context: Context): ReactNode;
}

export type ElementFC<M extends ElementMeta = ElementMeta, P extends {} = {}> = FC<P> &
  ElementOptions<M, P>;

export function defineElement<M extends ElementMeta, P extends {} = ExtractMetaToType<M>>(
  component: Readonly<ElementInit<M, P>>,
): ElementFC<M, P> {
  const originRender = component.render;
  // Hook组件定义的渲染函数，自动注入context
  (component.render as any) = (props: WithCommonProps<P>) => {
    const ctx = useContext(PageContext);
    return originRender(props, ctx);
  };
  return defineFC(component as any) as any;
}
