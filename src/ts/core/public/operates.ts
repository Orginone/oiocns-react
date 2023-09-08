/** 实体的操作 */
export const entityOperates = {
  Open: {
    sort: 10,
    cmd: 'open',
    label: '打开',
    iconType: 'open',
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
    label: '重名名',
    iconType: 'rename',
  },
};

/** 目录支持的操作 */
export const directoryOperates = {
  Refesh: {
    sort: 4,
    cmd: 'refresh',
    label: '刷新目录',
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
    iconType: 'newFile',
  },
  TaskList: {
    sort: 6,
    cmd: 'taskList',
    label: '上传列表',
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
    label: '导入标准',
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
    iconType: '流程',
  },
  NewModule: {
    sort: 7,
    cmd: 'newModule',
    label: '新建模块',
    iconType: '模块',
  },
  NewThingConfig: {
    sort: 8,
    cmd: 'newThingConfig',
    label: '新建实体配置',
    iconType: '实体配置',
  },
  NewWorkConfig: {
    sort: 9,
    cmd: 'newWorkConfig',
    label: '新建事项配置',
    iconType: '事项配置',
  },
  NewReport: {
    sort: 7,
    cmd: 'newReport',
    label: '新建报表',
    iconType: 'newDir',
  },
  NewRequest: {
    sort: 10,
    cmd: 'newRequest',
    label: '新建请求配置',
    iconType: '请求配置',
  },
  BatchRequest: {
    sort: 10,
    cmd: 'batchRequest',
    label: '批量请求配置',
    iconType: '批量请求配置',
  },
  NewLink: {
    sort: 11,
    cmd: 'newLink',
    label: '新建链接配置',
    iconType: '链接配置',
  },
  NewMapping: {
    sort: 12,
    cmd: 'newMapping',
    label: '新建映射配置',
    iconType: '映射配置',
  },
  NewExecutable: {
    sort: 13,
    cmd: 'newExecutable',
    label: '新建脚本配置',
    iconType: '脚本配置',
  },
  NewEnvironment: {
    sort: 14,
    cmd: 'newEnvironment',
    label: '新建环境配置',
    iconType: '环境配置',
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
    directoryOperates.Standard,
    directoryOperates.NewDict,
    directoryOperates.NewSpecies,
    directoryOperates.NewProperty,
    directoryOperates.NewApp,
    directoryOperates.NewThingConfig,
    directoryOperates.NewWorkConfig,
    directoryOperates.NewReport,
  ],
};

/** 数据迁移 */
export const transferNew = {
  sort: 1,
  cmd: 'transfer',
  label: '迁移配置',
  iconType: 'new',
  menus: [
    directoryOperates.NewRequest,
    directoryOperates.BatchRequest,
    directoryOperates.NewLink,
    directoryOperates.NewMapping,
    directoryOperates.NewExecutable,
    directoryOperates.NewEnvironment
  ],
};

/** 团队的操作 */
export const teamOperates = {
  Pull: {
    sort: 30,
    cmd: 'pull',
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
    sort: 33,
    cmd: 'newCohort',
    label: '设立群组',
    iconType: '群组',
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
  Chat: {
    sort: 15,
    cmd: 'openChat',
    label: '打开会话',
    iconType: '群组',
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
    },
    {
      sort: 41,
      cmd: 'joinCohort',
      label: '加入群组',
      iconType: 'joinCohort',
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
    cmd: 'settingAuth',
    label: '权限设置',
    iconType: '权限',
  },
  SettingIdentity: {
    sort: 57,
    cmd: 'settingIdentity',
    label: '角色设置',
    iconType: '角色',
  },
  SettingStation: {
    sort: 58,
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
};
