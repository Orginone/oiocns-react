import { generateUuid } from '@/ts/base/common';
import { Result } from 'antd';
import _ from 'lodash';
import React, {
  FC,
  MouseEvent,
  createElement as h,
  useCallback,
  useContext,
  useState,
} from 'react';
import { HostMode } from '../core/IViewHost';
import { PageElement } from '../core/PageElement';
import { ElementFC } from '../elements/defineElement';
import ErrorBoundary from './ErrorBoundary';
import { DesignContext, PageContext } from './PageContext';
import { Slot } from './Slot';

export type Render = FC<ElementRenderProps>;

export interface ElementRenderProps {
  readonly element: PageElement;
  readonly data?: any;
  readonly slotParams?: Dictionary<any>;
}

export function createSlotRender(slot: PageElement | PageElement[]) {
  if (Array.isArray(slot)) {
    return (params: Dictionary<any> = {}) => {
      return slot.map((s) => <Slot key={s.id} child={s} params={params} />);
    };
  }
  const render = (params: Dictionary<any> = {}) => {
    return <Slot child={slot} params={params} />;
  };
  return render;
}

/**
 * 将元素的配置处理为react的属性对象
 * @param e 要处理的元素
 * @returns ReactNode所需的属性对象
 */
export function mergeProps(e: PageElement, slotParams: Dictionary<any> = {}, data?: any) {
  const props = {
    ...e.props,
    ...slotParams,
  };

  let className = e.className;
  if (Array.isArray(className)) {
    className = className.join(' ');
  }
  props.className = className;

  let style = Object.fromEntries(
    Object.entries(e.style || {}).map((p) => {
      p[0] = _.camelCase(p[0]);
      return p;
    }),
  );
  props.style = style;
  props.id = e.id;
  props.children = e.children;

  if (e.slots) {
    for (const [name, slot] of Object.entries(e.slots)) {
      props[name] = createSlotRender(slot);
    }
  }

  props.data = data;
  return props;
}

export function createRender(component: ElementFC, mode: HostMode): Render {
  if (mode == 'view') {
    return createViewRender(component);
  } else {
    return createDesignRender(component);
  }
}

function createViewRender(component: ElementFC) {
  return (props: ElementRenderProps) => {
    return h(component, mergeProps(props.element, props.slotParams, props.data));
  };
}

function createDesignRender(component: ElementFC) {
  const render = (props: ElementRenderProps) => {
    const ctx = useContext(PageContext) as DesignContext;
    const [key, setKey] = useState(generateUuid());
    const handleClick = useCallback((e: MouseEvent) => {
      e.stopPropagation();
      ctx.view.currentElement = props.element;
    }, []);
    ctx.view.subscribeElement(props.element.id, () => setKey(generateUuid()));
    return (
      <ErrorBoundary>
        <div
          key={key}
          className={[
            'element-wrapper',
            ctx.view.currentElement?.id == props.element.id ? 'is-current' : '',
          ].join(' ')}
          onClick={handleClick}>
          {h(component, mergeProps(props.element, props.slotParams))}
        </div>
      </ErrorBoundary>
    );
  };
  return render;
}

export function createNullRender(name: string) {
  const staticRenderResult = () => (
    <div>
      <Result status="error" title={`元素 '${name}' 未注册组件`} />
    </div>
  );
  return staticRenderResult;
}
