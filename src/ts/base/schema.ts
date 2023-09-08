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
  // 共享用户
  shareId: string;
  // 归属用户
  belongId: string;
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

//应用定义
export type XApplication = {
  // 目录ID
  directoryId: string;
  // 父ID
  parentId: string;
  // 应用资源
  resource: string;
  // 应用下的办事
  defines: XWorkDefine[] | undefined;
  // 应用的结构
  parent: XApplication | undefined;
  // 应用的结构
  nodes: XApplication[] | undefined;
  // 应用的目录
  directory: XDirectory | undefined;
} & XEntity;

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

//度量特性定义
export type XAttribute = {
  // 名称
  name: string;
  // 编号
  code: string;
  // 规则
  rule: string;
  // 备注
  remark: string;
  // 工作职权Id
  authId: string;
  // 属性Id
  propId: string;
  // 单Id
  formId: string;
  // 归属用户ID
  belongId: string;
  // 关联的各组织属性
  linkPropertys: XProperty[] | undefined;
  // 属性关系
  links: XAttrLinkProp[] | undefined;
  // 关联属性
  property: XProperty | undefined;
  // 单
  form: XForm | undefined;
  // 工作职权
  authority: XAuthority | undefined;
  // 创建度量标准的用户
  belong: XTarget | undefined;
} & Xbase;

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
  // 权限可操作的度量
  autAttrs: XAttribute[] | undefined;
} & XEntity;

//目录定义
export type XDirectory = {
  // 父目录ID
  parentId: string;
  // 共享用户ID
  shareId: string;
  // 目录下的属性
  propertys: XProperty[] | undefined;
  // 目录下的单
  forms: XForm[] | undefined;
  // 目录下的分类
  species: XSpecies[] | undefined;
  // 目录下的应用
  applications: XApplication[] | undefined;
  // 目录的结构
  parent: XDirectory | undefined;
  // 目录的结构
  nodes: XDirectory[] | undefined;
} & XEntity;
export type schemaType = {
  displayType: 'row' | 'column';
  type: 'object';
  labelWidth: number | string;
  properties: Record<string, object>;
  column: 1 | 2 | 3;
};
//单定义
export type XForm = {
  // 单布局
  rule: string;
  // 目录ID
  directoryId: string;
  // 单的特性
  attributes: XAttribute[] | undefined;
  // 使用单的流程节点
  bindNodes: XWorkNode[] | undefined;
  // 单的目录
  directory: XDirectory | undefined;
  schema: schemaType;
} & XEntity;

//身份证明
export type XIdProof = {
  // 身份ID
  identityId: string;
  // 对象ID
  targetId: string;
  // 岗位Id
  teamId: string;
  // 身份证明证明的用户
  target: XTarget | undefined;
  // 身份证明证明的身份
  identity: XIdentity | undefined;
} & Xbase;

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

//属性定义
export type XProperty = {
  // 值类型
  valueType: string;
  // 附加信息
  info: string;
  // 计量单位
  unit: string;
  // 目录ID
  directoryId: string;
  // 标签ID
  speciesId: string;
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
  // 属性的目录
  directory: XDirectory | undefined;
  // 字典类型
  species: XSpecies | undefined;
} & XEntity;

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

//分类标签
export type XSpecies = {
  // 目录ID
  directoryId: string;
  // 来源用户ID
  sourceId: string;
  // 分类的类目
  speciesItems: XSpeciesItem[] | undefined;
  // 使用该分类的度量属性
  speciesProps: XProperty[] | undefined;
  // 分类的目录
  directory: XDirectory | undefined;
} & XEntity;

//分类类目
export type XSpeciesItem = {
  // 附加信息
  info: string;
  // 父类目ID
  parentId: string;
  // 分类ID
  speciesId: string;
  // 字典类型
  species: XSpecies | undefined;
  // 类目的结构
  parent: XSpeciesItem | undefined;
  // 类目的结构
  nodes: XSpeciesItem[] | undefined;
} & XEntity;

//用户
export type XTarget = {
  // 开放组织
  public: boolean;
  // 元数据
  thingId: string;
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
  // 该用户创建的分类
  specieses: XSpecies[] | undefined;
  // 该用户创建的类目
  speciesItems: XSpeciesItem[] | undefined;
  // 该用户创建的目录
  directorys: XDirectory[] | undefined;
  // 该用户创建的应用
  applications: XApplication[] | undefined;
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
  targets: XTarget[] | undefined;
  // 用户物的本质
  thing: XThing | undefined;
  // 归属用户的办事定义
  defines: XWorkDefine[] | undefined;
  // 归属用户的办事实例
  instances: XWorkInstance[] | undefined;
} & XEntity;

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

//(物/存在)
export type XThing = {
  // 链上ID
  chainId: string;
  // 名称
  name: string;
  // 编号
  code: string;
  // 共享容器ID
  shareId: string;
  // 归属用户ID
  belongId: string;
  // 备注
  remark: string;
  // 物的属性集
  thingPropValues: XThingProp[] | undefined;
  // 物作为管理对象的映射
  target: XTarget | undefined;
  // 给物的度量标准
  givenPropertys: XProperty[] | undefined;
  // 物的归属
  belong: XTarget | undefined;
} & Xbase;

//物的属性值
export type XThingProp = {
  // 属性ID
  propId: string;
  // 元数据ID
  thingId: string;
  // 值
  value: string;
  // 度量的标准
  property: XProperty | undefined;
  // 度量的物
  thing: XThing | undefined;
} & Xbase;

//办事定义
export type XWorkDefine = {
  // 规则
  rule: string;
  // 应用ID
  applicationId: string;
  // 共享用户ID
  shareId: string;
  // 允许新增
  allowAdd: boolean;
  // 允许变更
  allowEdit: boolean;
  // 允许选择
  allowSelect: boolean;
  // 办事定义节点
  nodes: XWorkNode[] | undefined;
  // 办事的实例
  instances: XWorkInstance[] | undefined;
  // 应用
  application: XApplication | undefined;
  // 归属用户
  target: XTarget | undefined;
} & XEntity;

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
  // 回调钩子
  hook: string;
  // 申请用户ID
  applyId: string;
  // 共享用户ID
  shareId: string;
  // 归属用户ID
  belongId: string;
  // 备注
  remark: string;
  // 办事任务
  tasks: XWorkTask[] | undefined;
  // 办事的定义
  define: XWorkDefine | undefined;
  // 归属用户
  target: XTarget | undefined;
} & Xbase;

//办事定义节点
export type XWorkNode = {
  // 节点规则
  rule: string;
  // 节点编号
  code: string;
  // 节点名称
  name: string;
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
  // 备注
  remark: string;
  // destType
  destType: string;
  // 节点类型
  nodeType: string;
  // 办事实例任务
  tasks: XWorkTask[] | undefined;
  // 赋予身份的用户
  bindFroms: XForm[] | undefined;
  // 办事的定义
  define: XWorkDefine | undefined;
} & Xbase;

//办事节点绑定
export type XWorkNodeRelation = {
  // 单类型
  fromType: string;
  // 办事节点
  nodeId: string;
  // 单设计
  formId: string;
} & Xbase;

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

//办事任务
export type XWorkTask = {
  // 任务标题
  title: string;
  // 审批类型
  approveType: string;
  // 任务类型
  taskType: string;
  // 审批人数
  count: number;
  // 审批身份Id
  identityId: string;
  // 办事定义节点id
  nodeId: string;
  // 办事实例id
  instanceId: string;
  // 流程任务Id
  defineId: string;
  // 任务的用户Id
  shareId: string;
  // 归属用户ID
  belongId: string;
  // 申请用户ID
  applyId: string;
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

/* 表单规则类型 */
export type XFormRule = {
  id: string;
  /* 规则名称 */
  name: string;
  /* 规则类型 */
  ruleType: 'method' | 'formula';
  /* 触发方式 初始化-修改时-提交时 */
  trigger: 'Start' | 'Running' | 'Submit';
  /* 规则支持的数据类型 */
  accept: string[];
  /* 规则关联特性 */
  linkAttrs: any[];
  /* 关联项最大数量 */
  max?: number;
  /* 规则是否可扩展关联项 */
  isExtend: boolean;
  /* 错误提示 */
  errorMsg: string;
  /* 规则执行函数构造器 */
  creatFun?: string;
  /* 规则执行函数 */
  content: Function;
  /* 备注 */
  remark: string;
};
/* 表单规则类型 */
export type FormRuleType = {
  /* 规则数据 */
  list: XFormRule[];
  /* 设计展示数据 */
  schema: any;
};
/* 表单特性规则类型 */
export type AttrRuleType = {
  /* 标题 */
  name: string;
  /* 编号 */
  code: string;
  /* 字段是否显示在输入区域 */
  hidden?: boolean;
  /* 字段是否只读 */
  readonly?: boolean;
  /*是否必填 */
  required?: boolean;
  allowClear?: boolean;
  maxLength?: number;
  minLength?: number;
  /* 数值类型 最小值 */
  min?: number;
  /* 数值类型 最大值 */
  max?: number;
  /* 展示组件类型 */
  widget?: string;
  /* 输入提示 */
  placeholder?: string;
  /* 管理权限 */
  authId?: string;
  /* 特性定义 */
  remark?: string;
  /* 正则校验 */
  rules: string;
  /* 规则数据 */
  list?: XFormRule[];
  /*  设计展示数据 */
  schema: any;
};
//报表定义
export type XReport = {
  // 报表布局
  rule: string;
  // 目录ID
  directoryId: string;
  // 报表的特性
  attributes: XAttribute[] | undefined;
  // 使用报表的流程节点
  bindNodes: XWorkNode[] | undefined;
  // 报表的目录
  directory: XDirectory | undefined;
} & XEntity;

// 文件项
export type XFileInfo = {
  directoryId: string;
  collName: string;
} & XEntity;

// 请求定义
export type XRequest = {
  axios: any;
  params: readonly any[];
  headers: readonly any[];
  curTab: string;
  envId?: string;
  suffixExec?: string;
} & XFileInfo;

// 链接定义
export type XLink = {
  data: any;
} & XFileInfo;

// 环境定义
export type XEnvironment = {
  kvs: { [key: string]: string | undefined };
} & XFileInfo;

// 映射定义
export type XMapping = {
  sourceForm: XForm;
  sourceAttrs: XAttribute[];
  targetForm: XForm;
  targetAttrs: XAttribute[];
  mappings: {
    sourceAttr: XAttribute;
    targetAttr: XAttribute;
    options?: { [key: string]: string };
  }[];
} & XFileInfo;

// 脚本配置
export type XExecutable = {
  coder: string;
} & XFileInfo;
