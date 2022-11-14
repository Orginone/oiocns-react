// 请求类型定义
export type ReqestType = {
  // 模块
  module: string;
  // 方法
  action: string;
  // 参数
  params: any;
};

// 返回类型定义
export type ResultType = {
  code: number;
  data: any;
  msg: string;
  success: boolean;
};

// 服务端消息类型
export type ReceiveType = {
  // 目标
  target: string;
  // 数据
  data: any;
};

// 注册消息类型
export type RegisterType = {
  nickName: string;
  name: string;
  phone: string;
  account: string;
  password: string;
  motto: string;
  avatar: string;
};
