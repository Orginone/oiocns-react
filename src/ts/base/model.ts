import {
  XApplication,
  XAttributeProps,
  XAuthority,
  Xbase,
  XDirectory,
  XForm,
  XIdentity,
  XProperty,
  XSpecies,
  XStandard,
  XTarget,
  XThing,
} from './schema';
// 请求类型定义
export type ReqestType = {
  // 模块
  module: string;
  // 方法
  action: string;
  // 参数
  params: any;
};
// 请求数据核类型定义
export type DataProxyType = {
  // 标签
  flag: string;
  // 模块
  module: string;
  // 方法
  action: string;
  // 归属
  belongId: string;
  // 抄送
  copyId?: string;
  // 参数
  params: any;
  // 关系举证(用户鉴权[user=>relations=>target],最大支持2级关系)
  relations: string[];
};
// 请求数据核类型定义
export type DataNotityType = {
  // 数据
  data: any;
  // 通知的用户
  targetId: string;
  // 被操作方Id
  subTargetId?: string;
  // 是否忽略自己
  ignoreSelf: boolean;
  // 忽略的连接ID
  ignoreConnectionId?: string;
  // 标签
  flag: string;
  // 关系举证(用户鉴权[user=>relations=>target],最大支持2级关系)
  relations: string[];
  // 归属用户
  belongId: string;
  // 通知用户自身
  onlyTarget: boolean;
  // 仅通知在线用户
  onlineOnly: boolean;
};
// 代理请求类型定义
export type HttpRequestType = {
  // 目标地址
  uri: string;
  // 请求方法
  method: string;
  // 请求头
  header: {
    [key: string]: string;
  };
  // 请求体
  content: string;
};
// Http请求响应类型定义
export type HttpResponseType = {
  // 状态码
  status: number;
  // 响应类型
  contentType: string;
  // 响应头
  header: {
    [key: string]: string[];
  };
  // 响应体
  content: string;
};
// 返回类型定义
export type LoadResult<T> = {
  // 数据体
  data: T;
  // 分组数量
  groupCount: number;
  // 聚合运算结果
  summary: any[];
  // 总数
  totalCount: number;
  // 消息
  msg: string;
  // 结果
  success: boolean;
  // http代码
  code: number;
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
  // 用户
  userId: string;
  // 对象
  target: string;
  // 数据
  data: any;
};
/** 在线信息 */
export type OnlineInfo = {
  // 用户Id
  userId: string;
  // 连接Id
  connectionId: string;
  // 远端地址
  remoteAddr: string;
  // 上线时间
  onlineTime: string;
  // 认证时间
  authTime: string;
  // 请求次数
  requestCount: number;
  // 终端类型
  endPointType: string;
};
/** 在线信息查询接口 */
export type OnlineSet = {
  // 用户连接
  users: OnlineInfo[];
  // 存储连接
  storages: OnlineInfo[];
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
  page: PageModel | undefined;
};

export type IdArrayModel = {
  // 唯一ID数组
  ids: string[];
  // 分页
  page: PageModel | undefined;
};

export type EntityModel = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 图标
  icon: string;
  // 归属用户ID
  belongId: string;
  // 类型
  typeName: string;
  // 状态
  status: number;
  // 创建人员ID
  createUser: string;
  // 更新人员ID
  updateUser: string;
  // 修改次数
  version: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
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
  page: PageModel | undefined;
};

export type GetSubsModel = {
  // 唯一ID
  id: string;
  // 子节点类型
  subTypeNames: string[];
  // 分页
  page: PageModel | undefined;
};

export type GetJoinedModel = {
  // 唯一ID
  id: string;
  // 类型数组
  typeNames: string[];
  // 分页
  page: PageModel | undefined;
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

export type ChatMessageType = {
  // 发起方Id
  fromId: string;
  // 接收方Id
  toId: string;
  // 类型
  typeName: string;
  // 内容
  content: string;
  // 评注
  comments: CommentType[];
} & Xbase;

export type CommentType = {
  // 标签名称
  label: string;
  // 人员Id
  userId: string;
  // 时间
  time: string;

  // 回复某个人
  replyTo?: string;
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
  // 附加信息
  info: string;
  // 目录ID
  directoryId: string;
  // 分类标签ID
  speciesId: string;
  // 来源用户ID
  sourceId: string;
  // 备注
  remark: string;
};

export type DirectoryModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 图标
  icon: string;
  // 父目录ID
  parentId: string;
  // 共享用户ID
  shareId: string;
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
  // 类型
  typeName: string;
  // 图标
  icon: string;
  // 备注
  remark: string;
  // 来源用户ID
  sourceId: string;
  // 目录ID
  directoryId: string;
};

export type SpeciesItemModel = {
  // 唯一ID
  id: string;
  // 键
  name: string;
  // 编号
  code: string;
  // 图标
  icon: string;
  // 附加信息
  info: string;
  // 类型ID
  speciesId: string;
  // 父类目ID
  parentId: string;
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
  // 编号
  rule: string;
  // 备注
  remark: string;
  // 属性Id
  propId: string;
  // 工作职权Id
  authId: string;
  // 单项Id
  formId: string;
};

export type FormModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 规则
  rule: string;
  // 图标
  icon: string;
  // 类型
  typeName: string;
  // 备注
  remark: string;
  // 目录ID
  directoryId: string;
};

export type ApplicationModel = {
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
  // 备注
  remark: string;
  // 目录ID
  directoryId: string;
  // 父级ID
  parentId: string;
  // 资源
  resource: string;
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

export type GetDirectoryModel = {
  // 唯一ID
  id: string;
  // 是否向上递归用户
  upTeam: boolean;
  // 分页
  page: PageModel | undefined;
};

export type WorkDefineModel = {
  // 流程ID
  id: string;
  // 流程名称
  name: string;
  // 流程编号
  code: string;
  // 图标
  icon: string;
  // 备注
  remark: string;
  // 共享组织ID
  shareId: string;
  // 应用ID
  applicationId: string;
  // 是否创建实体
  rule: string;
  // 流程节点
  resource: WorkNodeModel | undefined;
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
  // 对应父流程实例节点任务Id
  taskId: string;
  // 发起用户ID
  applyId: string;
};

export type InstanceDataModel = {
  /** 流程节点 */
  node: WorkNodeModel;
  // 允许新增
  allowAdd: boolean;
  // 允许变更
  allowEdit: boolean;
  // 允许选择
  allowSelect: boolean;
  /** 表单字段 */
  fields: {
    /** 表单id */
    [id: string]: FieldModel[];
  };
  /** 提交的表单数据 */
  data: {
    // 表单id
    [id: string]: FormEditData[];
  };
  /** 填写的主表信息 */
  primary: {
    /** 特性id */
    [id: string]: any;
  };
};

export type FieldModel = {
  /** 标识(特性标识) */
  id: string;
  /** 名称(特性名称) */
  name: string;
  /** 代码(属性代码) */
  code: string;
  /** 类型(属性类型) */
  valueType: string;
  /** 规则(特性规则) */
  rule?: string;
  /** 组件 */
  widget?: string;
  /** 参数 */
  options?: XAttributeProps;
  /** 备注(特性描述) */
  remark: string;
  /** 字典(字典项/分类项) */
  lookups?: FiledLookup[];
  /** 计量单位 */
  unit?: string;
};

export type FiledLookup = {
  /** 唯一标识(项标识) */
  id: string;
  /** 描述(项名称) */
  text: string;
  /** 值(项代码) */
  value: string;
  /** 父级Id(项的父级Id) */
  parentId?: string;
  /** 图标 */
  icon?: string;
};

export type FormEditData = {
  /** 操作前数据体 */
  before: XThing[];
  /** 操作后数据体 */
  after: XThing[];
  /** 流程节点Id */
  nodeId: string;
  /** 表单名称 */
  formName: string;
  /** 操作人 */
  creator: string;
  /** 操作时间 */
  createTime: string;
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
  // 节点归属组织
  belongId: string;
  // 节点归属定义Id
  defineId: string;
  // 关联表单信息
  forms: FormInfo[];
  // 主表
  primaryForms: XForm[];
  // 子表
  detailForms: XForm[];
};

type FormInfo = {
  // 表单Id
  id: string;
  // 类型
  typeName: string;
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
  // 任务Id
  id: string;
  // 状态
  status: number;
  // 评论
  comment: string;
  // 数据
  data: string;
};

export type TargetMessageModel = {
  // 内容
  data: string;
  // 是否剔除当前操作人
  excludeOperater: boolean;
  // 目标用户Id集合
  targetId: string;
  // 组织集群
  group: boolean;
};

export type IdentityMessageModel = {
  // 内容
  data: string;
  // 是否剔除当前操作人
  excludeOperater: boolean;
  // 身份Id
  identityId: string;
  // 岗位Id
  stationId: string;
  // 组织集群
  group: boolean;
};

export type TargetOperateModel = {
  // 操作方式
  operate: string;
  // 操作对象
  target: XTarget;
  // 被操作对象
  subTarget?: XTarget;
  // 操作人
  operater: XTarget;
};

export type IdentityOperateModel = {
  // 操作方式
  operate: string;
  // 操作人
  operater: XTarget;
  // 操作的身份
  identity: XIdentity;
  // 操作的组织对象
  subTarget?: XTarget;
};

export type AuthorityOperateModel = {
  // 操作方式
  operate: string;
  // 操作人
  operater: XTarget;
  // 操作的职权
  authority: XAuthority;
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
  /** 视频封面 */
  poster?: string;
  /** 文件类型 */
  contentType?: string;
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
  dateCreated: string;
  /** 修改时间 */
  dateModified: string;
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
  'HslSplit' = 'HslSplit',
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

/** 任务模型 */
export type TaskModel = {
  name: string;
  size: number;
  finished: number;
  createTime: Date;
};

/** 操作命令模型 */
export type OperateModel = {
  cmd: string;
  sort: number;
  label: string;
  iconType: string;
  model?: string;
  menus?: OperateModel[];
};

/** 会话元数据 */
export type MsgChatData = {
  /** 消息类会话完整Id */
  fullId: string;
  /** 会话标签 */
  labels: string[];
  /** 会话名称 */
  chatName: string;
  /** 会话备注 */
  chatRemark: string;
  /** 是否置顶 */
  isToping: boolean;
  /** 会话未读消息数量 */
  noReadCount: number;
  /** 最后一次消息时间 */
  lastMsgTime: number;
  /** 最新消息 */
  lastMessage?: ChatMessageType;
  /** 提及我 */
  mentionMe: boolean;
};

// 动态
export type ActivityType = {
  // 类型
  typeName: string;
  // 内容
  content: string;
  // 资源
  resource: FileItemShare[];
  // 评注
  comments: CommentType[];
  // 点赞
  likes: string[];
  // 转发
  forward: string[];
  // 标签
  tags: string[];
} & Xbase;

// 加载请求类型
export type LoadOptions = {
  filter: any[];
  take: number;
  group: string;
  skip: number;
  options: any;
};

export type DirectoryContent = {
  forms: XForm[];
  specieses: XSpecies[];
  propertys: XProperty[];
  applications: XApplication[];
  directorys: XDirectory[];
};

/** 请求失败 */
export const badRequest = (
  msg: string = '请求失败',
  code: number = 400,
): ResultType<any> => {
  return { success: false, msg: msg, code: code, data: false };
};

// 节点
export type Node = {
  // 主键
  id: string;
  // 编码
  code: string;
  // 名称
  name: string;
  // 类型
  typeName: NodeType;
  // 前置脚本
  preScript?: string;
  // 后置脚本
  postScript?: string;
  // 状态
  status?: NStatus;
};

// 边
export type Edge = {
  // 主键
  id: string;
  // 开始
  start: string;
  // 结束
  end: string;
};

// 请求
export type Request = {
  data: HttpRequestType;
} & Node;

// 表格
export type Tables = {
  formIds: string[];
  file?: FileItemModel;
} & Node;

// 页
export type Sheet<T> = {
  // 主键
  id: string;
  // 名称
  name: string;
  // 列信息
  columns: Column[];
  // 数据
  data: T[];
};

/**
 * 列字段
 */
export interface Column {
  // 字段名称
  title: string;
  // 标识符
  dataIndex: string;
  // 类型
  valueType: string;
  // 映射
  lookups?: { id: string; text: string; value: string }[];
}

// 映射
export type Mapping = {
  // 源
  source?: string;
  // 目标
  target?: string;
  // 原 Id 字段名称
  idName: string;
  // 映射类型
  mappingType: MappingType;
  // 映射
  mappings: SubMapping[];
} & Node;

// 子映射
export type SubMapping = {
  // 源对象
  source: string;
  // 目标对象
  target: string;
  // 类型
  typeName?: string;
  // 子映射
  mappings?: SubMapping[];
};

// 存储
export type Store = {
  // 应用
  applicationId?: string;
  // 办事
  workId?: string;
} & Node;

// 子配置
export type SubTransfer = {
  // 子配置 ID
  transferId?: string;
  // 是否自循环
  isSelfCirculation: boolean;
  // 退出循环脚本
  judge?: string;
} & Node;

// 表单
export type Form = {
  // 表单 ID
  formId?: string;
} & Node;

// 选择
export type Selection = {
  // 类型
  type: 'checkbox' | 'radio';
  // 关键字
  key: string;
  // 表单 ID
  formId: string;
} & Node;

// 环境
export type Environment = {
  id: string;
  name: string;
  params: KeyValue;
};

// 脚本
export type Script = {
  id: string;
  name: string;
  code: string;
  coder: string;
};

// 图状态
export type GStatus = 'Editable' | 'Viewable' | 'Running' | 'Error';

// 图事件
export type GEvent = 'Prepare' | 'Run' | 'Complete' | 'Edit' | 'Throw' | 'Recover';

// 节点状态
export type NStatus = 'Stop' | 'Running' | 'Error' | 'Completed';

// 节点事件
export type NEvent = 'Start' | 'Throw' | 'Complete';

// 节点类型
export type NodeType = '表单' | '表格' | '请求' | '子图' | '映射' | '存储';

// 脚本位置
export type Pos = 'pre' | 'post';

// 映射类型（外部系统 => 内部系统，外部系统 => 外部系统，内部系统 => 外部系统，内部系统 => 内部系统）
export type MappingType = 'OToI' | 'OToO' | 'IToO' | 'IToI';

// 键值对
export type KeyValue = { [key: string]: string | undefined };

// 状态转移
export type Shift<T, S> = {
  // 开始
  start: S;
  // 事件
  event: T;
  // 结束
  end: S;
};

// 迁移配置
export type Transfer = {
  // 目录
  directoryId: string;
  // 环境集合
  envs: Environment[];
  // 当前环境
  curEnv?: string;
  // 节点集合
  nodes: Node[];
  // 边集合
  edges: Edge[];
  // 图数据
  graph: any;
} & XStandard;

// 任务
export type Task = {
  // 唯一标识
  id: string;
  // 当前状态
  status: GStatus;
  // 环境
  env?: Environment;
  // 节点
  nodes: Node[];
  // 边
  edges: Edge[];
  // 图数据
  graph: any;
  // 开始时间
  startTime: Date;
  // 结束时间
  endTime?: Date;
};

export type SettingWidget = {
  /** 按钮生成的 schema 的 key 值 */
  name: string;
  /** 在左侧栏按钮展示文案 */
  text: string;
  /** 在左侧栏按钮展示图标 */
  icon?: string;
  /** 如果是基本组件，这个字段注明它对应的 widgets */
  widget?: string;
  /** 组件对应的 schema 片段 */
  schema?: any;
  /** 组件的配置信息，使用 form-render 的 schema 来描述 */
  setting?: any;
};

export type Setting = {
  /** 最外层的分组名称 */
  title: string;
  /** 每个组件的配置，在左侧栏是一个按钮 */
  widgets: SettingWidget[];
  show?: boolean;
  useCommon?: boolean;
};

export type SchemaType = {
  displayType: 'row' | 'column';
  type: 'object';
  labelWidth: number | string;
  properties: Record<string, object>;
  column: 1 | 2 | 3;
};

export type DiskInfoType = {
  // 状态
  ok: number;
  // 文件数量
  files: number;
  // 对象数量
  objects: number;
  // 集合数量
  collections: number;
  // 文件的总大小
  fileSize: number;
  // 数据的总大小
  dataSize: number;
  // 数据占用磁盘的总大小
  totalSize: number;
  // 文件系统挂载磁盘已使用大小
  fsUsedSize: number;
  // 文件系统挂载磁盘的总大小
  fsTotalSize: number;
  // 查询时间
  getTime: string;
}
