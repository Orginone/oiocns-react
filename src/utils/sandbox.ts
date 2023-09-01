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
