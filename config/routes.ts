export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '/', icon: 'home', component: './Index', name: '主页' },
  { path: '/file', icon: 'file', component: './File', name: '文件上传下载' },
  { path: '/generator', icon: 'code', component: './Generator/Add', name: '代码生成器' },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: "user", path: '/admin/user', component: './Admin/User', name: '用户管理' },
      { icon: "user", path: '/admin/generator', component: './Admin/Generator', name: '生成器管理' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
