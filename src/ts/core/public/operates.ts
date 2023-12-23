/** 实体的操作 */
export const entityOperates = {
  Open: {
    sort: 3,
    cmd: 'open',
    label: '打开{0}',
    iconType: 'open',
  },
  Design: {
    sort: 4,
    cmd: 'design',
    label: '设计{0}',
    iconType: 'design',
  },
  Update: {
    sort: 11,
    cmd: 'update',
    label: '更新信息',
    iconType: 'update',
  },
  Delete: {
    sort: 24,
    cmd: 'delete',
    label: '标记删除',
    iconType: 'delete',
  },
  Restore: {
    sort: 25,
    cmd: 'restore',
    label: '放回原处',
    iconType: 'restore',
  },
  HardDelete: {
    sort: 26,
    cmd: 'hardDelete',
    label: '彻底删除',
    iconType: 'delete',
  },
  Remark: {
    sort: 100,
    cmd: 'remark',
    label: '详细信息',
    iconType: 'remark',
  },
  QrCode: {
    sort: 101,
    cmd: 'qrcode',
    label: '分享二维码',
    iconType: 'qrcode',
  },
};
/** 文件支持的操作 */
export const fileOperates = {
  SetCommon: {
    sort: 18,
    cmd: 'commonToggle',
    label: '设为常用',
    iconType: 'setCommon',
  },
  DelCommon: {
    sort: 19,
    cmd: 'commonToggle',
    label: '移除常用',
    iconType: 'delCommon',
  },
  Download: {
    sort: 20,
    cmd: 'download',
    label: '下载文件',
    iconType: 'rename',
  },
  Copy: {
    sort: 21,
    cmd: 'copy',
    label: '复制文件',
    iconType: 'copy',
  },
  Move: {
    sort: 22,
    cmd: 'move',
    label: '剪切文件',
    iconType: 'move',
  },
  Parse: {
    sort: 7,
    cmd: 'parse',
    label: '粘贴文件',
    iconType: 'parse',
  },
  Rename: {
    sort: 25,
    cmd: 'rename',
    label: '重命名',
    iconType: 'rename',
  },
  HslSplit: {
    sort: 26,
    cmd: 'hslSplit',
    label: '视频切片',
    iconType: 'video',
  },
};

/** 目录支持的操作 */
export const directoryOperates = {
  Refesh: {
    sort: 4,
    cmd: 'reload',
    label: '刷新目录',
    model: 'outside',
    iconType: 'refresh',
  },
  OpenFolderWithEditor: {
    sort: 10,
    cmd: 'openFolderWithEditor',
    label: '打开项目',
    iconType: 'open',
  },
  NewFile: {
    sort: 5,
    cmd: 'newFile',
    label: '上传文件',
    model: 'outside',
    iconType: 'newFile',
  },
  TaskList: {
    sort: 6,
    cmd: 'taskList',
    label: '上传列表',
    model: 'outside',
    iconType: 'taskList',
  },
  NewDir: {
    sort: 0,
    cmd: 'newDir',
    label: '新建目录',
    iconType: 'newDir',
  },
  NewApp: {
    sort: 1,
    cmd: 'newApp',
    label: '新建应用',
    iconType: '应用',
  },
  Standard: {
    sort: 2,
    cmd: 'standard',
    label: '导入标准模板',
    iconType: '标准',
  },
  Business: {
    sort: 2,
    cmd: 'business',
    label: '导入业务模板',
    iconType: '标准',
  },
  NewSpecies: {
    sort: 3,
    cmd: 'newSpecies',
    label: '新建分类',
    iconType: '分类',
  },
  NewDict: {
    sort: 4,
    cmd: 'newDict',
    label: '新建字典',
    iconType: '字典',
  },
  NewProperty: {
    sort: 5,
    cmd: 'newProperty',
    label: '新建属性',
    iconType: '属性',
  },
  NewWork: {
    sort: 6,
    cmd: 'newWork',
    label: '新建办事',
    iconType: '办事',
  },
  NewModule: {
    sort: 7,
    cmd: 'newModule',
    label: '新建模块',
    iconType: '模块',
  },
  NewForm: {
    sort: 8,
    cmd: 'newForm',
    label: '新建表单',
    iconType: '事项配置',
  },
  NewTransferConfig: {
    sort: 9,
    cmd: 'newTransferConfig',
    label: '新建数据迁移',
    iconType: '数据迁移',
  },
  NewPageTemplate: {
    sort: 11,
    cmd: 'newPageTemplate',
    label: '新建页面模板',
    iconType: '页面模板',
  },
};

/** 目录下新增 */
export const directoryNew = {
  sort: 0,
  cmd: 'new',
  label: '新建更多',
  iconType: 'new',
  menus: [
    directoryOperates.NewDir,
    directoryOperates.NewDict,
    directoryOperates.NewSpecies,
    directoryOperates.NewProperty,
    directoryOperates.NewApp,
    directoryOperates.NewForm,
    directoryOperates.NewTransferConfig,
    directoryOperates.NewPageTemplate,
  ],
};

/** 新建仓库 */
export const newWarehouse = {
  sort: 0,
  cmd: 'newWarehouses',
  label: '仓库管理',
  iconType: 'newWarehouses',
  menus: [
    {
      sort: -1,
      cmd: 'newWarehouse',
      label: '新建仓库',
      iconType: 'newWarehouse',
    },
  ],
};

/** 团队的操作 */
export const teamOperates = {
  applyFriend: {
    sort: 40,
    cmd: 'applyFriend',
    label: '加为好友',
    iconType: 'joinFriend',
  },
  Pull: {
    sort: 30,
    cmd: 'pull',
    model: 'outside',
    label: '邀请成员',
    iconType: 'pull',
  },
  pullIdentity: {
    sort: 31,
    cmd: 'pullIdentity',
    label: '添加角色',
    iconType: 'pullIdentity',
  },
};

/** 用户的操作 */
export const targetOperates = {
  NewCohort: {
    sort: 32,
    cmd: 'newCohort',
    label: '设立群组',
    iconType: '群组',
  },
  NewStorage: {
    sort: 33,
    cmd: 'newStorage',
    label: '设立存储资源',
    iconType: '存储资源',
  },
  NewCompany: {
    sort: 34,
    cmd: 'newCompany',
    label: '设立单位',
    iconType: '单位',
  },
  NewGroup: {
    sort: 35,
    cmd: 'newGroup',
    label: '设立集群',
    iconType: '组织群',
  },
  NewDepartment: {
    sort: 36,
    cmd: 'newDepartment',
    label: '设立部门',
    iconType: '部门',
  },
  JoinCompany: {
    sort: 41,
    cmd: 'joinCompany',
    label: '加入单位',
    iconType: 'joinCompany',
    model: 'outside',
  },
  JoinGroup: {
    sort: 42,
    cmd: 'joinGroup',
    label: '加入集群',
    iconType: '组织群',
    model: 'outside',
  },
  JoinStorage: {
    sort: 43,
    cmd: 'joinStorage',
    label: '加入存储资源群',
    iconType: '存储资源',
    model: 'outside',
  },
  Chat: {
    sort: 15,
    cmd: 'openChat',
    label: '打开会话',
    iconType: '群组',
  },
  Activate: {
    sort: 15,
    model: 'outside',
    cmd: 'activate',
    label: '激活存储',
    iconType: '激活',
  },
};

/** 人员的申请 */
export const personJoins = {
  sort: 1,
  cmd: 'join',
  label: '申请加入',
  iconType: 'join',
  menus: [
    {
      sort: 40,
      cmd: 'joinFriend',
      label: '添加好友',
      iconType: 'joinFriend',
      model: 'outside',
    },
    {
      sort: 41,
      cmd: 'joinCohort',
      label: '加入群组',
      iconType: 'joinCohort',
      model: 'outside',
    },
    {
      sort: 42,
      cmd: 'joinCompany',
      label: '加入单位',
      iconType: 'joinCompany',
    },
  ],
};

/** 成员操作 */
export const memberOperates = {
  SettingAuth: {
    sort: 56,
    model: 'outside',
    cmd: 'settingAuth',
    label: '权限设置',
    iconType: '权限',
  },
  SettingIdentity: {
    sort: 57,
    model: 'outside',
    cmd: 'settingIdentity',
    label: '角色设置',
    iconType: '角色',
  },
  SettingStation: {
    sort: 58,
    model: 'outside',
    cmd: 'settingStation',
    label: '岗位设置',
    iconType: '岗位',
  },
  Copy: {
    sort: 59,
    cmd: 'copy',
    label: '分配成员',
    iconType: 'copy',
  },
  Remove: {
    sort: 60,
    cmd: 'remove',
    label: '移除成员',
    iconType: 'remove',
  },
  Exit: {
    sort: 60,
    cmd: 'exit',
    label: '退出',
    iconType: 'exit',
  },
};

/** 会话操作 */
export const sessionOperates = {
  SetNoReaded: {
    sort: 58,
    model: 'outside',
    cmd: 'readedToggle',
    label: '标记未读',
    iconType: 'setNoReaded',
  },
  SetReaded: {
    sort: 59,
    model: 'outside',
    cmd: 'readedToggle',
    label: '标记已读',
    iconType: 'setReaded',
  },
  SetToping: {
    sort: 60,
    model: 'outside',
    cmd: 'topingToggle',
    label: '设为常用',
    iconType: 'setCommon',
  },
  RemoveToping: {
    sort: 61,
    model: 'outside',
    cmd: 'topingToggle',
    label: '取消常用',
    iconType: 'delCommon',
  },
  RemoveSession: {
    sort: 62,
    model: 'outside',
    cmd: 'removeSession',
    label: '移除会话',
    iconType: 'delete',
  },
};
