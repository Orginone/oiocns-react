//度量特性定义
export type XAttribute = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 值类型
  valueType: string;
  // 公开的
  public: boolean;
  // 单位
  unit: string;
  // 选择字典的类型ID
  dictId: string;
  // 备注
  remark: string;
  // 类别ID
  speciesId: string;
  // 创建组织/个人
  belongId: string;
  // 工作职权Id
  authId: string;
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
  // 字典类型
  dict: XDict | undefined;
  // 度量特性对应的类别
  species: XSpecies | undefined;
  // 工作职权
  authority: XAuthority | undefined;
  // 创建度量标准的组织/个人
  belong: XTarget | undefined;
};

//度量特性定义查询返回集合
export type XAttributeArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XAttribute[] | undefined;
};

//业务标准定义
export type XOperation = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 公开的
  public: boolean;
  // 备注
  remark: string;
  // 类别ID
  speciesId: string;
  // 创建组织/个人
  belongId: string;
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
  // 度量特性对应的类别
  species: XSpecies | undefined;
  // 创建度量标准的组织/个人
  belong: XTarget | undefined;
};

//业务标准查询返回集合
export type XOperationArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XOperation[] | undefined;
};

//业务标准定义项
export type XOperationItem = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 规则
  rule: string;
  // 备注
  remark: string;
  // 业务ID
  operationId: string;
  // 创建组织/个人
  belongId: string;
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
  // 度量特性对应的类别
  operation: XOperation | undefined;
  // 创建度量标准的组织/个人
  belong: XTarget | undefined;
};

//业务标准查询返回集合
export type XOperationItemArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XOperationItem[] | undefined;
};

//职权定义
export type XAuthority = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 公开的
  public: boolean;
  // 上级职权ID
  parentId: string;
  // 创建组织/个人
  belongId: string;
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
  // 上下级职权
  parent: XAuthority | undefined;
  // 上下级职权
  nodes: XAuthority[] | undefined;
  // 创建职权标准的组织/个人
  belong: XTarget | undefined;
};

//职权定义查询返回集合
export type XAuthorityArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XAuthority[] | undefined;
};

//字典类型
export type XDict = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 公开的
  public: boolean;
  // 创建组织/个人
  belongId: string;
  // 类别ID
  speciesId: string;
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
  // 字典项
  dictItems: XDictItem[] | undefined;
  // 创建类别标准的组织/个人
  belong: XTarget | undefined;
};

//字典类型查询返回集合
export type XDictArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XDict[] | undefined;
};

//枚举字典项
export type XDictItem = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 值
  value: string;
  // 公开的
  public: boolean;
  // 创建组织/个人
  belongId: string;
  // 字典类型ID
  dictId: string;
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
  // 字典类型
  dict: XDict | undefined;
  // 创建类别标准的组织/个人
  belong: XTarget | undefined;
};

//枚举字典项查询返回集合
export type XDictItemArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XDictItem[] | undefined;
};

//应用资源分发
export type XExtend = {
  // 雪花ID
  id: string;
  // 源对象
  sourceId: string;
  // 目标类型
  destType: string;
  // 目标对象Id
  destId: string;
  // 所属组织/个人
  belongId: string;
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
  // 资源归属的组织/个人
  belong: XTarget | undefined;
};

//应用资源分发查询返回集合
export type XExtendArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XExtend[] | undefined;
};

//流程定义
export type XFlowDefine = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编码
  code: string;
  // 归属组织/个人Id
  belongId: string;
  // 流程内容Json
  content: string;
  // 备注
  remark: string;
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
  // 归属组织/个人
  target: XTarget | undefined;
};

//流程定义查询返回集合
export type XFlowDefineArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XFlowDefine[] | undefined;
};

//流程实例
export type XFlowInstance = {
  // 雪花ID
  id: string;
  // 流程定义Id
  defineId: string;
  // 应用Id
  productId: string;
  // 标题
  title: string;
  // 展示内容类型
  contentType: string;
  // 展示内容
  content: string;
  // 表单数据
  data: string;
  // 回调钩子
  hook: string;
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
  // 流程的定义
  flowDefine: XFlowDefine | undefined;
};

//流程实例查询返回集合
export type XFlowInstanceArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XFlowInstance[] | undefined;
};

//流程节点数据
export type XFlowRecord = {
  // 雪花ID
  id: string;
  // 审批人员
  targetId: string;
  // 节点任务
  taskId: string;
  // 评论
  comment: string;
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
  // 审批人员
  target: XTarget | undefined;
};

//流程节点数据查询返回集合
export type XFlowRecordArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XFlowRecord[] | undefined;
};

//流程对应
export type XFlowRelation = {
  // 雪花ID
  id: string;
  // 产品Id
  productId: string;
  // 业务编号
  functionCode: string;
  // 流程定义Id
  defineId: string;
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
  // 应用资源
  product: XProduct | undefined;
  // 流程的定义
  flowDefine: XFlowDefine | undefined;
};

//流程对应查询返回集合
export type XFlowRelationArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XFlowRelation[] | undefined;
};

//流程任务
export type XFlowTask = {
  // 雪花ID
  id: string;
  // 流程定义节点id
  nodeId: string;
  // 流程实例id
  instanceId: string;
  // 节点分配目标Id
  identityId: string;
  // 审批人员
  personIds: string;
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
  // 任务审批的身份
  identity: XIdentity | undefined;
  // 流程的定义
  flowInstance: XFlowInstance | undefined;
};

//流程任务查询返回集合
export type XFlowTaskArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XFlowTask[] | undefined;
};

//流程任务
export type XFlowTaskHistory = {
  // 雪花ID
  id: string;
  // 流程定义节点id
  nodeId: string;
  // 流程实例id
  instanceId: string;
  // 节点分配目标Id
  identityId: string;
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
  // 流程节点记录
  flowRecords: XFlowRecord[] | undefined;
  // 任务审批的身份
  identity: XIdentity | undefined;
  // 流程的定义
  flowInstance: XFlowInstance | undefined;
};

//流程任务查询返回集合
export type XFlowTaskHistoryArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XFlowTaskHistory[] | undefined;
};

//身份
export type XIdentity = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 职权Id
  authId: string;
  // 创建组织/个人
  belongId: string;
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
  // 赋予身份的组织/个人
  givenTargets: XTarget[] | undefined;
  // 身份的类别
  authority: XAuthority | undefined;
  // 创建身份的组织/个人
  belong: XTarget | undefined;
};

//身份查询返回集合
export type XIdentityArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XIdentity[] | undefined;
};

//及时通讯
export type XImMsg = {
  // 雪花ID
  id: string;
  // 工作空间Id
  spaceId: string;
  // 发起方Id
  fromId: string;
  // 接收方Id
  toId: string;
  // 消息类型
  msgType: string;
  // 消息体
  msgBody: string;
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
  // 显示文本
  showTxt: string;
  // 允许编辑
  allowEdit: boolean;
};

//及时通讯查询返回集合
export type XImMsgArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XImMsg[] | undefined;
};

//操作日志
export type XLog = {
  // 雪花ID
  id: string;
  // 类型
  type: string;
  // 模块
  module: string;
  // 内容
  content: string;
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

//操作日志查询返回集合
export type XLogArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XLog[] | undefined;
};

//交易市场
export type XMarket = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 图片
  photo?: string;
  // 公开的
  public: boolean;
  // 创建组织/个人
  belongId: string;
  // 市场监管组织/个人
  samrId: string;
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
  // 市场归属的组织/个人
  belong: XTarget | undefined;
};

//交易市场查询返回集合
export type XMarketArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XMarket[] | undefined;
};

//组织/个人与市场关系
export type XMarketRelation = {
  // 雪花ID
  id: string;
  // 市场ID
  marketId: string;
  // 组织/个人ID
  targetId: string;
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
  // 组织/个人ID
  target: XTarget | undefined;
};

//组织/个人与市场关系查询返回集合
export type XMarketRelationArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XMarketRelation[] | undefined;
};

//商品信息
export type XMerchandise = {
  // 雪花ID
  id: string;
  // 标题
  caption: string;
  // 产品ID
  productId: string;
  // 单价
  price: number;
  // 出售权属
  sellAuth: string;
  // 有效期
  days: string | number;
  // 商品出售市场ID
  marketId: string;
  // 描述信息
  information: string;
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

//商品信息查询返回集合
export type XMerchandiseArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XMerchandise[] | undefined;
};

//采购订单
export type XOrder = {
  // 雪花ID
  id: string;
  // 存证ID
  nftId: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 总价
  price: number;
  // 创建组织/个人
  belongId: string;
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
  // 相关商品
  details?: XOrderDetail[];
};

//采购订单查询返回集合
export type XOrderArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XOrder[] | undefined;
};

//订单详情
export type XOrderDetail = {
  // 雪花ID
  id: string;
  // 订单ID
  orderId: string;
  // 商品ID
  merchandiseId: string;
  // 商品信息
  merchandise?: XMerchandise[];
  // 卖方ID
  sellerId: string;
  // 卖方产品来源
  productSource: string;
  // 出售权属
  sellAuth: string;
  // 总价
  price: number;
  // 有效期
  days: string;
  // 标题
  caption: string;
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
  // 采购订单
  order?: XOrder;
};

//订单详情查询返回集合
export type XOrderDetailArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XOrderDetail[] | undefined;
};

//支付详情
export type XOrderPay = {
  // 雪花ID
  id: string;
  // 订单ID
  orderDetailId: string;
  // 支付总价
  price: number;
  // 支付方式
  paymentType: string;
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
  // 订单
  orderDetail: XOrderDetail | undefined;
};

//支付详情查询返回集合
export type XOrderPayArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XOrderPay[] | undefined;
};

//产品信息
export type XProduct = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 来源
  source: string;
  // 权属
  authority: string;
  // 对哪一类制定的标准
  typeName: string;
  // 归属组织/个人
  belongId: string;
  // 元数据Id
  thingId: string;
  // 订单ID
  orderId: string;
  // 过期时间
  endTime: string;
  // 备注
  remark: string;
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
  // 产品的资源
  resource: XResource[] | undefined;
  // 产品的本质
  thing: XThing | undefined;
  // 产品归属的组织/个人
  belong: XTarget | undefined;
};

//产品信息查询返回集合
export type XProductArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XProduct[] | undefined;
};

//组织/个人关系
export type XRelation = {
  // 雪花ID
  id: string;
  // 对象ID
  targetId: string;
  // 组织ID
  teamId: string;
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
  // 关系的度量
  attrValues: XThingAttr[] | undefined;
  // 关联的组织团队
  team: XTeam | undefined;
  // 关联的组织实体
  target: XTarget | undefined;
};

//组织/个人关系查询返回集合
export type XRelationArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XRelation[] | undefined;
};

//应用资源
export type XResource = {
  // 雪花ID
  id: string;
  // 编号
  code: string;
  // 名称
  name: string;
  // 产品ID
  productId: string;
  // 访问私钥
  privateKey: string;
  // 入口
  link: string;
  // 流程项
  flows: string;
  // 组件
  components: string;
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
  //
  product: XProduct | undefined;
};

//应用资源查询返回集合
export type XResourceArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XResource[] | undefined;
};

//规则与度量标准关系
export type XRuleAttr = {
  // 雪花ID
  id: string;
  // 规则ID
  ruleId: string;
  // 度量标准ID
  attrId: string;
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
  // 规则
  ruleStd: XRuleStd | undefined;
  // 标准
  attribute: XAttribute | undefined;
};

//规则与度量标准关系查询返回集合
export type XRuleAttrArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XRuleAttr[] | undefined;
};

//标准要求
export type XRuleStd = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 对哪一类制定的标准
  typeName: string;
  // 组织/个人ID
  targetId: string;
  // 容器ID
  containerId: string;
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
  // 标准要求
  ruleAttrs: XRuleAttr[] | undefined;
  // 组织/个人
  target: XTarget | undefined;
};

//标准要求查询返回集合
export type XRuleStdArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XRuleStd[] | undefined;
};

//类别定义
export type XSpecies = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 公开的
  public: boolean;
  // 父类别ID
  parentId: string;
  // 创建组织/个人
  belongId: string;
  // 工作职权Id
  authId: string;
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
  // 分类的结构
  parent: XSpecies | undefined;
  // 分类的结构
  nodes: XSpecies[] | undefined;
  // 工作职权
  authority: XAuthority | undefined;
  // 创建类别标准的组织/个人
  belong: XTarget | undefined;
};

//类别定义查询返回集合
export type XSpeciesArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XSpecies[] | undefined;
};

//商品暂存
export type XStaging = {
  // 雪花ID
  id: string;
  // 商品ID
  merchandiseId: string;
  // 创建组织/个人
  belongId: string;
  // 订单采购的市场
  marketId: string;
  // 数量
  number: string;
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
  // 暂存区针对的市场
  market: XMarket | undefined;
  // 创建的组织/个人
  belong: XTarget | undefined;
  // 暂存的商品
  merchandise: XMerchandise | undefined;
};

//商品暂存查询返回集合
export type XStagingArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XStaging[] | undefined;
};

//组织/个人
export type XTarget = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 类型
  typeName: string;
  // 归属
  belongId: string;
  // 元数据
  thingId: string;
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
  // 头像
  avatar: string | undefined;
  // 作为团队的影子
  team: XTeam | undefined;
  // 赋予该组织/个人创建的身份
  givenIdentitys: XIdentity[] | undefined;
  // 该组织或个人所属的组织/个人
  belong: XTarget | undefined;
  // 组织/个人物的本质
  thing: XThing | undefined;
};

//组织/个人查询返回集合
export type XTargetArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XTarget[] | undefined;
};

//虚拟组织
export type XTeam = {
  // 雪花ID
  id: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 实体
  targetId: string;
  // 备注
  remark: string;
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
  // 团队的实体
  target: XTarget | undefined;
};

//虚拟组织查询返回集合
export type XTeamArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XTeam[] | undefined;
};

//(物/存在)
export type XThing = {
  // 雪花ID
  id: string;
  // 链上ID
  chainId: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 归属
  belongId: string;
  // 备注
  remark: string;
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
  // 零件
  nodes: XThing[] | undefined;
  // 整件
  parent: XThing[] | undefined;
  // 物的特性度量值
  thingAttrValues: XThingAttr[] | undefined;
  // 给物的分类类别
  givenSpecies: XSpecies[] | undefined;
  // 给物的度量标准
  givenAttributes: XAttribute[] | undefined;
  // 物的归属
  belong: XTarget | undefined;
};

//(物/存在)查询返回集合
export type XThingArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XThing[] | undefined;
};

//物的度量特性
export type XThingAttr = {
  // 雪花ID
  id: string;
  // 属性ID
  attrId: string;
  // 元数据ID
  thingId: string;
  // 关系ID
  relationId: string;
  // 数值
  numValue: number;
  // 描述
  strValue: string;
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
  // 历史度量
  histroy: XThingAttrHistroy[] | undefined;
  // 度量的标准
  attribute: XAttribute | undefined;
  // 度量的物
  thing: XThing | undefined;
};

//物的度量特性查询返回集合
export type XThingAttrArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XThingAttr[] | undefined;
};

//物的度量特性历史
export type XThingAttrHistroy = {
  // 雪花ID
  id: string;
  // 最新度量ID
  thingAttrId: string;
  // 数值
  numValue: number;
  // 描述
  strValue: string;
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
  // 最新度量
  thingAttr: XThingAttr | undefined;
};

//物的度量特性历史查询返回集合
export type XThingAttrHistroyArray = {
  // 偏移量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XThingAttrHistroy[] | undefined;
};
