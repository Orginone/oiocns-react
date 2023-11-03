export { CharCode } from './charCode';
export { Emitter } from './emitter';
export { decrypt, encrypt } from './encryption';
export {
  blobToDataUrl,
  blobToNumberArray,
  encodeKey,
  formatDate,
  formatSize,
  sliceFile,
  StringPako,
} from './format';
export type { IDisposable } from './lifecycle';
export { sleep } from './lifecycle';
export { logger, LoggerLevel } from './logger';
export {
  cloneAndChange,
  createProxyObject,
  deepClone,
  deepFreeze,
  distinct,
  equals,
  filter,
  getAllMethodNames,
  getAllPropertyNames,
  getCaseInsensitive,
  mixin,
  safeStringify,
} from './objects';
export {
  isBoolean,
  isDefined,
  isEmptyObject,
  isFunction,
  isIterable,
  isNumber,
  isObject,
  isString,
  isStringArray,
  isTypedArray,
  isUndefined,
  isUndefinedOrNull,
} from './types';
export { Constants, toUint8, toUint32 } from './uint';
export { generateUuid, isUUID } from './uuid';
export function Sandbox(code: string) {
  code = 'with (sandbox) {' + code + '}';
  const fn = new Function('sandbox', code);
  const unscopables = {};
  return function (sandbox: any) {
    const sandboxProxy = new Proxy(sandbox, {
      get(target, key) {
        if (key === Symbol.unscopables) return unscopables;
        return target[key];
      },
    });
    return fn(sandboxProxy);
  };
}
