import { getInfo, login, logout } from '@/api/user'
import { router, resetRouter } from '@/router'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import {
  PERMISSION_BUTTONS_LOCAL_STORAGE,
  PERMISSION_ROUTES_LOCAL_STORAGE,
  TOKEN_LOCAL_STORAGE,
  USER_LOCAL_STORAGE
} from '@/constant/LocalStorageConst.js'
import Token from '@/pojo/Token'
import defaultAvatarPng from '@/assets/png/default-avatar.png'
import store from "@/store";

const state = {
  token: '',
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  menus: [],
  permission_routes: [], // 权限路由tree
  permission_buttons: [], // 权限按钮集合
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSION_ROUTES: (state, permission_routes) => { state.permission_routes = permission_routes; },
  SET_PERMISSION_BUTTONS: (state, permission_buttons) => { state.permission_buttons = permission_buttons; },
}
import { arrayToTree } from "@/utils/tree";
const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(async data => {
        const { accessExpires, accessToken, refreshExpires, refreshToken } = data
        const token = new Token(accessToken, refreshToken, accessExpires, refreshExpires)
        LocalStorageUtil.set(TOKEN_LOCAL_STORAGE, token)

        const user = data.user
        LocalStorageUtil.set(USER_LOCAL_STORAGE, user)
        const { username, nickname } = user
        const roles = []
        for (const key in user.roles) {
          roles.push(user.roles[key].roleName)
        }

        if (roles.length === 0) {
          roles.push('匿名角色')
        }

        // 处理动态路由，将其保存树节点
        console.log(123)
        let permission_routes = [] // 权限路由信息
        let permission_buttons = [] // 权限按钮
        if (user.menus) {
          // 循环所有
          user.menus.map((item, index, array) => {
            const metadata = item.metadata ? JSON.parse(item.metadata) : {};
            if (item.type === 1) { // 菜单
              permission_routes.push({
                id: item.id,
                parentId: item.parentId,
                path: item.path,
                name: item.name,
                alwaysShow: item.parentId == null ? !item.hide : undefined,
                meta: metadata,
                sortNum: item.sortNum,
                openModel: item.openModel
              })
            } else if (item.type === 2) { // 按钮
              permission_buttons.push({
                permissionId: item.permissionId
              })
            }
          })
        }
        // 路由先排序
        permission_routes.sort(function(a, b) {
          return (a.sortNum - b.sortNum);
        });
        // 路由数组转tree
        permission_routes = arrayToTree(permission_routes, null);
        // 设置到本地缓存
        LocalStorageUtil.set(PERMISSION_ROUTES_LOCAL_STORAGE, permission_routes)
        LocalStorageUtil.set(PERMISSION_BUTTONS_LOCAL_STORAGE, permission_buttons)

        commit('SET_TOKEN', accessToken)
        commit('SET_ROLES', roles)
        commit('SET_PERMISSION_ROUTES', permission_routes)
        commit('SET_PERMISSION_BUTTONS', permission_buttons)
        commit('SET_NAME', username)
        commit('SET_AVATAR', user.avatar || defaultAvatarPng)
        commit('SET_INTRODUCTION', nickname)

        // 计算用户有权访问的路由，动态添加路由
        const accessRoutes = await store.dispatch('permission/generateRoutes', permission_routes)
        router.addRoutes(accessRoutes)

        resolve(data)
      }).catch((reason) => reject())
    })
  },
  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(data => {
        const { username, avatar, nickname } = data
        const roles = []
        for (const key in data.roles) {
          roles.push(data.roles[key].roleName)
        }
        if (roles.length === 0) {
          roles.push('匿名角色')
        }

        commit('SET_TOKEN', LocalStorageUtil.getAccessToken())
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar || defaultAvatarPng)
        commit('SET_INTRODUCTION', nickname)
        resolve(data)
      }).catch(reason => {
        reject()
      })
    })
  },

  // 退出
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        LocalStorageUtil.remove(TOKEN_LOCAL_STORAGE)
        LocalStorageUtil.remove(USER_LOCAL_STORAGE)
        LocalStorageUtil.remove(PERMISSION_ROUTES_LOCAL_STORAGE)
        LocalStorageUtil.remove(PERMISSION_BUTTONS_LOCAL_STORAGE)
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      })
    })
  },

  // 重置令牌
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      LocalStorageUtil.remove(TOKEN_LOCAL_STORAGE)
      LocalStorageUtil.remove(USER_LOCAL_STORAGE)
      LocalStorageUtil.remove(PERMISSION_ROUTES_LOCAL_STORAGE)
      LocalStorageUtil.remove(PERMISSION_BUTTONS_LOCAL_STORAGE)
      resetRouter()
      // store.dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
