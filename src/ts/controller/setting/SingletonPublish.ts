export default class SingletonPublish {
  
  private listenList = {};

  constructor() {
    this.listenList = {};
  }

  // 订阅者添加订阅事件
  addListen(key: string, fn: (params: {id:string}) => void) {
    if (!this.listenList[key]) {
      this.listenList[key] = [];
    }
    this.listenList[key].push(fn);
  }

  // 发布者发布消息，执行订阅者订阅事件
  trigger(otKey: string, params?: {}) {
    const key = otKey || Array.from(arguments).shift();
    const fns = this.listenList[otKey||key];
    if (!fns || fns.length === 0) {
      return false;
    }
    fns.forEach((fn: any) => {
      // fn.apply(this, arguments);
      fn(params);
    });
  }
  // 移除订阅事件
  remove(key:string, fn:()=>void) {
    const fns = this.listenList[key];
    if (!fns || fns.length === 0) return;

    if (!fn) {
      this.listenList[key] = [];
    } else {
      for (let l = fns.length - 1; l >= 0; l--) {
        if (fn === fns[l]) {
          fns.splice(l, 1);
        }
      }
    }
  }
}
