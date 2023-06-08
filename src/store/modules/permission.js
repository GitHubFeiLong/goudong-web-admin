import { constantRoutes } from '@/router'
import Layout from "@/layout";
import { goudongWebAdminResource } from "@/router/modules/goudong-web-admin-router";

function hasPermissionByMenus(menus, route) {
  if (route.type !== 0 && route.path) {
    return menus.some(menu => route.path === menu.path);
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param menus
 */
export function filterAsyncRoutes(routes, menus) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermissionByMenus(menus, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, menus)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  /**
   * 动态添加路由
   * @param commit
   * @param permission_routes
   * @returns {Promise<unknown>}
   */
  generateRoutes({ commit }, permission_routes) {
    return new Promise(resolve => {
      // let accessedRoutes = []
      // // const roles = store.getters.roles;
      // 循环设置组件
      permissionRoutesComponent(permission_routes);
      commit('SET_ROUTES', permission_routes)
      resolve(permission_routes)

      // commit('SET_ROUTES', goudongWebAdminResource)
      // resolve(goudongWebAdminResource)
    })
  }
}

/**
 * 组件
 * @param permission_routes
 */
function permissionRoutesComponent(permission_routes) {
  permission_routes.forEach(item => {
    if (item.parentId === null || item.parentId === undefined) {
      item.component = Layout
    } else {
      console.log('@/views' + item.component)
      // item.component = () => import('@/views' + item.component)
      item.component = () => require('/src/views' + item.component);
      // item.component = () => import('@/views/user/index')
      // item.component = (resolve) => require([`@/views${item.component}`], resolve)
    }
    if (item.children && item.children.length > 0) {
      permissionRoutesComponent(item.children)
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
