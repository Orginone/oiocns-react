export const routerInfo = [
  {
    path: '/passport',
    title: '通行证',
    routes: [
      {
        path: '/passport/login',
        title: '登录',
      },
      {
        path: '/passport/register',
        title: '注册',
      },
      {
        path: '/passport/lock',
        title: '锁屏',
      },
      {
        path: '/passport/forget',
        title: '忘记密码',
      },
    ],
  },
  {
    path: '/',
    title: '通用',
    routes: [
      {
        path: '/home',
        title: '首页',
        icon: '',
      },
      {
        path: '/chat',
        title: '沟通',
        icon: 'icon-message',
      },
      {
        path: '/todo',
        title: '办事',
        icon: 'icon-todo',
        routes: [
          {
            path: '/todo/friend',
            title: '好友申请',
            icon: '',
          },
          {
            path: '/todo/org',
            title: '单位审核',
            icon: '',
          },
          {
            path: '/todo/appAndStore',
            title: '商店审核',
            icon: '',
            routes: [
              {
                path: '/todo/product',
                title: '应用上架',
                icon: '',
              },
              {
                path: '/todo/store',
                title: '加入市场',
                icon: '',
              },
            ],
          },
          {
            path: '/todo/app/:id',
            title: '应用上架',
            icon: '',
          },
          {
            path: '/todo/product',
            title: '应用上架',
            icon: '',
          },
          {
            path: '/todo/store',
            title: '加入市场',
            icon: '',
          },
          {
            path: '/todo/order',
            title: '订单管理',
            icon: '',
          },
          {
            path: '/todo/',
            title: '应用待办',
            icon: '',
          },
        ],
      },
      {
        path: '/store',
        title: '仓库',
        icon: 'icon-store',
        routes: [
          {
            path: '/store/market/shop',
            title: '应用市场',
            icon: 'icon-message',
          },
          {
            path: '/store/app',
            title: '应用',
            icon: '',
            routes: [
              {
                path: '/store/app/publish',
                title: '应用上架列表',
                icon: '',
              },
              {
                path: '/store/app/info',
                title: '应用信息',
                icon: '',
              },
              {
                path: '/store/app/manage',
                title: '应用管理',
                icon: '',
              },
              {
                path: '/store/app/create',
                title: '应用注册',
                icon: '',
              },
              {
                path: '/store/app/putaway',
                title: '应用上架',
                icon: '',
              },
            ],
          },
          {
            path: '/store/doc',
            title: '文档',
            icon: '',
          },
          {
            path: '/store/data',
            title: '数据',
            icon: '',
          },
          {
            path: '/store/assets',
            title: '资源',
            icon: '',
          },
        ],
      },
      {
        path: '/market/shopingcar',
        title: '购物车',
      },
      {
        path: '/market',
        title: '市场',
        icon: 'icon-guangshangcheng',
        routes: [
          {
            path: '/market/shop',
            title: '应用市场',
            icon: 'icon-message',
          },
          {
            path: '/market/docx',
            title: '文档市场',
            icon: 'icon-message',
          },
          {
            path: '/market/data',
            title: '数据市场',
          },
          {
            path: '/market/publicProperty',
            title: '公物仓',
          },
          {
            path: '/market/usermanagement',
            title: '用户管理',
            icon: 'icon-message',
          },
          {
            path: '/market',
            title: '应用市场',
          },
        ],
      },
      {
        path: '/setting',
        title: '设置',
        icon: 'icon-setting',
        routes: [
          {
            path: '/setting/info',
            title: '单位信息',
            icon: '',
          },
          {
            path: '/setting/dept/:id',
            title: '内设机构',
            icon: '',
          },
          {
            path: '/setting/dept',
            title: '内设机构',
            icon: '',
          },
          {
            path: '/setting/position/:id',
            title: '岗位设置',
            icon: '',
          },
          {
            path: '/setting/position',
            title: '岗位设置',
            icon: '',
          },
          {
            path: '/setting/group/:id',
            title: '集团设置',
            icon: 'icon-setting',
          },
          {
            path: '/setting/group',
            title: '集团设置',
            icon: 'icon-setting',
          },
          {
            path: '/setting/friend',
            title: '好友设置',
            icon: '',
          },
          {
            path: '/setting/cohort',
            title: '群组设置',
            icon: '',
          },
          {
            path: '/setting/help',
            title: '帮助中心',
            icon: '',
          },
          {
            path: '/setting/homeset',
            title: '单位首页',
            icon: 'icon-setting',
          },
          {
            path: '/setting/data',
            title: '数据设置',
            icon: 'icon-setting',
          },
          {
            path: '/setting/src',
            title: '资源设置',
            icon: 'icon-setting',
          },
          {
            path: '/setting/app',
            title: '应用设置',
            icon: '',
          },
          {
            path: '/setting/standard',
            title: '标准设置',
            icon: 'icon-setting',
          },
          {
            path: '/setting/auth',
            title: '权限设置',
            icon: '',
          },
        ],
      },
      {
        path: '/person',
        title: '我的',
        icon: '',
        routes: [
          {
            path: '/person/info',
            title: '个人信息',
            icon: '',
          },
          {
            path: '/person/passport',
            title: '通行设置',
            icon: '',
          },
          {
            path: '/person/wallet',
            title: '卡包设置',
            icon: '',
          },
          {
            path: '/person/homeset',
            title: '首页设置',
            icon: '',
          },
          {
            path: '/person/help',
            title: '帮助中心',
            icon: '',
          },
          {
            path: '/person/address',
            title: '地址管理',
            icon: '',
          },
          {
            path: '/person/safe',
            title: '安全管理',
            icon: '',
          },
          {
            path: '/person/message',
            title: '消息设置',
            icon: '',
          },
          {
            path: '/person/theme',
            title: '主题设置',
            icon: '',
          },
          {
            path: '/person/lang',
            title: '语言设置',
            icon: '',
          },
        ],
      },
      {
        path: '/online',
        title: '第三方应用',
      },
      {
        path: '*',
        title: '页面不存在',
      },
    ],
  },
  {
    path: '/noFond',
    title: '页面不存在',
  },
];
