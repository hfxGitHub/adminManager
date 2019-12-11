export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      // { path: '/user/register', component: './User/Register' },
      // { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },

  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['超级管理员'],
    routes: [
      { path: '/index', redirect: '/list/table-list' },
      {
        name: '用户管理',
        path: '/UserList',
        icon: 'user',
        component: './UserList/index',
      },
      {
        name: '药品管理',
        path: '/Drug',
        icon: 'inbox',
        component: './Drug/drug',
      },
      {
        name: '药品分组管理',
        path: '/DrugGroup',
        icon: 'inbox',
        component: './DrugGroup/drug',
      },
      {
        path: '/Common',
        icon: 'bars',
        name: '留言管理',
        component: './Common/common',
      },
      {
        path: '/Notices',
        icon: 'message',
        name: '公告管理',
        component: './Notices/Notices',
      },
      {
        path: '/Order',
        icon: 'tag',
        name: '订单管理',
        component: './Order/order',
      },
      {
        path: '/Questionnaire',
        icon: 'tag',
        name: '问卷中心',
        component: './Questionnaire/questionnaire',
      },
      {
        name: 'exception',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            hideInMenu: true,
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            hideInMenu: true,
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            hideInMenu: true,
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
