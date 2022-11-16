export namespace CohortConfigType {
    interface OperationType {
      key: string;
      label: string;
      onClick: () => void;
    }
  
    //群组设置 数据类型
    interface CohortConfig{
      id: string;
      name:string;
      code:string;
      typeName:string;
      belongId:string;
      thingId:string;
      status:number;
      createUser:string;
      updateUser:string;
      varsion:string;
      createTime:string;
      team:CohortConfigTeam[];
      updateTime:string;
    }
    //群组设置 数据类型
    interface CohortConfigTeam{
      id: string;
      name:string;
      code:string;
      typeName:string;
      status:number;
      remark:string
      targetId:string;
      varsion:string;
      createTime:string;
      updateTime:string;
      belongId:string;
      thingId:string;

    }
  }
  