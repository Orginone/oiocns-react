export namespace MarketTypes {
  // 应用/商品数据类型
  interface ProductType {
    authority?: string;
    belongId?: string;
    code: string;
    createTime: string;
    createUser: string;
    endTime: string | boolean | number;
    id: string;
    name: string;
    source: string;
    status: number;
    thingId: string;
    typeName: string;
    updateTime: string;
    updateUser: string;
    public?: boolean;
    version?: string;
    remark?: string;
    icon?: string;
  }
}
