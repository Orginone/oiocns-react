export const dataSource = [
  {
    key: 'caption',
    caption: '测试1',
    marketId: '吴彦祖',
    typeName: '吴',
    sellAuth: '14567849504',
  },
  {
    key: 'caption1',
    caption: '测试2',
    marketId: '黄家驹',
    typeName: '黄',
    sellAuth: '14567364435',
  },
  {
    key: 'caption1',
    caption: '测试2',
    marketId: '黄家驹',
    typeName: '黄',
    sellAuth: '14567364435',
  },
  {
    key: 'caption1',
    caption: '测试2',
    marketId: '黄家驹',
    typeName: '黄',
    sellAuth: '14567364435',
  },
  {
    key: 'caption1',
    caption: '测试2',
    marketId: '黄家驹',
    typeName: '黄',
    sellAuth: '14567364435',
  },
  {
    key: 'caption1',
    caption: '测试2',
    marketId: '黄家驹',
    typeName: '黄',
    sellAuth: '14567364435',
  },
  {
    key: 'caption1',
    caption: '测试2',
    marketId: '黄家驹',
    typeName: '黄',
    sellAuth: '14567364435',
  },
  {
    key: 'caption1',
    caption: '测试2',
    marketId: '黄家驹',
    typeName: '黄',
    sellAuth: '14567364435',
  },
];

interface DataType {
  key: React.ReactNode;
  id: string;
  name: string;
  code: string;
  remark: string;
  public: boolean;
  parentId?: string;
  status?: string;
  children?: DataType[];
}

// 角色对象编辑数据
export const ObjectManagerList: DataType[] = [
  {
    key: '361356410044420096',
    id: '1',
    name: '管理员',
    code: 'super-admin',
    remark: '组织最高管理者角色',
    public: true,
    children: [
      {
        key: '361356410623234048',
        id: '2',
        name: '关系管理员',
        code: 'relation-admin',
        remark: '组织内关系管理角色',
        parentId: '361356410044420096',
        public: true,
      },
      {
        key: '361356410698731520',
        id: '3',
        name: '物资管理员',
        code: 'thing-admin',
        remark: '组织内物资管理角色',
        parentId: '361356410044420096',
        public: true,
        children: [
          {
            key: '361356410774228992',
            id: '5',
            name: '应用管理员',
            code: 'application-admin',
            remark: '组织内应用管理角色',
            parentId: '361356410698731520',
            public: true,
          },
        ],
      },
      {
        key: '361356410849726464',
        id: '4',
        name: '商店管理员',
        code: 'market-admin',
        remark: '组织内商店管理角色',
        parentId: '361356410044420096',
        public: true,
      },
    ],
  },
];
