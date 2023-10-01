
declare  global {
  
  interface Dictionary<T> {
    [key: string]: T;
  }

  interface AnyFunction {
    (...args: any[]): any;
  }

  type AnyKey = keyof any;
  
  interface Constructor<T> {
    new(...args: any[]): T;
  }
}

export {}