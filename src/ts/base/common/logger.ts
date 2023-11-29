/* eslint-disable no-unused-vars */
/** 日志等级 */
export enum LoggerLevel {
  info = '信息',
  msg = '消息',
  warn = '警告',
  error = '错误',
  unauth = '登录过期',
  qrauthed = '二维码登录',
}

export type MessageType = string | Error | undefined | Object;

/** 日志 */
class Logger {
  onLogger?: (level: LoggerLevel, message: string) => void;
  constructor() {}
  info(message: MessageType): void {
    this._callback(LoggerLevel.info, message);
  }
  msg(message: MessageType): void {
    this._callback(LoggerLevel.msg, message);
  }
  warn(message: MessageType): void {
    console.warn(message);
    this._callback(LoggerLevel.warn, message);
  }
  error(message: MessageType): void {
    console.error(message);
    this._callback(LoggerLevel.error, message);
  }
  unauth(): void {
    console.warn('登录已过期');
    this._callback(LoggerLevel.unauth, '登录已过期');
  }
  qrauthed(): void {
    console.info('扫码登录成功');
    this._callback(LoggerLevel.qrauthed, '扫码登录成功');
  }
  private _callback(level: LoggerLevel, message: MessageType): void {
    if (this.onLogger) {
      this.onLogger.apply(this, [level, this._format(message)]);
    }
  }
  private _format(message: MessageType): string {
    if (message instanceof Error) {
      return message.message;
    }
    if (message instanceof Object) {
      return JSON.stringify(message);
    }
    if (message) {
      return message;
    }
    return '无内容.';
  }
}

export const logger = new Logger();
