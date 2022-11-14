export namespace CertificateType {
  interface OperationType {
    key: string;
    label: string;
    onClick: () => void;
  }

  //证书管理 数据类型
  interface cerManageType{
    id: string;
    cardName:String;
    network:String;
    adddress:String;
    joinDate:String;
  }
}
