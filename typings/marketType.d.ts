export namespace MarketTypes {
  interface OperationType {
    key: string;
    label: string;
    onClick: () => void;
  }
  // 市场信息类型
  interface MarketType {
    code: string;
    createTime: string;
    createUser: string;
    id: string;
    name: string;
    public: boolean;
    remark: string;
    samrId: string;
    status: number;
    updateTime: string;
    updateUser: string;
    version: string;
  }

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
  // 应用资源 数据类型
  interface AppResourcesType {
    name: string;
    link: string;
    code: string;
    privateKey: string;
    customId?: number;
    flows: any;
    components: any;
  }
}

export namespace AppTypes {
  interface goodType {
    caption: string;
    createTime: string;
    createUser: string;
    id: string;
    marketId: string;
    product: MarketTypes.ProductType;

    productId: string;
    sellAuth: string;
    status: number;
    updateTime: string;
    updateUser: string;
    version: string;
  }
}
