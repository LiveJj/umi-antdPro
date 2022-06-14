export default [
  {
    path: '/',
    redirect: '/welcome',
  },
  //登录
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: '首页',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/banner',
    name: '轮播',
    icon: 'icon-lunboxiaoguo',
    component: './Banner',
  },
  {
    path: '/bancopy',
    name: '轮播2',
    icon: 'icon-lunboxiaoguo',
    component: './Bancopy',
  },
];
