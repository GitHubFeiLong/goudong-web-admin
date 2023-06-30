import { constantRoutes } from '@/router'
import Layout from "@/layout";
import {
  goudongWebAdminComponent,
} from "@/router/modules/goudong-web-admin-router";
import vueElementAdminRouter from "@/router/modules/vue-element-admin-router";

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
    state.routes = constantRoutes.concat(vueElementAdminRouter).concat(routes)
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
      // 循环设置组件
      permissionRoutesComponent(permission_routes);
      commit('SET_ROUTES', permission_routes)
      permission_routes = constantRoutes.concat(permission_routes)
      // permission_routes = constantRoutes.concat(vueElementAdminRouter).concat(permission_routes)
      resolve(permission_routes)
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
      item.component = goudongWebAdminComponent.find(c => {
        if (c.componentPath) {
          return c.componentPath === item.componentPath
        }
        return item.path === c.path
      }).component
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
