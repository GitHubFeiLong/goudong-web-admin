import { asyncRoutes, constantRoutes } from '@/router'
import store from "@/store";

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
   * @param menus
   * @returns {Promise<unknown>}
   */
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      console.log(asyncRoutes)
      let accessedRoutes
      const roles = store.getters.roles;
      if (roles.includes('ROLE_ADMIN')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
      }
      commit('SET_ROUTES', accessedRoutes)
      console.log(accessedRoutes)
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
