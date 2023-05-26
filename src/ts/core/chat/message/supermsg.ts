/** 归属会话消息 */
export interface IChatMessage {
  /** 超级管理权选择的项 */
  chatIds: string[];
}

class SuperMsg {
  constructor() {
    this.chatIds = [];
  }
  chatIds: string[];

  public getSuperChatIds = (chatids: string[]) => {
    this.chatIds = chatids;
  };
}

const SuperMsgs = new SuperMsg();

export default SuperMsgs;
