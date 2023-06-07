import { asyncRoutes, constantRoutes } from '@/router'
import store from "@/store";

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
   * @param menus
   * @returns {Promise<unknown>}
   */
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      console.log(asyncRoutes)
      let accessedRoutes
      const roles = store.getters.roles;
      // 将扁平的转成tree，只显示展示的菜单
      const menu1 = menus.filter(item => {
        return item.type === 1 && !item.hide;
      })
      console.log(1);
      // 转tree
      accessedRoutes = ArrayToTree(menu1);
      // if (roles.includes('ROLE_ADMIN')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
      // }
      commit('SET_ROUTES', accessedRoutes)
      console.log(accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

function ArrayToTree(arr, pid = 0) {
  // 判断是否是数组 不是数组就返回 []
  if (!Array.isArray(arr) || !arr.length) return [];
  let newArr = []
  arr.forEach(item => {
    // 判断 当前item.pid 和 传入的pid 是否相等，相等就push 进去
    if (item.parentId === pid) {
      newArr.push({
        ...item, children: ArrayToTree(arr, item.id)
      })
    }
  })
  return newArr
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
