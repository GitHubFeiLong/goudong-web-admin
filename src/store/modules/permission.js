import { asyncRoutes, constantRoutes } from '@/router'
import store from "@/store";
import { getRouters1 } from "@/router/modules/goudong-web-admin-router";
import Layout from "@/layout";
import { loadView } from "@/utils/tree";

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
    console.log(routes)
    console.log(constantRoutes)
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
      let accessedRoutes = []
      const roles = store.getters.roles;
      // 将扁平的转成tree，只显示展示的菜单
      const menu1 = menus.filter(item => {
        return item.type === 1 && !item.hide;
      })
      console.log(1, menu1);
      // 转tree
      // const menuTree = arrayToTree(menu1, null);
      // accessedRoutes = arrayToTree(menu1, null);

      // accessedRoutes = arrayToTree(menuTree);
      // accessedRoutes = [];
      // if (roles.includes('ROLE_ADMIN')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
      // }
      // accessedRoutes = asyncRoutes
      // accessedRoutes.push({
      //   path: '/usr/index',
      //   component: () => import('@/views/user/index'),
      //   name: '用户管理',
      //   type: 1,
      //   openModel: 0,
      //   sortNum: 2,
      //   hidden: false,
      //   meta: {
      //     title: '用户管理',
      //     roles: ['ROLE_ADMIN'] // or you can only set roles in sub nav
      //   }
      // })
      fn1(accessedRoutes, menu1)
      commit('SET_ROUTES', accessedRoutes)
      console.log(accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

function fn1(accessedRoutes, menu1) {
  menu1.forEach(item => {
    const obj = {
      id: item.id,
      parentId: item.parentId,
      path: item.path,
      name: item.name,
      alwaysShow: !item.hide,
      // component: (item.parentId === null || item.parentId === undefined) ? Layout : () => import('@/views/user/index'),
      component: () => import('@/views/user/index'),
      meta: item.metadata,
      permissionId: item.permissionId,
      type: item.type,
      openModel: item.openModel,
      hide: item.hide,
    }
    accessedRoutes.push(obj)
  })
}

function arrayToTree(arr, parentId) {
  const newArr = []
  arr.forEach(item => {
    // eslint-disable-next-line eqeqeq
    if (item.parentId == parentId) {
      const obj = {
        id: item.id,
        parentId: item.parentId,
        path: item.path,
        name: item.name,
        alwaysShow: !item.hide,
        component: (parentId === null || parentId === undefined) ? Layout : () => import('@/views/user/index'),
        meta: {},
        permissionId: item.permissionId,
        type: item.type,
        openModel: item.openModel,
        hide: item.hide,
        children: arrayToTree(arr, item.id)
      }
      if (obj.children.length === 0) {
        delete obj.children;
      }
      // if (parentId === null || parentId === undefined) {
      //   obj.component = Layout
      // } else {
      //   obj.component = () => import('@/views/user/index')
      // }
      newArr.push(obj)
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
