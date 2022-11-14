//好友/群列表 数据类型
interface userType {
  code: string;
  createTime: string;
  createUser: string;
  id: string;
  name: string;
  status: number;
  thingId: string;
  typeName: string;
  updateTime: string;
  updateUser: string;
  version: string;
  message?: any;
  team?: teamType;
}

// 群数据类型
interface teamType extends userType {
  authId: string;
  remark: string;
  targetId: string;
}

interface ImMsgChildType {
  id: string;
  label?: string;
  name?: string;
  remark?: string;
  typeName?: string;
  msgTime?: string;
  msgType?: string;
  msgBody?: any;
  spaceId?: string;
  noRead?: number;
  showTxt?: string;
  personNum?: number;
  isTop?: boolean; // 是否置顶
}
// 聊天 侧边栏展示列表类型
interface ImMsgType {
  hasTopSession?: boolean; // 是否包含置顶会话
  chats: ImMsgChildType[];
  id: string;
  name: string;
}
