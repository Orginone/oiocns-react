import { ComponentType, FC, createElement as h } from "react";
import { HostMode } from "../core/IViewHost";
import { PageElement } from "../core/PageElement";
import _ from "lodash";
import React from "react";
import { Result } from "antd";

export type Render = FC<ElementRenderProps>;


export interface ElementRenderProps {
  readonly element: PageElement;
}


/**
 * 将元素的配置处理为react的属性对象
 * @param e 要处理的元素
 * @returns ReactNode所需的属性对象
 */
export function mergeProps(e: PageElement) {
  const props = { ... e.props };
  
  let className = e.className;
  if (Array.isArray(className)) {
    className = className.join(" ");
  }
  props.className = className;

  let style = Object.fromEntries(
    Object
      .entries(e.style || {})
      .map(p => {
        p[0] = _.camelCase(p[0]);
        return p;
      })
  );
  props.style = style;

  props.children = e.children;

  return props;
}


export function createRender(component: ComponentType, mode: HostMode): Render {
  if (mode == "view") {
    return createViewRender(component);
  } else {
    return createDesignRender(component);
  }
}

function createViewRender(component: ComponentType) {
  return (props: ElementRenderProps) => {
    return h(component, mergeProps(props.element));
  };
}

function createDesignRender(component: ComponentType) {
  return (props: ElementRenderProps) => {
    return h(component, mergeProps(props.element));
  };
}

export function createNullRender(name: string) {
  const staticRenderResult = (
    <div>
      <Result status="error" title={`元素 ${name} 未注册组件`} />
    </div>
  );
  return () => staticRenderResult;
}