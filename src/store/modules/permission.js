import { asyncRoutes, constantRoutes } from '@/router'
import store from "@/store";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 * @deprecated 使用动态路由，由接口返回用户的菜单权限,使用 {@link hasPermissionByMenus}
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function hasPermissionByMenus(menus, route) {
  if (!route.api && route.path) {
    return menus.some(menu => route.path === menu.path);
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermissionByMenus(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
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
   * @param menus
   * @returns {Promise<unknown>}
   */
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      let accessedRoutes
      const roles = store.getters.roles;
      if (roles.includes('ROLE_ADMIN')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
