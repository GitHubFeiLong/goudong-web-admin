import { getInfo, login, logout } from '@/api/user'
import { router, resetRouter } from '@/router'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import { TOKEN_LOCAL_STORAGE, USER_LOCAL_STORAGE } from '@/constant/LocalStorageConst.js'
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
  SET_MENUS: (state, menus) => {
    state.menus = menus;
  }
}

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

        const menus = []
        if (user.menus) {
          user.menus.map((item, index, array) => {
            menus.push({ path: item.path, api: item.api })
          })
        }

        commit('SET_TOKEN', accessToken)
        commit('SET_ROLES', roles)
        commit('SET_MENUS', menus)
        commit('SET_NAME', username)
        commit('SET_AVATAR', user.avatar || defaultAvatarPng)
        commit('SET_INTRODUCTION', nickname)

        // 计算用户有权访问的路由，动态添加路由
        const accessRoutes = await store.dispatch('permission/generateRoutes', menus)
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
        const menus = []
        if (data.menus) {
          data.menus.map((item, index, array) => {
            menus.push({ path: item.path, api: item.api })
          })
        }

        commit('SET_TOKEN', LocalStorageUtil.getAccessToken())
        commit('SET_ROLES', roles)
        commit('SET_MENUS', menus)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar || defaultAvatarPng)
        commit('SET_INTRODUCTION', nickname)
        resolve(data)
      })
    })
  },

  // 退出
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_MENUS', [])
        LocalStorageUtil.remove(TOKEN_LOCAL_STORAGE)
        LocalStorageUtil.remove(USER_LOCAL_STORAGE)
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
      commit('SET_MENUS', [])
      LocalStorageUtil.remove(TOKEN_LOCAL_STORAGE)
      LocalStorageUtil.remove(USER_LOCAL_STORAGE)
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
