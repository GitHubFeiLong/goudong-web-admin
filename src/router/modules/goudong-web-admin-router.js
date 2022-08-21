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
        component: () => import('@/views/user/components/CreateUser'),
        name: '创建用户',
        hidden: true,
        meta: {
          title: '创建用户',
          noCache: true,
          activeMenu: '/user/page'
        },
      },
      {
        path: 'directive',
        component: () => import('@/views/user/directive'),
        name: '角色管理',
        meta: {
          title: '角色管理',
          noCache: true
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/user/role'),
        name: 'RolePermission1',
        meta: {
          title: '菜单管理',
          roles: ['ROLE_ADMIN']
        }
      }
    ]
  }
]

export default goudongWebAdminRouter
