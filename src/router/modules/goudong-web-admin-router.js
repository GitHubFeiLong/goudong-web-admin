/** 自定义的菜单路由配置 **/

import Layout from '@/layout'

const goudongWebAdminRouter = [
  {
    path: '/user-management',
    component: Layout,
    redirect: '/user/user-page',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '用户管理',
      icon: 'peoples',
      roles: ['ROLE_ADMIN'] // you can set roles in root nav
    },
    children: [
      {
        path: 'user-page',
        component: () => import('@/views/user-management/user-page'),
        name: '用户列表', // 使用name属性，才有面包屑
        meta: {
          title: '用户列表',
          roles: ['ROLE_ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/user-management/directive'),
        name: '角色管理',
        meta: {
          title: '角色管理'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/user-management/role'),
        name: 'RolePermission1',
        meta: {
          title: '菜单管理',
          roles: ['ROLE_ADMIN']
        }
      }
    ]
  },
]

export default goudongWebAdminRouter
