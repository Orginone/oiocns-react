// 这里只保留接口名，不能包含路径
const cohort = '/orginone/organization/cohort';
const person = '/orginone/organization/person';
const company = '/orginone/organization/company';
const history = '/orginone/orgchat/history';
const market = '/orginone/appstore/market';
const order = '/orginone/appstore/order';
const product = '/orginone/appstore/product';
const appstore = '/orginone/appstore/market';
const collection = '/orginone/anydata/collection';
const object = '/orginone/anydata/object';
const wflow = '/orginone/organization/workflow';
const bucket = '/orginone/anydata';
export default {
  // 人员接口
  person: {
    applyJoin: person + '/apply/join', //申请加好友
    cancelJoin: person + '/cancel/join', //取消/删除申请
    changeWorkspace: person + '/change/workspace', //切换工作空间
    createAPPtoken: person + '/create/app/token', //生成APP访问授权accessToken
    createAuthority: person + '/create/authority', //创建个人角色
    createIdentity: person + '/create/identity', //创建岗位标签
    updateAuthority: person + '/update/authority', //更新个人角色
    updateIdentity: person + '/update/identity', //更新岗位标签
    getAllApply: person + '/get/all/apply', //查询我的申请
    getAllApproval: person + '/get/all/approval', //查询我的审批
    getAuthorityIdentities: person + '/get/authority/identitys', //查询角色岗位
    getAuthority: person + '/get/authoritys', //查询角色
    getFriends: person + '/get/friends', //查询好友
    getIdentityPersons: person + '/get/identity/persons', //查询岗位的人
    getIdentities: person + '/get/identitys', //查询岗位
    getSubAuthority: person + '/get/subauthoritys', //查询子角色
    giveIdentity: person + '/give/identity', //给好友岗位
    joinRefuse: person + '/join/refuse', //加好友拒绝
    joinSuccess: person + '/join/success', //加好友通过
    login: person + '/login', // 登录
    logout: person + '/logout', //注销
    register: person + '/register', // 注册
    queryInfo: person + '/query/info', // 查询当前登录人员详细信息
    tokenInfo: person + '/token/info', //查询当前授信信息
    remove: person + '/remove', //删除好友
    removeIdentity: person + '/remove/identity', //删除好友岗位
    searchPersons: person + '/search/persons', //搜索人员
    update: person + '/update', //变更信息
    reset: person + '/reset/pwd', //重置密码
  },
  cohort: {
    applyJoin: cohort + '/apply/join', //申请加群组
    exit: cohort + '/exit', //退出群组
    create: cohort + '/create', //创建群组
    join: cohort + '/join', // 加群
    createAuthority: cohort + '/create/authority', //创建群组角色
    createIdentity: cohort + '/create/identity', //创建群岗位标签
    updateAuthority: cohort + '/update/authority', //更新个人角色
    updateIdentity: cohort + '/update/identity', //更新岗位标签
    delete: cohort + '/delete', //删除群组
    getAuthIdentity: cohort + '/get/authority/identitys', //查询角色岗位
    getAuthority: cohort + '/get/authoritys', //查询角色
    getIdentityPerson: cohort + '/get/identity/persons', //查询岗位的人
    getIdentitys: cohort + '/get/identitys', //查询岗位
    getJoinedCohorts: cohort + '/get/joined/cohorts', //查询我加入的群
    getPersons: cohort + '/get/persons', //查询群成员
    getSubAuthorities: cohort + '/get/subauthoritys', //查询子角色
    giveIdentity: cohort + '/give/identity', //给群成员岗位
    joinRefuse: cohort + '/join/refuse', //加群组拒绝
    joinSuccess: cohort + '/join/success', //加群组通过
    pullPerson: cohort + '/pull/persons', //拉人进群组
    removeIdentity: cohort + '/remove/identity', //移除群成员岗位
    removePerson: cohort + '/remove/persons', //移除群成员
    searchCohorts: cohort + '/search/cohorts', //搜索群聊
    update: cohort + '/update', //变更群组
  },
  company: {
    exit: company + '/exit', //退出单位
    exitGroup: company + '/exit/group', //退出集团
    applyJoin: company + '/apply/join', //申请加入单位
    applyJoinGroup: company + '/apply/join/group', //申请加入集团
    assignDepartment: company + '/assign/department', //分配部门
    assignJob: company + '/assign/job', //分配岗位
    assignSubgroup: company + '/assign/subgroup', //分配子集团
    create: company + '/create', //创建单位
    createAuthority: company + '/create/authority', //创建组织员工角色
    createDepartment: company + '/create/department', //创建部门
    createGroup: company + '/create/group', //创建集团
    createIdentity: company + '/create/identity', //创建组织员工岗位标签
    updateAuthority: company + '/update/authority', //更新角色
    updateIdentity: company + '/update/identity', //更新岗位标签
    createJob: company + '/create/job', //创建岗位
    createSubgroup: company + '/create/subgroup', //创建子集团
    companyDelete: company + '/delete', //删除单位
    deleteDepartment: company + '/delete/department', //删除部门
    deleteGroup: company + '/delete/group', //删除集团
    deleteJob: company + '/delete/job', //删除岗位
    deleteSubgroup: company + '/delete/subgroup', //删除子集团
    deleteAuthority: company + '/delete/authority', //删除角色
    deleteIdentity: company + '/delete/identity', //删除岗位
    getAuthorityIdentities: company + '/get/authority/identitys', //查询角色岗位
    getAuthorities: company + '/get/authoritys', //查询角色
    getDepartmentPersons: company + '/get/department/persons', //查询部门员工
    getDepartments: company + '/get/departments', //查询部门
    getGroupCompanies: company + '/get/group/companys', //查询集团单位
    companyGetGroups: company + '/get/groups', //查询集团
    getIdentityPersons: company + '/get/identity/persons', //查询岗位的人
    getIdentities: company + '/get/identitys', //查询岗位
    getJobPersons: company + '/get/job/persons', //查询岗位员工
    getJobs: company + '/get/jobs', //查询岗位
    getJoinGroupApply: company + '/get/join/group/apply', //查询加入集团申请
    getJoinedCompany: company + '/get/joined/companys', //查询加入的单位
    getPersons: company + '/get/persons', //查询单位员工
    getSubAuthorities: company + '/get/subauthoritys', //查询子角色
    getSubgroupCompanies: company + '/get/subgroup/companys', //查询子集团单位
    getSubgroups: company + '/get/subgroups', //查询子集团
    giveIdentity: company + '/give/identity', //给员工岗位
    joinApproval: company + '/join/approval', //加申请审批
    joinRefuse: company + '/join/refuse', //加申请拒绝
    joinSuccess: company + '/join/success', //加申请通过
    pullPerson: company + '/pull/persons', //拉人进单位
    pullCompanys: company + '/pull/companys', //拉单位进集团
    queryInfo: company + '/query/info', //查询当前单位详细信息
    removeFromCompany: company + '/remove/from/company', //移除单位成员
    removeFromDepartment: company + '/remove/from/department', //移除部门成员
    removeFromGroup: company + '/remove/from/group', //移除集团成员
    removeFromJob: company + '/remove/from/job', //移除岗位成员
    removeFromSubgroup: company + '/remove/from/subgroup', //移除子集团成员
    removeIdentity: company + '/remove/identity', //移除员工岗位
    searchCompany: company + '/search/companys', //搜索单位
    searchGroups: company + '/search/groups', //搜索单位
    update: company + '/update', //变更单位
    updateDepartment: company + '/update/department', //变更部门
    updateGroup: company + '/update/group', //变更集团
    updateJob: company + '/update/job', //变更岗位
    updateSubGroup: company + '/update/subGroup', //变更子集团
    getAllCohorts: company + '/get/all/cohorts', //查询所有群聊
    getAllDepartments: company + '/get/all/departments', //查询所有部门
    getAllJobs: company + '/get/all/jobs', //查询所有岗位
    getAllSubgroups: company + '/get/all/subgroups', //查询所有子集团
    getCompanyTree: company + '/get/company/tree', //查询单位组织树
    getGroupTree: company + '/get/group/tree', //查询集团组织树
    getAuthorityTree: company + '/get/authority/tree', //查询组织继承角色树
    getAssignedDepartments: company + '/get/assigned/departments', //获取单位空间分配的部门
    getTargetsByAuthority: company + '/get/targets/by/authority', //获取单位空间拥有角色的组织
  },
  market: {
    merchandise: market + '​/approval​/merchandise', //商品上架审核
    create: market + '/create', //创建市场
    createOrderByStaging: market + '/create/order/by/staging', //购物车发起订单
    delete: market + '​/delete', //删除市场
    deleteStaging: market + '/delete/staging', //移除暂存区/购物车
    joinStaging: market + '/staging', //加入暂存区/购物车
    publishMerchandise: market + '​/publish/merchandise', //上架商品
    searchAll: market + '/search/all', //查询所有市场
    searchOwn: market + '/search/own', //查询管理/已加入的市场
    searchJoined: market + '/search/joined', //查询已加入的市场
    searchManager: market + '​/search/manager', //查询自己管理的市场
    searchMerchandise: market + '​/search/merchandise', //查询市场中所有商品
    searchMerchandiseApply: market + '​/search/merchandise/apply', //查询产品上架申请
    searchStaging: market + '/search/staging', //查询购物车
    unpublishMerchandise: market + '/unpublish', //下架商品
    updateMarket: market + '​/update', //更新市场
    getSoftShareInfo: market + '/search/softshare', //获取开放市场信息
  },
  order: {
    orderConfirm: order + '/confirm', //确认订单详情(买方确认收货)
    create: order + '/create', //创建订单
    createPay: order + '/create/pay', //创建支付
    delete: order + '/delete', //删除订单
    reject: order + '/reject', //退还商品
    deleteDetail: order + '/delete/detail', //删除订单详情
    deliverMerchandise: order + '/deliver', //交付订单详情中的商品
    searchBuyList: order + '/search/buy/list', //买方查询购买订单列表
    searchDetailList: order + '/search/detail/list', //查询订单详情信息
    searchMerchandiseSellList: order + '/search/merchandise/sell/list', //卖方查询指定商品售卖订单列表
    searchPayList: order + '/search​/pay/list', //查询订单支付信息
    searchSellList: order + '/search/sell/list', //卖方查询售卖订单列表
    udpate: order + '/update', //更新订单
    updateDetail: order + '/update/detail', //更新订单详情
    cancel: order + '/cancel', //取消订单
    cancelDetail: order + '/cancel/detail', //取消订单
    // cancelBuy: order + '/cancel/buy/detail', //买方取消订单指定详情项
    // cancelSell: order + '/cancel/sell/detail', //卖方取消订单指定详情项
  },
  product: {
    createResource: product + '/create/resource', //创建产品资源
    createResources: product + '/create/resources', //批量创建产品资源
    createShare: product + '/create/share', //共享产品
    createWebappmenu: product + '/create/webappmenu', //创建产品资源菜单
    delete: product + '/delete', //删除产品
    deleteDistributeAuth: product + '/delete/distribute/auth', //取消角色分配
    deleteDistributeTarget: product + '/delete/distribute/target', //取消组织对象的分配
    deleteResource: product + '/delete/resource', //删除产品资源
    deleteShare: product + '/delete/share', //取消指定产品共享
    deleteWebappmenu: product + '/delete/webappmenu', //删除资源菜单
    distributionAuth: product + '/distribution/auth', //根据角色分配产品资源
    distributionTarget: product + '/distribution/target', //分配产品资源至下属组织/个人
    publishMerchandise: product + '/publish/merchandise', //产品所有者上架商品
    queryDistributionAuth: product + '/query/distribution/auth', //查询产品资源角色分配记录
    queryDistributionTarget: product + '/query/distribution/target', //查询产品资源组织/个人分配记录
    queryInfo: product + '/query/info', //查询产品详细信息
    queryOwnResource: product + '/query/own/resource', //查询组织/个人拥有的资源列表
    register: product + '/register', //产品登记
    publish: product + '/publish', //产品登记
    searchUsefulProduct: product + '/search/useful/product', //查询组织/个人可用产品
    searchMerchandiseList: product + '​/search​/merchandise​/List', //根据产品查询产品上架信息
    searchMerchandiseApply: product + '​/search​/merchandise​/apply', //查询产品上架申请
    searchResource: product + '/search/resource', //查询产品资源列表
    searchOwnProduct: product + '/search/own/product', //模糊查找组织/个人产品
    searchPublishList: product + '/search/publish/List', //查询指定产品的上架信息
    searchShare: product + '/search/share', //查询产品共享情况
    searchShareProduct: product + '/search/share/product', //模糊查找共享商品
    searchWebappmenu: product + '/search​/webappmenu', //查询产品资源菜单
    unpublishMerchandise: product + '/unpublish', //下架商品
    update: product + '/update', //更新产品
    updateMerchandise: product + '/update/merchandise', //更新商品信息
    updateResource: product + '/update/resource', //更新产品资源
    updateWebappmenu: product + '/update/webAppMenu', //更新产品资源菜单
    groupShare: product + '/group/share',
    searchGroupShare: product + '/search/group/share',
    deleteGroupShare: product + '/delete/group/share',
    share: product + '/share', //创建针对单位个人的共享
    searchUnitShare: product + '/search/share', //查询
    deleteUnitShare: product + '/delete/share', //删除
    // 不确定是否已存在
    department: product + '/distribution/to/deptment',
    identity: product + '/distribution/to/identity',
    person: product + '/distribution/to/person',
    authority: product + '/distribution/to/authority',
    toDepartment: product + '/search/distribution/to/deptment',
    toIdentity: product + '/search/distribution/to/identity',
    toPerson: product + '/search/distribution/to/person',
    toAuthority: product + '/search/distribution/to/authority',
    delteDeptment: product + '/delete/distribution/to/deptment',
    delteAuthority: product + '/delete/distribution/to/authority',
    delteIdentity: product + '/delete/distribution/to/identity',
    deltePerson: product + '/delete/distribution/to/person',
    extendCreate: product + '/extend/create', //创建产品、资源的扩展
    extendDelete: product + '/extend/delete', // 取消产品、资源的扩展
    extendQuery: product + '/extend/query', // 查询产品、资源的扩展
  },
  // 历史记录
  history: {
    getCohortMsg: history + '/query/cohort/msg', // 获取群聊天历史聊天信息
    getFriendMsg: history + '/query/friend/msg', // 获取好友历史聊天信息
  },
  diyHome: {
    diy: (str: string) => `${str}`,
  },
  appstore: {
    searchOwn: appstore + '/search/own',
    searchJoined: appstore + '/search/joined',
    searchManager: appstore + '/search/manager',
    marketDel: appstore + '/delete',
    merchandise: appstore + '/search/merchandise',
    member: appstore + '/search/member',
    create: appstore + '/create',
    removeMemver: appstore + '/remove/member',
    marketQuit: appstore + '/quit',
    searchAll: appstore + '/search/all',
    applyJoin: appstore + '/apply/join',
    staging: appstore + '/staging',
    searchJoinApplyManager: appstore + '/search/join/apply/manager', //管理员：加入市场申请
    searchJoinApply: appstore + '/search/join/apply', //发起者:查询加入市场申请
    approvalJoin: appstore + '/approval/join', //审批加入市场申请
    cancelJoin: appstore + '/cancel/join', // 取消申请加入市场
    searchManagerPublishApply: appstore + '/search/manager/publish/apply', // 管理员:查询产品上架申请
    approvalPublish: appstore + '/approval/publish', // 审批商品上架申请
    pullTarget: appstore + '/pull/target',
    searchPublishApply: appstore + '/search/publish/apply', // 发起者:查询产品上架申请
  },
  wflow: {
    approvalTask: wflow + '/approval/task', //流程节点审批
    createDefine: wflow + '/create/define', //创建流程定义
    updateDefine: wflow + '/update/define', //更新流程定义
    createRelation: wflow + '/create/flowrelation', //创建流程绑定
    createInstance: wflow + '/create/instance', //创建流程实例
    deleteDefine: wflow + '/delete/define', //删除流程定义
    deleteInstance: wflow + '/delete/instance', //删除流程实例
    deleteRelation: wflow + '/delete/relation', //删除流程绑定
    queryDefine: wflow + '/query/define', //查询流程定义
    queryInstance: wflow + '/query/instance', //查询发起的流程实例
    queryRecord: wflow + '/query/record', //查询审批记录
    queryTask: wflow + '/query/task', //查询待审批任务
    resetDefine: wflow + '/reset/define', //重置流程定义
    findall: wflow + '/procdef/findall', //搜索多个流程
    addDef: wflow + '/procdef/add', //流程定义新增
    updateDef: wflow + '/procdef/update', //流程定义修改
  },
  bucket: {
    bucketObjects: bucket + '/Bucket/Objects', //获取云盘
    bucketShare: bucket + '/Bucket/Share', //云盘分享
    bucketLink: bucket + '/Bucket/Link', //获取云盘
    bucketCreate: bucket + '/Bucket/Create', //创建文件夹
    bucketUpload: bucket + '/Bucket/Upload', //上传
    bucketUploadChunk: bucket + '/Bucket/UploadChunk', //切片上传
    bucketRename: bucket + '/Bucket/Rename', //重命名
    bucketMove: bucket + '/Bucket/Move', //移动
    bucketCopy: bucket + '/Bucket/Copy', //复制
    bucketDelete: bucket + '/Bucket/Delete', //删除文件or文件夹
    bucketDownload: bucket + '/Bucket/Download', //下载文件
  },
  object: {
    get: (objName: string) => object + '/get/' + objName,
    set: (objName: string) => object + '/set/' + objName,
    delete: (objName: string) => object + '/delete/' + objName,
  },
  collection: {
    link: (linkKey: string) => collection + '/link/' + linkKey,
    share: (collName: string) => collection + '/share/' + collName,
    insert: (collName: string) => collection + '/insert/' + collName,
    update: (collName: string) => collection + '/update/' + collName,
    remove: (collName: string) => collection + '/remove/' + collName,
    aggregate: (collName: string) => collection + '/aggregate/' + collName,
  },
  //others
  mock: {
    test: '/api/test',
  },
};
