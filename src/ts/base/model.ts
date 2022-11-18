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

export type IdReq = {
  // 唯一ID
  id: string;
};

export type NameModel = {
  // 结果
  name: string;
};

export type IdReqModel = {
  // 唯一ID
  id: string;
  // 实体类型
  typeName: string;
  // 归属ID
  belongId: string;
};

export type IdArrayReq = {
  // 唯一ID数组
  ids: number[] | string[];
  // 分页
  page: PageRequest;
};

export type IdSpaceReq = {
  // 唯一ID
  id: string;
  // 工作空间ID
  spaceId: number | string;
  // 分页
  page: PageRequest;
};

export type SpaceAuthReq = {
  // 职权ID
  authId: number | string;
  // 工作空间ID
  spaceId: number | string;
};

export type IDBelongReq = {
  // 唯一ID
  id: string;
  // 分页
  page: PageRequest;
};

export type RelationReq = {
  // 唯一ID
  id: string;
  // 子组织/个人ID
  subIds: number[] | string[];
};

// 缓存结构体
export type CacheReq = {
  // 缓存key
  key: string;
  // 缓存数据
  value: string;
  // 过期时间s
  expire: number;
};

export type ThingAttrReq = {
  // 唯一ID
  id: string;
  //类别Id
  specId: number | string;
  //类别代码
  specCode: string;
  //特性Id
  attrId: number | string;
  //特性代码
  attrCode: string;
  //关系Id
  relationId: number | string;
  //是否公开
  public: boolean;
  // 分页
  page: PageRequest;
};

export type IDWithBelongReq = {
  // 唯一ID
  id: string;
  // 归属ID
  belongId: number | string;
};

export type IDWithBelongPageReq = {
  // 唯一ID
  id: string;
  // 归属ID
  belongId: number | string;
  // 分页
  page: PageRequest;
};

export type IDStatusPageReq = {
  // 唯一ID
  id: string;
  // 状态
  status: number;
  // 分页
  page: PageRequest;
};

export type IDBelongTargetReq = {
  // 唯一ID
  id: string;
  // 类型
  targetType: string;
  // 分页
  page: PageRequest;
};

export type IDReqSubModel = {
  // 唯一ID
  id: string;
  // 实体类型
  typeNames: string[];
  // 子节点类型
  subTypeNames: string[];
  // 分页
  page: PageRequest;
};

export type IDReqJoinedModel = {
  // 唯一ID
  id?: string;
  // 实体类型
  typeName: string;
  // 加入的节点类型
  JoinTypeNames: string[];
  // 工作空间ID
  spaceId: string;
  // 分页
  page: PageRequest;
};

export type ChatsReqModel = {
  // 工作空间ID
  spaceId: number | string;
  // 群组名称
  cohortName: string;
  // 空间类型名称
  spaceTypeName: string;
};

export type PageRequest = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  //过滤条件
  filter: string;
};

export type RecursiveReqModel = {
  // 唯一ID
  id: string;
  // 实体类型
  typeName: string;
  // 字节点类型
  subNodeTypeNames: string[];
};

export type IdWithNameModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
};

export type IdNameArray = {
  // 唯一ID数组
  result: IdWithNameModel[];
};

export type ApprovalModel = {
  // 唯一ID
  id: string;
  // 状态
  status: number;
};

export type DictModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 公开的
  public: boolean;
  // 创建组织/个人
  belongId: number | string;
  // 备注
  remark: string;
};

export type DictItemModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  value: string;
  // 公开的
  public: boolean;
  // 创建组织/个人
  belongId: number | string;
  // 备注
  dictId: number | string;
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
  // 创建组织/个人
  belongId: number | string;
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
  // 公开的
  public: boolean;
  // 父类别ID
  parentId: number | string;
  // 创建组织/个人
  belongId: number | string;
  // 工作职权Id
  authId: number | string;
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
  // 公开的
  public: boolean;
  // 值类型
  valueType: string;
  // 单位
  unit: string;
  // 选择字典的类型ID
  dictId: number | string;
  // 备注
  remark: string;
  // 创建组织/个人
  belongId: number | string;
  // 类别Id
  speciesId: number | string;
  // 类别代码
  speciesCode: string;
  // 工作职权Id
  authId: number | string;
};

export type AuthorityModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 公开的
  public: boolean;
  // 父类别ID
  parentId: number | string;
  // 创建组织/个人
  belongId: number | string;
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
  authId: number | string;
  // 创建组织/个人
  belongId: number | string;
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
  // 创建组织/个人
  belongId: number | string;
  // 团队名称
  teamName: string;
  // 团队代号
  teamCode: string;
  // 团队备注
  teamRemark: string;
};

export type RuleStdModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 组织/个人ID
  targetId: string;
  // 类型
  typeName: string;
  // 备注
  remark: string;
  // 标准
  attrs: number[] | string[];
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
// 市场
export type MarketModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 创建组织/个人
  belongId: number | string;
  // 监管组织/个人
  samrId: number | string;
  // 备注
  remark: string;
  // 是否公开
  public: boolean;
};

export type MerchandiseModel = {
  // 唯一ID
  id: string;
  // 标题
  caption: string;
  // 产品ID
  productId: number | string;
  // 单价
  price: number;
  // 出售权属
  sellAuth: string;
  // 商品出售市场ID
  marketId: number | string;
  // 描述信息
  information: string;
  // 有效期
  days: number | string;
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
  // 创建组织/个人
  belongId: number | string;
  // 商品ID
  merchandiseId: number | string;
};

export type OrderModelByStags = {
  // 唯一ID
  id: string;
  // 存证ID
  nftId: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 创建组织/个人
  belongId: number | string;
  // 暂存区ID集合
  stagingIds: number[] | string[];
};

export type OrderDetailModel = {
  // 唯一ID
  id: string;
  // 订单
  caption: string;
  // 商品
  days: number;
  // 单价
  // 卖方ID
  status: number;
  // 空间ID
  spaceId: number | string;
};

export type OrderPayModel = {
  // 唯一ID
  id: string;
  // 订单
  orderDetailId: number | string;
  // 支付总价
  // 支付方式
  paymentType: string;
};
// 产品基础信息
export type ProductModel = {
  // 唯一ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 元数据Id
  thingId: number | string;
  // 产品类型名
  typeName: string;
  // 备注
  remark: string;
  // 所属ID
  belongId: number | string;
  // 资源列表
  resources: ResourceModel[];
};
// 产品资源信息
export type ResourceModel = {
  // 唯一ID
  id: string;
  // 编号
  code: string;
  // 名称
  name: string;
  // 产品ID
  productId: number | string;
  // 访问私钥
  privateKey: string;
  // 入口地址
  link: string;
  // 流程项
  flows: string;
  // 组件
  components: string;
};

export type StagingModel = {
  // 唯一ID
  id: string;
  // 商品
  merchandiseId: number | string;
  // 创建组织/个人
  belongId: number | string;
};

export type ThingSpeciesModel = {
  // 物的唯一ID
  id: string;
  // 赋予的类别Id
  speciesId: number | string;
  // 赋予的类别代码
  speciesCode: string;
};

export type ThingAttrModel = {
  // 物的唯一ID
  id: string;
  // 基于关系ID的度量
  relationId: number | string;
  // 类别Id
  speciesId: number | string;
  //类别代码
  specCode: string;
  //特性Id
  attrId: number | string;
  //特性代码
  attrCode: string;
  // 字符串类型的值
  strValue: string;
  // 数值类型的值
};

export type JoinTeamModel = {
  // 团队ID
  id: string;
  // 团队类型
  teamType: string;
  // 待加入团队组织/个人ID
  targetId: string;
  // 待拉入组织/个人类型
  targetType: string;
};

export type ExitTeamModel = {
  // 团队ID
  id: string;
  // 团队类型
  teamTypes: string[];
  // 待退出团队组织/个人ID
  targetId: string;
  // 待退出组织/个人类型
  targetType: string;
};

export type TeamPullModel = {
  // 团队ID
  id: string;
  // 团队类型
  teamTypes: string[];
  // 待拉入的组织/个人ID集合
  targetIds: number[];
  // 待拉入组织/个人类型
  targetType: string;
};

export type CreateOrderByStagingModel = {
  // 订单名称
  name: string;
  // 订单编号
  code: string;
  // 所属ID
  belongId: number | string;
  // 暂存区ID
  StagingIds: number[] | string[];
};

export type GiveIdentityModel = {
  // 身份ID
  id: string;
  // 人员ID
  targetIds: number[] | string[];
};

export type SearchExtendReq = {
  // 源ID
  sourceId: number | string;
  // 源类型
  sourceType: string;
  // 分配对象类型
  destType: string;
  // 归属ID
  spaceId: number | string;
  // TeamID
  teamId?: number | string;
};

export type MarketPullModel = {
  // 团队ID
  marketId: number | string;
  // 待拉入的组织/个人ID集合
  targetIds: number[] | string[];
  // 待拉入组织/个人类型
  typeNames: string[];
};

export type UsefulProductReq = {
  // 工作空间ID
  spaceId: number | string;
  // 拓展目标所属对象类型
  typeNames: string[];
};

export type UsefulResourceReq = {
  // 工作空间ID
  spaceId: number | string;
  // 产品ID
  productId: number | string;
  // 拓展目标所属对象类型
  typeNames: string[];
};

export type SourceExtendModel = {
  // 源对象ID
  sourceId: number | string;
  // 源对象类型
  sourceType: string;
  // 目标对象类型
  destType: string;
  // 目标对象ID
  destIds: number[] | string[];
  // 组织ID
  teamId: number | string;
  // 归属ID
  spaceId: number | string;
};

export type NameTypeModel = {
  // 名称
  name: string;
  // 类型名
  typeName: string;
  // 分页
  page: PageRequest;
};

export type NameCodeModel = {
  // 名称
  name: string;
  // 代码
  code: string;
  // 分页
  page: PageRequest;
};

export type ImMsgModel = {
  // 工作空间ID
  spaceId: number | string;
  // 发起方Id
  fromId: number | string;
  // 接收方Id
  toId: number | string;
  // 消息类型
  msgType: string;
  // 消息体
  msgBody: string;
};

export type ChatResponse = {
  // 会话分组
  groups: GroupChatModel[];
};

export type GroupChatModel = {
  // 分组ID
  id: string;
  // 名称
  name: string;
  // 会话
  chats: ChatModel[];
};

export type ChatModel = {
  // 会话ID
  id: string;
  // 名称
  name: string;
  // 头像
  photo: string;
  // 标签
  label: string;
  // 备注
  remark: string;
  // 类型名称
  typeName: string;
  // 消息体
  msgType: string;
  // 消息体
  msgBody: string;
  // 消息时间
  msgTime: string;
};

export type FlowInstanceModel = {
  // 应用Id
  productId: number | string;
  // 功能标识编号
  functionCode: string;
  // 空间Id
  SpaceId: number | string;
  // 展示内容
  content: string;
  // 内容类型
  contentType: string;
  // 表单数据内容
  data: string;
  // 标题
  title: string;
  // 回调地址
  hook: string;
};

export type FlowRelationModel = {
  //流程定义Id
  defineId: number | string;
  // 应用Id
  productId: number | string;
  // 功能标识编号
  functionCode: string;
  // 空间Id
  SpaceId: number | string;
};

export type FlowReq = {
  // 流程定义Id
  id: string;
  // 空间Id
  spaceId: number | string;
  // 状态
  status: number;
  // 分页
  page: PageRequest;
};

export type ApprovalTaskReq = {
  // 流程定义Id
  id: string;
  // 状态
  status: number;
  // 评论
  comment: string;
};
