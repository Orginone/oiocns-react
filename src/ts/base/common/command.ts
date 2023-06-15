import { generateUuid } from './uuid';
export type cmdType = (type: string, cmd: string, ...args: any) => any;
/** 日志 */
class Command {
  private callbacks: { [id: string]: cmdType };
  constructor() {
    this.callbacks = {};
  }

  /**
   * @desc 订阅变更
   * @param callback 变更回调
   * @returns 订阅ID
   */
  public subscribe(callback: cmdType): string {
    const id = generateUuid();
    if (callback) {
      this.callbacks[id] = callback;
    }
    return id;
  }

  /**
   * @desc 取消订阅 支持取消多个
   * @param id 订阅ID
   */
  public unsubscribe(id: string | string[]): void {
    if (typeof id == 'string') {
      delete this.callbacks[id];
    } else {
      id.forEach((id: string) => {
        delete this.callbacks[id];
      });
    }
  }
  /**
   * @desc 发送命令
   * @param type 类型,目前支持,config、data
   * @param cmd 命令
   * @param args 参数
   */
  public emitter(type: string, cmd: string, ...args: any): void {
    Object.keys(this.callbacks).forEach((key) => {
      this.callbacks[key].apply(this, [type, cmd, ...args]);
    });
  }
}

export const command = new Command();
