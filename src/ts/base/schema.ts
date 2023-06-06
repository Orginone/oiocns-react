export type Xbase = {
  // 雪花ID
  id: string;
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

export type XEntity = {
  // 名称
  name: string;
  // 编号
  code: string;
  // 备注
  remark: string;
  // 图标
  icon: string;
  // 归属用户
  belongId: string;
  // 类型
  typeName: string;
  // 创建类别标准的用户
  belong: XTarget | undefined;
} & Xbase;

//特性和属性的关系
export type XAttrLinkProp = {
  // 特性ID
  attrId: string;
  // 属性ID
  propId: string;
  // 归属用户ID
  belongId: string;
  // 关联的属性
  property: XProperty | undefined;
  // 关联的特性
  attribute: XAttribute | undefined;
} & Xbase;

//特性和属性的关系查询返回集合
export type XAttrLinkPropArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XAttrLinkProp[] | undefined;
};

//度量特性定义
export type XAttribute = {
  // 规则
  rule: string;
  // 值类型
  valueType: string;
  // 共享用户ID
  shareId: string;
  // 工作职权Id
  authId: string;
  // 属性Id
  propId: string;
  // 表单Id
  formId: string;
  // 字典Id
  dictId: string;
  // 附加过属性的物
  linkPropertys: XProperty[] | undefined;
  // 属性关系
  links: XAttrLinkProp[] | undefined;
  // 关联属性
  property: XProperty | undefined;
  // 工作职权
  authority: XAuthority | undefined;
  // 特性对应的表单
  form: XForm | undefined;
} & XEntity;

//度量特性定义查询返回集合
export type XAttributeArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XAttribute[] | undefined;
};

//权限定义
export type XAuthority = {
  // 公开的
  public: boolean;
  // 上级权限ID
  parentId: string;
  // 共享用户ID
  shareId: string;
  // 上下级权限
  parent: XAuthority | undefined;
  // 上下级权限
  nodes: XAuthority[] | undefined;
  // 权限对应的身份
  identitys: XIdentity[] | undefined;
  // 权限可操作的类别
  authSpecies: XSpecies[] | undefined;
  // 权限可操作的度量
  autAttrs: XAttribute[] | undefined;
} & XEntity;

//权限定义查询返回集合
export type XAuthorityArray = {
  // 便宜量
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
  // 类别ID
  speciesId: string;
  // 字典项
  dictItems: XDictItem[] | undefined;
  // 使用该字典的度量属性
  dictProps: XProperty[] | undefined;
} & XEntity;

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
  // 值
  value: string;
  // 字典类型ID
  dictId: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
  // 字典类型
  dict: XDict | undefined;
} & XEntity;

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

//单定义
export type XForm = {
  // 规则
  rule: string;
  // 类别ID
  speciesId: string;
  // 共享用户ID
  shareId: string;
  // 单设计详情项
  attributes: XAttribute[] | undefined;
  // 单设计针对的分类
  bindNodes: XWorkNode[] | undefined;
  // 单设计针对的分类
  species: XSpecies | undefined;
} & XEntity;

//单定义查询返回集合
export type XFormArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XForm[] | undefined;
};

//身份证明
export type XIdProof = {
  // 身份ID
  identityId: string;
  // 对象ID
  targetId: string;
  // 组织ID
  teamId: string;
  // 身份证明证明的用户
  target: XTarget | undefined;
  // 身份证明证明的身份
  identity: XIdentity | undefined;
} & Xbase;

//身份证明查询返回集合
export type XIdProofArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XIdProof[] | undefined;
};

//身份
export type XIdentity = {
  // 职权Id
  authId: string;
  // 共享用户ID
  shareId: string;
  // 身份证明
  idProofs: XIdProof[] | undefined;
  // 身份集关系
  identityTeams: XTeamIdentity[] | undefined;
  // 赋予身份的用户
  givenTargets: XTarget[] | undefined;
  // 身份集对于组织
  teams: XTeam[] | undefined;
  // 身份的类别
  authority: XAuthority | undefined;
  // 共享用户
  share: XTarget | undefined;
} & XEntity;

//身份查询返回集合
export type XIdentityArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XIdentity[] | undefined;
};

//操作日志
export type XLog = {
  // 类型
  type: string;
  // 模块
  module: string;
  // 内容
  content: string;
  // 归属用户ID
  belongId: string;
} & Xbase;

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

//采购订单
export type XOrder = {
  // 存证ID
  nftId: string;
  // 总价
  price: number;
  // 市场ID
  marketId: string;
  // 订单内容
  content: string;
  // 支付详情
  pays: XOrderPay[] | undefined;
} & XEntity;

//采购订单查询返回集合
export type XOrderArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XOrder[] | undefined;
};

//支付详情
export type XOrderPay = {
  // 订单ID
  orderId: string;
  // 支付总价
  price: number;
  // 支付方式
  paymentType: string;
  // 备注
  remark: string;
  // 订单
  orderDetail: XOrder | undefined;
} & Xbase;

//支付详情查询返回集合
export type XOrderPayArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XOrderPay[] | undefined;
};

//属性定义
export type XProperty = {
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
  // 给物的度量标准
  linkAttributes: XAttribute[] | undefined;
  // 特性关系
  links: XAttrLinkProp[] | undefined;
  // 创建的特性集
  attributes: XAttribute[] | undefined;
  // 附加过属性的物
  things: XThing[] | undefined;
  // 属性的物的度量
  propThingValues: XThingProp[] | undefined;
  // 属性对应的类别
  species: XSpecies | undefined;
  // 字典类型
  dict: XDict | undefined;
} & XEntity;

//属性定义查询返回集合
export type XPropertyArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XProperty[] | undefined;
};

//用户关系
export type XRelation = {
  // 对象ID
  targetId: string;
  // 组织ID
  teamId: string;
  // 关联的组织团队
  team: XTeam | undefined;
  // 关联的组织实体
  target: XTarget | undefined;
} & Xbase;

//用户关系查询返回集合
export type XRelationArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XRelation[] | undefined;
};

//类别定义
export type XSpecies = {
  // 父类别ID
  parentId: string;
  // 工作职权Id
  authId: string;
  // 共享容器ID
  shareId: string;
  // 分类下的办事
  defines: XWorkDefine[] | undefined;
  // 类别下的属性
  propertys: XProperty[] | undefined;
  // 类别的度量标准
  attributes: XAttribute[] | undefined;
  // 类别的业务单
  forms: XForm[] | undefined;
  // 分类的结构
  parent: XSpecies | undefined;
  // 分类的结构
  nodes: XSpecies[] | undefined;
  // 工作职权
  authority: XAuthority | undefined;
  /** 共享组织 */
  share: XTarget | undefined;
} & XEntity;

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

//用户
export type XTarget = {
  // 开放组织
  public: boolean;
  // 元数据
  thingId: string;
  // 采购订单
  orders: XOrder[] | undefined;
  // 身份证明
  idProofs: XIdProof[] | undefined;
  // 组织的身份
  shareIdentitys: XIdentity[] | undefined;
  // 归属的身份
  identitys: XIdentity[] | undefined;
  // 属于该用户的物
  things: XThing[] | undefined;
  // 加入团队的关系
  relations: XRelation[] | undefined;
  // 作为团队的影子
  team: XTeam | undefined;
  // 该用户创建的字典类型
  dicts: XDict[] | undefined;
  // 卖出的订单
  sellOrder: XOrder[] | undefined;
  // 该用户创建的字典项
  dictItems: XDictItem[] | undefined;
  // 该用户创建的类别标准
  species: XSpecies[] | undefined;
  // 该用户创建的度量标准
  attributes: XAttribute[] | undefined;
  // 该用户创建的属性
  propertys: XProperty[] | undefined;
  // 该用户创建的职权标准
  authority: XAuthority[] | undefined;
  // 加入的团队
  relTeams: XTeam[] | undefined;
  // 该用户创建的业务单
  forms: XForm[] | undefined;
  // 赋予该用户创建的身份
  givenIdentitys: XIdentity[] | undefined;
  // 该组织或个人所属的用户
  belong: XTarget | undefined;
  // 该组织或个人所属的用户
  targets: XTarget[] | undefined;
  // 用户物的本质
  thing: XThing | undefined;
  // 归属用户的办事定义
  defines: XWorkDefine[] | undefined;
  // 归属用户的办事实例
  instances: XWorkInstance[] | undefined;
} & XEntity;

//用户查询返回集合
export type XTargetArray = {
  // 便宜量
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
  // 名称
  name: string;
  // 编号
  code: string;
  // 实体
  targetId: string;
  // 加入团队的用户
  relTargets: XTarget[] | undefined;
  // 组织身份集关系
  teamIdentitys: XTeamIdentity[] | undefined;
  // 加入团队的用户的关系
  relations: XRelation[] | undefined;
  // 团队的实体
  target: XTarget | undefined;
  // 组织的身份集
  identitys: XIdentity[] | undefined;
} & Xbase;

//虚拟组织查询返回集合
export type XTeamArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XTeam[] | undefined;
};

//用户身份
export type XTeamIdentity = {
  // 身份ID
  identityId: string;
  // 用户ID
  teamId: string;
  // 身份加入的组织
  team: XTeam | undefined;
  // 组织包含的身份
  identity: XIdentity | undefined;
} & Xbase;

//用户身份查询返回集合
export type XTeamIdentityArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XTeamIdentity[] | undefined;
};

//(物/存在)
export type XThing = {
  // 链上ID
  chainId: string;
  // 共享容器ID
  shareId: string;
  // 物的属性集
  thingPropValues: XThingProp[] | undefined;
  // 物作为管理对象的映射
  target: XTarget | undefined;
  // 给物的度量标准
  givenPropertys: XProperty[] | undefined;
} & XEntity;

//(物/存在)查询返回集合
export type XThingArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XThing[] | undefined;
};

//物的属性值
export type XThingProp = {
  // 属性ID
  propId: string;
  // 元数据ID
  thingId: string;
  // 值
  value: string;
  // 历史度量
  histroy: XThingPropHistroy[] | undefined;
  // 度量的标准
  property: XProperty | undefined;
  // 度量的物
  thing: XThing | undefined;
} & Xbase;

//物的属性值查询返回集合
export type XThingPropArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XThingProp[] | undefined;
};

//物的属性历史
export type XThingPropHistroy = {
  // 最新度量ID
  thingPropId: string;
  // 值
  value: string;
  // 最新度量
  thingProp: XThingProp | undefined;
} & Xbase;

//物的属性历史查询返回集合
export type XThingPropHistroyArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XThingPropHistroy[] | undefined;
};

//办事定义
export type XWorkDefine = {
  // 类别ID
  speciesId: string;
  // 共享用户ID
  shareId: string;
  // 规则
  rule: string;
  // 允许变更
  allowEdit: boolean;
  // 允许新增
  allowAdd: boolean;
  // 允许选择
  allowSelect: boolean;
  // 办事定义节点
  nodes: XWorkNode[] | undefined;
  // 办事的实例
  instances: XWorkInstance[] | undefined;
  // 归属用户
  target: XTarget | undefined;
  // 办事的归属类别
  species: XSpecies | undefined;
} & XEntity;

//办事定义查询返回集合
export type XWorkDefineArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XWorkDefine[] | undefined;
};

//办事实例
export type XWorkInstance = {
  // 标题
  title: string;
  // 办事定义Id
  defineId: string;
  // 展示内容类型
  contentType: string;
  // 对应父流程实例的节点任务
  taskId: string;
  // 展示内容
  content: string;
  // 携带的数据
  data: string;
  // 操作主体Id集合
  thingIds: string;
  // 回调钩子
  hook: string;
  // 共享用户ID
  shareId: string;
  // 办事任务
  tasks: XWorkTask[] | undefined;
  // 办事实例任务
  historyTasks: XWorkTaskHistory[] | undefined;
  // 办事的定义
  define: XWorkDefine | undefined;
  // 归属用户
  target: XTarget | undefined;
} & XEntity;

//办事实例查询返回集合
export type XWorkInstanceArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XWorkInstance[] | undefined;
};

//办事定义节点
export type XWorkNode = {
  // 节点规则
  rule: string;
  // 审批人数
  count: number;
  // 办事定义Id
  defineId: string;
  // 节点分配目标Id
  destId: string;
  // 节点分配目标名称
  destName: string;
  // 兄弟节点Id集合
  brotherIds: string;
  // 分支Id
  branchId: string;
  // 分支类型
  branchType: number;
  // destType
  destType: string;
  // 节点类型
  nodeType: string;
  // 办事实例任务
  tasks: XWorkTask[] | undefined;
  // 赋予身份的用户
  bindFroms: XForm[] | undefined;
  // 办事实例任务
  historyTasks: XWorkTaskHistory[] | undefined;
  // 办事的定义
  define: XWorkDefine | undefined;
} & XEntity;

//办事定义节点查询返回集合
export type XWorkNodeArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XWorkNode[] | undefined;
};

//办事节点绑定
export type XWorkNodeRelation = {
  // 办事节点
  nodeId: string;
  // 单设计
  formId: string;
} & Xbase;

//办事节点绑定查询返回集合
export type XWorkNodeRelationArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XWorkNodeRelation[] | undefined;
};

//办事节点数据
export type XWorkRecord = {
  // 节点任务
  taskId: string;
  // 评论
  comment: string;
  // 内容
  data: string;
  // 办事的定义
  task: XWorkTask | undefined;
} & Xbase;

//办事节点数据查询返回集合
export type XWorkRecordArray = {
  // 便宜量
  offset: number;
  // 最大数量
  limit: number;
  // 总数
  total: number;
  // 结果
  result: XWorkRecord[] | undefined;
};

//办事任务
export type XWorkTask = {
  // 办事定义节点id
  nodeId: string;
  // 任务标题
  title: string;
  // 审批类型
  approveType: string;
  // 任务类型
  taskType: string;
  // 审批人数
  count: number;
  // 流程定义Id
  defineId: string;
  // 归属组织Id
  shareId: string;
  // 归属组织Id
  belongId: string;
  // 申请组织Id
  applyId: string;
  // 办事实例id
  instanceId: string;
  // 身份Id
  identityId: string;
  // 内容
  content: string;
  // 备注
  remark: string;
  // 办事节点记录
  records: XWorkRecord[] | undefined;
  // 办事节点
  node: XWorkNode | undefined;
  // 办事的定义
  instance: XWorkInstance | undefined;
} & Xbase;

//办事任务
export type XWorkTaskHistory = {
  // 办事定义节点id
  nodeId: string;
  // 办事实例id
  instanceId: string;
  // 办事节点记录
  records: XWorkRecord[] | undefined;
  // 办事节点
  node: XWorkNode | undefined;
  // 办事的定义
  instance: XWorkInstance | undefined;
} & Xbase;
