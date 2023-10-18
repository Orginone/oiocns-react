import { useSignal as createSignal } from '@preact/signals-react';
import { MutableRefObject, useRef, useState } from 'react';

type NonFunction<T> = T extends (...args: any[]) => any ? never : T;

export function useSignal<T>(initialValue: NonFunction<T>) {
  if (typeof initialValue === 'function') {
    initialValue = (initialValue as Function)() as NonFunction<T>;
  }
  return createSignal(initialValue);
}

/**
 * 创建一个可读写的状态，可以选择是否影响渲染
 * @param initialValue 初始值，可以是`T`或`T`类型的工厂，但`T`本身不能是函数
 * @param isRef 是否为ref（不影响渲染）
 * @returns 返回的状态
 */
export function useSimpleSignal<T>(
  initialValue: NonFunction<T> | (() => NonFunction<T>),
  isRef = false,
): MutableRefObject<T> {
  if (isRef) {
    return createRef(initialValue);
  }
  return createSimpleSignal(initialValue);
}

function createRef<T>(
  initialValue: NonFunction<T> | (() => NonFunction<T>),
): MutableRefObject<NonFunction<T>> {
  const ref = useRef<NonFunction<T>>(undefined!);
  if (ref.current === undefined) {
    ref.current = getInitialValue(initialValue);
  }
  return ref;
}

function createSimpleSignal<T>(
  initialValue: NonFunction<T> | (() => NonFunction<T>),
): MutableRefObject<NonFunction<T>> {
  let [state, setState] = useState<T>(undefined!);
  if (state === undefined) {
    state = getInitialValue(initialValue);
    setState((_) => state);
  }

  const s = {
    __value: state,
    [Symbol.for('SimpleSignal')]: true,
  };
  Object.defineProperty(s, 'current', {
    get() {
      return s.__value;
    },
    set(v) {
      // 可以立即读取到最新值
      s.__value = v;
      setState((_) => v);
    },
  });
  return s as any;
}

function getInitialValue<T>(initialValue: T | (() => T)) {
  if (typeof initialValue === 'function') {
    initialValue = (initialValue as Function)() as NonFunction<T>;
  }
  return initialValue;
}

type UnRef<T extends Dictionary<MutableRefObject<any>>> = {
  [P in keyof T]: T[P] extends MutableRefObject<infer R> ? R : T[P];
};

export function signalsToObject<T extends Dictionary<any>>(signals: T): UnRef<T> {
  const ret: any = {};
  for (const [prop, value] of Object.entries(signals)) {
    if (value && 'current' in value) {
      Object.defineProperty(ret, prop, {
        get() {
          return value.current;
        },
        set(v) {
          value.current = v;
        },
        enumerable: true,
        configurable: true,
      });
    } else {
      ret[prop] = value;
    }
  }
  return ret;
}
