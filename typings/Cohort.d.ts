export namespace CohortConfigType {
    interface OperationType {
      key: string;
      label: string;
      onClick: () => void;
    }
  
    //群组设置 数据类型
    interface CohortConfig{
      id: string;
      name:String;
      code:String;
      typeName:String;
      belongId:String;
      thingId:String;
      status:number;
      createUser:String;
      updateUser:String;
      varsion:String;
      createTime:String;
      team:CohortConfigTeam[];
      updateTime:String;
    }
    //群组设置 数据类型
    interface CohortConfigTeam{
      id: string;
      name:String;
      code:String;
      typeName:String;
      status:number;
      remark:String
      targetId:String;
      varsion:String;
      createTime:String;
      updateTime:String;
      belongId:String;
      thingId:String;

    }
  }
  