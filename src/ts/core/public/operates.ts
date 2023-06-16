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
    iconType: 'newApp',
  },
  NewSpecies: {
    cmd: 'newSpecies',
    label: '新建分类',
    iconType: 'newSpecies',
  },
  NewDict: {
    cmd: 'newDict',
    label: '新建字典',
    iconType: 'newDict',
  },
  NewProperty: {
    cmd: 'newProperty',
    label: '新建属性',
    iconType: 'newProperty',
  },
  NewThingConfig: {
    cmd: 'newThingConfig',
    label: '新建实体配置',
    iconType: 'newThingConfig',
  },
  NewWorkConfig: {
    cmd: 'newWorkConfig',
    label: '新建事项配置',
    iconType: 'newWorkConfig',
  },
};

/** 目录下新增 */
export const directoryNew = {
  cmd: '-',
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
    iconType: 'newIdentity',
  },
  NewCohort: {
    cmd: 'newCohort',
    label: '设立群组',
    iconType: 'newCohort',
  },
  NewCompany: {
    cmd: 'newCompany',
    label: '设立单位',
    iconType: 'newCompany',
  },
  NewGroup: {
    cmd: 'newGroup',
    label: '设立集群',
    iconType: 'newGroup',
  },
  NewDepartment: {
    cmd: 'newDepartment',
    label: '设立部门',
    iconType: 'newDepartment',
  },
  NewStation: {
    cmd: 'newStation',
    label: '设立岗位',
    iconType: 'newStation',
  },
  SettingAuth: {
    cmd: 'settingAuth',
    label: '权限设置',
    iconType: 'settingAuth',
  },
};
