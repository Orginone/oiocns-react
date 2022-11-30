export const deptList = [
  {
    name: '部门一',
    id: '1',
    children: [
      {
        name: '张三',
        id: '101',
      },
      {
        name: '李四',
        id: '102',
      },
      {
        name: '王五',
        id: '103',
      },
    ],
  },
  {
    name: '部门二',
    id: '2',
    children: [
      {
        name: '赵六',
        id: '201',
      },
      {
        name: '戴安娜',
        id: '202',
      },
      {
        name: '莉莉娅',
        id: '203',
      },
    ],
  },
  {
    name: '部门三',
    id: '3',
    children: [
      {
        name: '微古丝',
        id: '301',
      },
      {
        name: '娜美',
        id: '302',
      },
      {
        name: '莫甘娜',
        id: '303',
      },
    ],
  },
];

export const deptArrList = [
  {
    name: '岗位',
    id: '1',
    children: [
      {
        name: '岗位A',
        id: '101',
      },
      {
        name: '岗位B',
        id: '102',
      },
      {
        name: '岗位C',
        id: '103',
      },
      {
        name: '岗位D',
        id: '104',
      },
      {
        name: '岗位E',
        id: '105',
      },
      {
        name: '岗位F',
        id: '106',
      },
      {
        name: '岗位G',
        id: '107',
      },
      {
        name: '岗位H',
        id: '108',
      },
      {
        name: '岗位I',
        id: '109',
      },
      {
        name: '岗位J',
        id: '110',
      },
    ],
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
