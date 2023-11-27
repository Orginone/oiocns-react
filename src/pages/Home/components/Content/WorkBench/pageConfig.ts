type CmdBtnItemType = { cmd: string; title: string; iconType: string };

const SYS_AXW = window.location.hostname.startsWith('anxinwu');
//默认公共配置
const OrgCmdBtns: CmdBtnItemType[] = [
  { cmd: 'joinFriend', title: '添加好友', iconType: 'joinFriend' },
  { cmd: 'joinStorage', title: '申请存储', iconType: '存储资源' },
  { cmd: 'newCohort', title: '创建群组', iconType: '群组' },
  { cmd: 'joinCohort', title: '加入群聊', iconType: 'joinCohort' },
  { cmd: 'newCompany', title: '设立单位', iconType: '单位' },
  { cmd: 'joinCompany', title: '加入单位', iconType: 'joinCompany' },
];
//默认公共配置安心屋配置
const AxwCmdBtns: CmdBtnItemType[] = [
  { cmd: 'joinFriend', title: '添加好友', iconType: 'joinFriend' },
  { cmd: 'newCohort', title: '创建群聊', iconType: '群组' },
  { cmd: 'joinCohort', title: '加入群聊', iconType: 'joinCohort' },
  { cmd: 'newCompany', title: '新建单位', iconType: '单位' },
  { cmd: 'joinCompany', title: '加入单位', iconType: 'joinCompany' },
  { cmd: 'joinStorage', title: '申请资源', iconType: '存储资源' },
];
/*办事数据 */
const WorkDatas = [
  { title: '待办', count: 'todoCount' },
  { title: '已办', count: 'CompletedCount' },
  { title: '抄送', count: 'CopysCount' },
  { title: '发起的', count: 'ApplyCount' },
];

/*快捷操作 */
const CmdBtns: CmdBtnItemType[] = SYS_AXW ? AxwCmdBtns : OrgCmdBtns;

export { CmdBtns, SYS_AXW, WorkDatas };
export type { CmdBtnItemType };
