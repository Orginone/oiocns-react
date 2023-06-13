import { XForm, XIdentity, XTarget } from './schema';
// 请求类型定义
export type ReqestType = {
  // 模块
  module: string;
  // 方法
  action: string;
  // 参数
  params: any;
};

// 代理请求类型定义
export type ForwardType = {
  // 目标地址
  uri: string;
  // 请求方法
  method: string;
  // 请求头
  header: any;
  // 请求体
  content: any;
};

// 返回类型定义
export type ResultType<T> = {
  // http代码
  code: number;
  // 数据体
  data: T;
  // 消息
  msg: string;
  // 结果
  success: boolean;
};
/**
 * 服务端消息类型
 * @param {string} target 目标
 */
export type ReceiveType = {
  // 对象
  target: string;
  // 数据
  data: any;
};
// 分页返回定义
export type PageResult<T> = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: T[];
};

// 注册消息类型
export type RegisterType = {
  // 昵称
  nickName: string;
  // 姓名
  name: string;
  // 电话
  phone: string;
  // 账户
  account: string;
  // 密码
  password: string;
  // 座右铭
  motto: string;
  // 头像
  avatar: string;
};

export type IdPair = {
  // 唯一ID
  id: string;
  value: string;
};

export type PageModel = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  //过滤条件
  filter: string;
};

export type IdModel = {
  // 唯一ID
  id: string;
};

export type IdPageModel = {
  // 唯一ID
  id: string;
  // 分页
  page: PageModel;
};

export type IdArrayModel = {
  // 唯一ID数组
  ids: string[];
  // 分页
  page: PageModel;
};

export type LogModel = {
  // 唯一ID
  id: string;
  //类型
  type: string;
  //模块
  module: string;
  //内容
  content: string;
};

export type AuthorityModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 图标
  icon: string;
  // 是否公开
  public: boolean;
  // 父类别ID
  parentId: string;
  // 共享用户
  shareId: string;
  // 备注
  remark: string;
};

export type IdentityModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 职权Id
  authId: string;
  // 共享用户Id
  shareId: string;
  // 备注
  remark: string;
};

export type TargetModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 类型名
  typeName: string;
  // 开放组织?
  public: boolean;
  // 图标
  icon: string;
  // 简介
  remark: string;
  // 归属用户Id
  belongId: string;
  // 团队名称
  teamName: string;
  // 团队代号
  teamCode: string;
};

export type GiveModel = {
  // 主ID
  id: string;
  // 子ID数组
  subIds: string[];
};

export type GainModel = {
  // 主ID
  id: string;
  // 子ID
  subId: string;
};

export type ApprovalModel = {
  // 唯一ID
  id: string;
  // 状态
  status: number;
};

export type SearchModel = {
  // 名称
  name: string;
  // 类型数组
  typeNames: string[];
  // 分页
  page: PageModel;
};

export type GetSubsModel = {
  // 唯一ID
  id: string;
  // 子节点类型
  subTypeNames: string[];
  // 分页
  page: PageModel;
};

export type GetJoinedModel = {
  // 唯一ID
  id: string;
  // 类型数组
  typeNames: string[];
  // 分页
  page: PageModel;
};

export type MsgSendModel = {
  // 接收方Id
  toId: string;
  // 归属用户ID
  belongId: string;
  // 消息类型
  msgType: string;
  // 消息体
  msgBody: string;
};

export type IdentityMsgModel = {
  // 接受数据
  data: string;
  // 是否剔除操作人
  excludeOperater: boolean;
  // 岗位Id
  stationId: string;
  // 身份Id
  identityId: string;
  // 组织集群
  group: boolean;
};

export type TargetMsgModel = {
  // 接受数据
  data: string;
  // 是否剔除操作人
  excludeOperater: boolean;
  // 用户Id
  targetId: string;
  // 组织集群
  group: boolean;
};

export type TargetOperateModel = {
  operate: string;
  target: XTarget;
  subTarget?: XTarget;
  operater: XTarget;
};

export type IdentityOperateModel = {
  operate: string;
  operater: XTarget;
  identity: XIdentity;
  station?: XTarget;
  subTarget?: XTarget;
};

export type MsgTagModel = {
  // 会话ID
  id: string;
  // 会话归属用户ID
  belongId: string;
  // 消息ID
  ids: string[];
  // 标记
  tags: string[];
};

export type MsgSaveModel = {
  // 唯一ID
  id: string;
  // 会话ID
  sessionId: string;
  // 归属用户ID
  belongId: string;
  // 发起方Id
  fromId: string;
  // 接收方Id
  toId: string;
  // 消息类型
  msgType: string;
  // 消息体
  msgBody: string;
  // 消息创建时间
  createTime: string;
  // 消息变更时间
  updateTime: string;
  // 消息标签
  tags?: MsgTagLabel[];
};

export type MsgTagLabel = {
  // 标签名称
  label: string;
  // 人员Id
  userId: string;
  // 时间
  time: string;
};

export type PropertyModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 值类型
  valueType: string;
  // 计量单位
  unit: string;
  // 类别ID
  speciesId: string;
  // 字典的类型ID
  dictId: string;
  // 来源用户ID
  sourceId: string;
  // 备注
  remark: string;
  // 附加信息
  info: string;
};

export type DictModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 图标
  icon: string;
  // 备注
  remark: string;
  // 分类ID
  speciesId: string;
};

export type DictItemModel = {
  // 唯一ID
  id: string;
  // 键
  name: string;
  // 值
  value: string;
  // 图标
  icon: string;
  // 字典的类型ID
  dictId: string;
  // 备注
  remark: string;
};

export type SpeciesModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 图标
  icon: string;
  // 类型
  typeName: string;
  // 父类别Id
  parentId: string;
  // 共享用户Id
  shareId: string;
  // 工作职权Id
  authId: string;
  // 备注
  remark: string;
};

export type AttributeModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 规则
  rule: string;
  // 值类型
  valueType: string;
  // 属性Id
  propId: string;
  // 工作职权Id
  authId: string;
  // 表单项Id
  formId: string;
  // 字典项Id
  dictId: string;
  // 备注
  remark: string;
};

export type FormModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 图标
  icon: string;
  // 规则
  rule: string;
  // 类型
  typeName: string;
  // 备注
  remark: string;
  // 类别Id
  speciesId: string;
  // 共享用户Id
  shareId: string;
};

export type ThingModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 链上ID
  chainId: string;
  // 共享用户Id
  shareId: string;
  // 备注
  remark: string;
};

export type SetPropModel = {
  // 物的唯一ID
  id: string;
  // 特性数据
  data: IdPair[] | undefined;
};

export type GetSpeciesModel = {
  // 唯一ID
  id: string;
  // 是否向上递归用户
  upTeam: boolean;
  // 当前归属用户ID
  belongId: string;
  // 过滤信息
  filter: string;
};

export type GetSpeciesResourceModel = {
  // 唯一ID
  id: string;
  // 分类唯一ID
  speciesId: string;
  // 当前归属用户ID
  belongId: string;
  // 是否向上递归用户
  upTeam: boolean;
  // 分页
  page: PageModel;
};

export type OrderModel = {
  // 唯一ID
  id: string;
  // 存证ID
  nftId: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 价格
  price: number;
  // 归属用户ID
  belongId: string;
  // 市场ID
  marketId: string;
  // 订单内容
  content: string;
};

export type OrderPayModel = {
  // 唯一ID
  id: string;
  // 支付总价
  price: number;
  // 支付方式
  paymentType: string;
  // 备注
  remark: string;
};

export type WorkDefineModel = {
  // 流程Id
  id: string;
  // 流程名称
  name: string;
  // 流程编号
  code: string;
  // 图标
  icon: string;
  // 规则
  rule: string;
  // 流程节点
  resource: WorkNodeModel | undefined;
  // 备注
  remark: string;
  // 共享组织Id
  shareId: string;
  // 归属分类Id
  speciesId: string;
};

export type WorkInstanceModel = {
  // 流程定义Id
  defineId: string;
  // 展示内容
  content: string;
  // 内容类型
  contentType: string;
  // 单数据内容
  data: string;
  // 标题
  title: string;
  // 回调地址
  hook: string;
  // 申请组织Id
  applyId: string;
};
export type QueryWorkReq = {
  // 共享组织Id
  shareId: string;
  // 办事定义Id
  defineId: string;
  // 分页
  page: PageModel;
};

export type WorkNodeModel = {
  id: string;
  // 节点编号
  code: string;
  // 节点类型
  type: string;
  // 节点名称
  name: string;
  // 子节点
  children: WorkNodeModel | undefined;
  // 节点分支
  branches: Branche[] | undefined;
  // 节点审批数量
  num: number;
  // 节点审批目标类型
  destType: string;
  // 节点审批目标Id
  destId: string;
  // 节点目标名称
  destName: string;
  // 节点归属定义Id
  defineId: string;
  // 绑定的单信息
  forms: XForm[] | undefined;
};

export type Branche = {
  conditions: Condition[] | undefined;
  children: WorkNodeModel | undefined;
};

export type Condition = {
  key: string;
  paramKey: string;
  val: string;
  type: string;
  display: string;
};

export type QueryTaskReq = {
  // 流程定义Id
  defineId: string;
  // 任务类型 审批、抄送
  typeName: string;
};

export type ApprovalTaskReq = {
  // 流程定义Id
  id: string;
  // 状态
  status: number;
  // 评论
  comment: string;
  // 数据
  data: string;
};

/**
 * 文件系统项分享数据
 */
export type ShareIcon = {
  /** 名称 */
  name: string;
  /** 类型 */
  typeName: string;
  /** 头像 */
  avatar?: FileItemShare;
};
/**
 * 文件系统项分享数据
 */
export type FileItemShare = {
  /** 完整路径 */
  size: number;
  /** 名称 */
  name: string;
  /** 共享链接 */
  shareLink?: string;
  /** 拓展名 */
  extension?: string;
  /** 缩略图 */
  thumbnail?: string;
};
/**
 * 文件系统项数据模型
 */
export type FileItemModel = {
  /** 完整路径 */
  key: string;
  /** 创建时间 */
  dateCreated: Date;
  /** 修改时间 */
  dateModified: Date;
  /** 文件类型 */
  contentType?: string;
  /** 是否是目录 */
  isDirectory: boolean;
  /** 是否包含子目录 */
  hasSubDirectories: boolean;
} & FileItemShare;

/** 桶支持的操作 */
export enum BucketOpreates {
  'List' = 'List',
  'Create' = 'Create',
  'Rename' = 'Rename',
  'Move' = 'Move',
  'Copy' = 'Copy',
  'Delete' = 'Delete',
  'Upload' = 'Upload',
  'AbortUpload' = 'AbortUpload',
}

/** 桶操作携带的数据模型 */
export type BucketOpreateModel = {
  /** 完整路径 */
  key: string;
  /** 名称 */
  name?: string;
  /** 目标 */
  destination?: string;
  /** 操作 */
  operate: BucketOpreates;
  /** 携带的分片数据 */
  fileItem?: FileChunkData;
};

/** 上传文件携带的数据 */
export type FileChunkData = {
  /** 分片索引 */
  index: number;
  /** 文件大小 */
  size: number;
  /** 上传的唯一ID */
  uploadId: string;
  /** 分片数据 */
  data: number[];
  /** 分片数据编码字符串 */
  dataUrl: string;
};

/** 请求失败 */
export const badRequest = (
  msg: string = '请求失败',
  code: number = 400,
): ResultType<any> => {
  return { success: false, msg: msg, code: code, data: false };
};
