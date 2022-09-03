/** 自定义的菜单路由配置 **/

import Layout from '@/layout'

const goudongWebAdminRouter = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/page',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '用户管理',
      icon: 'peoples',
      roles: ['ROLE_ADMIN'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/user/index'),
        name: '用户列表', // 使用name属性，才有面包屑
        meta: {
          title: '用户列表',
          roles: ['ROLE_ADMIN'] // or you can only set roles in sub nav
        },
      },
      {
        path: 'create-user',
        component: () => import('@/views/user/components/CreateUserDialog'),
        name: '新增用户',
        hidden: true,
        meta: {
          title: '新增用户',
          activeMenu: '/user/page'
        },
      },
      {
        path: 'role',
        component: () => import('@/views/role/index'),
        name: '角色列表', // 使用name属性，才有面包屑
        meta: {
          title: '角色列表',
          roles: ['ROLE_ADMIN'] // or you can only set roles in sub nav
        },
      },
    ]
  }
]

export default goudongWebAdminRouter
