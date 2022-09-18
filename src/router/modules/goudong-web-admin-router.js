/** 自定义的菜单路由配置 **/

import Layout from '@/layout'

const goudongWebAdminRouter = [
  {
    path: '/user',
    name: '用户管理',
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
        path: '/usr/page',
        component: () => import('@/views/user/index'),
        name: '用户列表', // 使用name属性，才有面包屑
        meta: {
          title: '用户列表',
          roles: ['ROLE_ADMIN'] // or you can only set roles in sub nav
        },
        children: [
          {
            name: '查询',
            api: true, // 是否是接口
            path: '/api/user/base-user/page',
            method: 'get',
            hidden: true,
          },
          {
            name: '新增',
            api: true, // 是否是接口
            path: '/api/user/base-user/simple-create-user',
            method: 'post',
            hidden: true,
          },
          {
            name: '导出',
            api: true, // 是否是接口
            path: '/api/user/base-user/export',
            method: 'get',
            hidden: true,
          },
          {
            path: '/api/user/base-user/admin/user',
            api: true, // 是否是接口
            name: '编辑',
            method: 'put',
            hidden: true,
          },
          {
            path: '/api/user/base-user/*',
            api: true, // 是否是接口
            name: '删除',
            method: 'delete',
            hidden: true,
          },
        ]
      },
      {
        path: '/user/role',
        component: () => import('@/views/role/index'),
        name: '角色列表', // 使用name属性，才有面包屑
        meta: {
          title: '角色列表',
          roles: ['ROLE_ADMIN'] // or you can only set roles in sub nav
        },
        children: [
          {
            name: '查询',
            api: true, // 是否是接口
            path: '/api/user/base-role/page',
            method: 'get',
            hidden: true,
          },
          {
            name: '新增',
            api: true, // 是否是接口
            path: '/api/user/base-role',
            method: 'post',
            hidden: true,
          },
          {
            name: '编辑',
            api: true, // 是否是接口
            path: '/api/user/base-role',
            method: 'put',
            hidden: true,
          },
          {
            name: '删除',
            api: true, // 是否是接口
            path: '/api/user/base-role/${id}',
            method: 'delete',
            hidden: true,
          }
        ]
      },
    ]
  }
]

export default goudongWebAdminRouter
