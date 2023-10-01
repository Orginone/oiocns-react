
import { useState, useRef, MutableRefObject, useMemo } from "react";
import { useSignal as createSignal, useComputed } from "@preact/signals-react";

type NonFunction<T> = T extends (...args: any[]) => any ? never : T;


export function useSignal<T>(initialValue: NonFunction<T>) {
  if (typeof initialValue === "function") {
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
export function useSimpleSignal<T>(initialValue: NonFunction<T> | (() => NonFunction<T>), isRef = false): MutableRefObject<T> {
  if (isRef) {
    const ref = useRef<NonFunction<T>>(null!);
    if (ref.current == null) {
      if (typeof initialValue === "function") {
        initialValue = (initialValue as Function)() as NonFunction<T>;
      }    
      ref.current = initialValue;  
    }

    return ref;
  }
  const v = createSimpleSignal(initialValue);
  // 永不重新计算
  return useMemo(() => v as any, []);
}


function createSimpleSignal<T>(initialValue: T | (() => T)) {
  let [state, setState] = useState(initialValue);
  const s = {
    __value: state,
  } ;
  Object.defineProperty(s, "current", {
    get() {
      return s.__value;
    },
    set(v) {
      // 可以立即读取到最新值
      s.__value = v;
      setState(_ => v);
    }
  });
  return s;
}
