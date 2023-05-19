export type forwardType = {
  name: string;
  belongId: string;
  toId: string;
  chatdata: {
    chatName: string;
    chatRemark: string;
    fullId: string;
    isToping: boolean;
    labels: Array<string>;
    lastMsgTime: number;
    noReadCount: number;
  };
};
