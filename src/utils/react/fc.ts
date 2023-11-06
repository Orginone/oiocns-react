import _, { omit } from 'lodash';
import { Dispatch, FC, ReactNode, SetStateAction } from 'react';

export type FCOptions<P extends {}> = Pick<
  FC<P>,
  'contextTypes' | 'defaultProps' | 'displayName' | 'propTypes'
>;

export interface FCInit<P extends {}, C = any> extends FCOptions<P> {
  render: (this: never, props: P, context?: C) => ReactNode;
}

/**
 * 定义一个{@link FC} ，并启用TypeScript自动泛型推导
 * @param component 组件的定义，其中渲染函数作为`render`属性提供
 * @returns FunctionComponent
 */
export function defineFC<P extends {}, C = any>(
  component: Readonly<FCInit<P, C>>,
): FC<P> {
  const render: any = component.render;
  const options = omit(component, ['render']);
  for (const p of Object.keys(options) as (keyof typeof options)[]) {
    render[p] = options[p];
  }
  return render;
}

type ModelEvent<E extends string, V> = {
  [K in E as `on${Capitalize<K>}`]: (value: V) => void;
};
type ModelProp<P extends string, V> = {
  [K in P]: V;
};

export function withModel<P extends string, E extends string, S>(
  state: [S, Dispatch<SetStateAction<S>>],
  prop: P,
  event: E,
): ModelProp<P, S> & ModelEvent<E, S> {
  return {
    [prop]: state[0],
    [`on${_.capitalize(event)}`]: (v: S) => state[1]((_) => v),
  } as any;
}
