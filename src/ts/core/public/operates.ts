/** 实体的操作 */
export const entityOperates = {
  Open: {
    cmd: 'open',
    label: '打开',
    iconType: 'open',
  },
  Update: {
    cmd: 'update',
    label: '更新信息',
    iconType: 'update',
  },
  Remark: {
    cmd: 'remark',
    label: '详细信息',
    iconType: 'remark',
  },
  QrCode: {
    cmd: 'qrcode',
    label: '分享二维码',
    iconType: 'qrcode',
  },
};
/** 文件支持的操作 */
export const fileOperates = {
  Copy: {
    cmd: 'copy',
    label: '复制到',
    iconType: 'copy',
  },
  Move: {
    cmd: 'move',
    label: '移动到',
    iconType: 'move',
  },
  Rename: {
    cmd: 'rename',
    label: '重名名',
    iconType: 'rename',
  },
  Delete: {
    cmd: 'delete',
    label: '彻底删除',
    iconType: 'delete',
  },
};

/** 目录支持的操作 */
export const directoryOperates = {
  Refesh: {
    cmd: 'refresh',
    label: '刷新目录',
    iconType: 'refresh',
  },
  NewDir: {
    cmd: 'newDir',
    label: '新建目录',
    iconType: 'newDir',
  },
  NewApp: {
    cmd: 'newApp',
    label: '新建应用',
    iconType: '应用',
  },
  NewSpecies: {
    cmd: 'newSpecies',
    label: '新建分类',
    iconType: '分类',
  },
  NewDict: {
    cmd: 'newDict',
    label: '新建字典',
    iconType: '字典',
  },
  NewProperty: {
    cmd: 'newProperty',
    label: '新建属性',
    iconType: '属性',
  },
  NewThingConfig: {
    cmd: 'newThingConfig',
    label: '新建实体配置',
    iconType: '实体配置',
  },
  NewWorkConfig: {
    cmd: 'newWorkConfig',
    label: '新建事项配置',
    iconType: '事项配置',
  },
};

/** 目录下新增 */
export const directoryNew = {
  cmd: '',
  label: '新建配置',
  iconType: 'new',
  menus: [
    directoryOperates.NewDict,
    directoryOperates.NewSpecies,
    directoryOperates.NewProperty,
    directoryOperates.NewApp,
    directoryOperates.NewThingConfig,
    directoryOperates.NewWorkConfig,
  ],
};

/** 团队的操作 */
export const teamOperates = {
  Pull: {
    cmd: 'pull',
    label: '邀请成员',
    iconType: 'pull',
  },
  pullIdentity: {
    cmd: 'pullIdentity',
    label: '添加角色',
    iconType: 'pullIdentity',
  },
};

/** 用户的操作 */
export const targetOperates = {
  NewIdentity: {
    cmd: 'newIdentity',
    label: '设立角色',
    iconType: '角色',
  },
  NewCohort: {
    cmd: 'newCohort',
    label: '设立群组',
    iconType: '群组',
  },
  NewCompany: {
    cmd: 'newCompany',
    label: '设立单位',
    iconType: '单位',
  },
  NewGroup: {
    cmd: 'newGroup',
    label: '设立集群',
    iconType: '组织群',
  },
  NewDepartment: {
    cmd: 'newDepartment',
    label: '设立部门',
    iconType: '部门',
  },
  NewStation: {
    cmd: 'newStation',
    label: '设立岗位',
    iconType: '岗位',
  },
  SettingAuth: {
    cmd: 'settingAuth',
    label: '权限设置',
    iconType: '权限',
  },
};

/** 人员的申请 */
export const personJoins = {
  cmd: '',
  label: '申请加入',
  iconType: 'join',
  menus: [
    {
      cmd: 'joinFriend',
      label: '添加好友',
      iconType: 'joinFriend',
    },
    {
      cmd: 'joinCohort',
      label: '加入群组',
      iconType: 'joinCohort',
    },
    {
      cmd: 'joinCompany',
      label: '加入单位',
      iconType: 'joinCompany',
    },
  ],
};
