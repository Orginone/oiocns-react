
export type ChatMsgInfo = {
  id: number;
  spaceId: number;
  fromId: number;
  toId: number;
  msgType: string;
  msgBody: string;
  createTime: string;
};

export type CohortMsgReq = {
  cohortId: number;
  offset: number;
  limit: number;
  filter?: string;
};

export type FriendMsgReq = {
  spaceId: number;
  friendId: number;
  offset: number;
  limit: number;
  filter?: string;
};

export type SendMsgReq = {
  spaceId: number;
  fromId: number;
  toId: number;
  msgType: string;
  msgBody: string;
};

