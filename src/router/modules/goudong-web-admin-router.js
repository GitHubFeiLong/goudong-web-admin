/** 自定义的菜单路由配置 **/

import { treeToArr } from "@/utils/tree";

/**
 * 预先定义好的所有资源
 * <pre>
 *   {
 *     name: "菜单名称，使用name属性，才有面包屑",
 *     type: "菜单类型（0：接口；1：菜单；2：按钮）",
 *     openModel: "打开方式（0：内链；1：外链）",
 *     path: "前端路由或接口地址,路由打开的地址栏地址 前期P{@code path}也指向组件地址，后期可能加字段区分",
 *     component: "前端的组件",
 *     componentPath: "前端的组件地址，不传使用path做组件地址",
 *     permissionId: "权限标识，唯一，通常children是在当前基础上累加",
 *     alwaysShow: "在左侧菜单目录是否显示（true：显示，false：隐藏）",
 *     meta: {
 *        title: '系统管理 // 左侧菜单栏标题',
 *        icon: 'peoples // 图标',
 *     },
 *     children: [] // 子元素
 *   }
 * </pre>
 */
export const goudongWebAdminResource = [
  {
    name: '系统管理',
    type: 1,
    openModel: 0,
    path: '/user',
    component: () => import('@/layout'),
    componentPath: '@/layout',
    permissionId: 'sys',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-tools',
    },
    children: [
      {
        name: '用户管理', // 使用name属性，才有面包屑
        type: 1,
        openModel: 0,
        path: '/user/index',
        component: () => import('@/views/user/index'),
        componentPath: '@/views/user/index',
        permissionId: 'sys:user',
        meta: {
          title: '用户管理',
          icon: 'peoples',
        },
        children: [
          {
            name: '查询用户',
            type: 2,
            openModel: 0,
            path: '/api/user/base-user/page',
            method: '["GET"]',
            permissionId: 'sys:user:query',
          },
          {
            name: '新增用户',
            type: 2,
            openModel: 0,
            path: '/api/user/base-user/simple-create-user',
            method: '["POST"]',
            permissionId: 'sys:user:add',
          },
          {
            name: '删除用户',
            type: 2,
            openModel: 0,
            path: '/api/user/base-user/*',
            method: '["DELETE"]',
            permissionId: 'sys:user:delete',
          },
          {
            name: '编辑用户',
            type: 2,
            openModel: 0,
            path: '/api/user/base-user/admin/user',
            method: '["PUT"]',
            permissionId: 'sys:user:edit',
          },
          {
            name: '重置密码',
            type: 2,
            openModel: 0,
            path: '/api/user/base-user/reset-password/*',
            method: '["PUT"]',
            permissionId: 'sys:user:reset-password',
          },
        ]
      },
      {
        name: '角色管理',
        type: 1,
        openModel: 0,
        path: '/role/index',
        component: () => import('@/views/role/index'),
        componentPath: '@/views/role/index',
        permissionId: 'sys:role',
        meta: {
          title: '角色管理',
          icon: 'iconfont-jueseguanli',
        },
        children: [
          {
            name: '查询角色',
            type: 2,
            openModel: 0,
            path: '/api/user/base-role/page',
            method: '["GET"]',
            permissionId: 'sys:role:query',
          },
          {
            name: '新增角色',
            type: 2,
            openModel: 0,
            path: '/api/user/base-role',
            method: '["POST"]',
            permissionId: 'sys:role:add',
          },
          {
            name: '删除角色',
            type: 2,
            openModel: 0,
            path: '/api/user/base-role/*',
            method: '["DELETE"]',
            permissionId: 'sys:role:delete',
          },
          {
            name: '编辑角色',
            type: 2,
            openModel: 0,
            path: '/api/user/base-role',
            method: '["PUT"]',
            permissionId: 'sys:role:edit',
          },
          {
            name: '分配权限',
            type: 2,
            openModel: 0,
            path: '/api/user/base-role/permissions/*',
            method: '["POST"]',
            permissionId: 'sys:role:permission',
          }
        ]
      },
      {
        name: '菜单管理',
        type: 1,
        openModel: 0,
        path: '/menu/index',
        component: () => import('@/views/menu/index'),
        componentPath: '@/views/menu/index',
        permissionId: 'sys:menu',
        meta: {
          title: '菜单管理',
          icon: 'iconfont-caidanguanli',
        },
        children: [
          {
            name: '初始菜单',
            type: 2,
            openModel: 0,
            path: '/api/user/base-menu/init',
            method: '["POST"]',
            permissionId: 'sys:menu:init',
          },
          {
            name: '查询菜单',
            type: 2,
            openModel: 0,
            path: '/api/user/base-menu/tree',
            method: '["GET"]',
            permissionId: 'sys:menu:query',
          },
        ]
      },
      {
        name: '应用管理',
        type: 1,
        openModel: 0,
        path: '/app/index',
        component: () => import('@/views/app/index'),
        componentPath: '@/views/app/index',
        permissionId: 'sys:app',
        meta: {
          title: '应用管理',
          icon: 'iconfont-yingyongguanli',
        },
        children: [
          {
            name: '查询应用',
            type: 2,
            openModel: 0,
            path: '/api/oauth2/base-app',
            method: '["GET"]',
            permissionId: 'sys:app:query',
          },
          {
            name: '申请应用',
            type: 2,
            openModel: 0,
            path: '/api/oauth2/base-app',
            method: '["POST"]',
            permissionId: 'sys:app:apply',
          },
          {
            name: '审核应用',
            type: 2,
            openModel: 0,
            path: '/api/oauth2/base-app/audit',
            method: '["PUT"]',
            permissionId: 'sys:app:audit',
          },
          {
            name: '删除应用',
            type: 2,
            openModel: 0,
            path: '/api/oauth2/base-app/*',
            method: '["DELETE"]',
            permissionId: 'sys:app:delete',
          },
        ]
      }
    ]
  },
]

/**
 * 所有组件
 */
export const goudongWebAdminComponent = getComponents()

/**
 * 将
 */
function getComponents() {
  let newArr = []
  treeToArr(goudongWebAdminResource, newArr) // 转成一维数组
  const components = [] // 所有组件（解决动态引入组件有错误）
  newArr.forEach(item => {
    let obj = {
      path: item.path,
      component: item.component
    }
    components.push(obj)
  })
  return components;
}

/**
 * 路由资源
 * @type {T[]}
 */
// export const goudongWebAdminRouters = getRouters()

/**
 * 对所有资源中的api进行过滤，只返回路由资源
 * @returns {T[]}
 */
function getRouters() {
  // 复制
  const copy = deepCopy(goudongWebAdminResource)
  const routers = copy.filter(menu => {
    if (menu.type === 0) {
      return false
    }
    // 有children
    if (menu.children) {
      // 修改children，过滤掉 api
      menu.children = filterChildren(menu.children)
      if (menu.children.length === 0) {
        menu.children = undefined
      }
      return true
    }
    return true
  })

  return copy;
}

/**
 * 深拷贝
 * @param source
 * @returns {[]|{}|*}
 */
function deepCopy(source) {
  if (typeof source !== "object") {
    return source;
  }
  if (source == null) {
    return source;
  }
  var newObj = source.constructor === Array ? [] : {}; // 开辟一块新的内存空间
  for (var i in source) {
    newObj[i] = deepCopy(source[i]);
  }
  return newObj;
}

/**
 * 过滤子节点
 * @param menus
 * @returns {*}
 */
function filterChildren(menus) {
  return menus.filter(menu => {
    // api的过滤掉
    if (menu.type === 0) {
      return false
    }
    // 有children
    if (menu.children) {
      // 递归修改children
      menu.children = filterChildren(menu.children)
      if (menu.children.length === 0) {
        menu.children = undefined
      }
      return true
    }

    return true
  })
}
