// ## http://anyinone.com:800/orginone/organization/person/token/info
export interface Obj {
  userId: string;
  spaceId: string;
  identitys: {
    id: string;
    name: string;
    code: string;
    remark: string;
    authId: string;
    belongId: string;
    status: number;
    createUser: string;
    updateUser: string;
    version: string;
    createTime: string;
    updateTime: string;
    authority: {
      id: string;
      name: string;
      code: string;
      remark: string;
      public: boolean;
      status: number;
      createUser: string;
      updateUser: string;
      version: string;
      createTime: string;
      updateTime: string;
    };
  }[];
  userInfo: {
    id: string;
    name: string;
    code: string;
    typeName: string;
    thingId: string;
    status: number;
    createUser: string;
    updateUser: string;
    version: string;
    createTime: string;
    updateTime: string;
    team: {
      id: string;
      name: string;
      code: string;
      targetId: string;
      remark: string;
      status: number;
      createUser: string;
      updateUser: string;
      version: string;
      createTime: string;
      updateTime: string;
    };
  };
  spaceInfo: {
    id: string;
    name: string;
    code: string;
    typeName: string;
    thingId: string;
    status: number;
    createUser: string;
    updateUser: string;
    version: string;
    createTime: string;
    updateTime: string;
    team: {
      id: string;
      name: string;
      code: string;
      targetId: string;
      remark: string;
      status: number;
      createUser: string;
      updateUser: string;
      version: string;
      createTime: string;
      updateTime: string;
    };
  };
}
