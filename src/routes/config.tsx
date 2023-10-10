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
      },
      {
        path: '/store',
        title: '存储',
        icon: 'icon-store',
      },
      {
        path: '/setting',
        title: '设置',
        icon: 'icon-setting',
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
