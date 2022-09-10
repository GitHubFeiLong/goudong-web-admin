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
  roles: []
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
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(async response => {
        const { data } = response
        const { accessExpires, accessToken, refreshExpires, refreshToken } = data.data
        const token = new Token(accessToken, refreshToken, accessExpires, refreshExpires)
        LocalStorageUtil.set(TOKEN_LOCAL_STORAGE, token)

        const user = data.data.user
        LocalStorageUtil.set(USER_LOCAL_STORAGE, user)
        const { username, nickname } = user
        const roles = []
        for (const key in user.roles) {
          roles.push(user.roles[key].roleName)
        }

        if (roles.length === 0) {
          roles.push('匿名角色')
        }

        commit('SET_TOKEN', accessToken)
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', user.avatar || defaultAvatarPng)
        commit('SET_INTRODUCTION', nickname)

        // 计算用户有权访问的路由，动态添加路由
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
        router.addRoutes(accessRoutes)

        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        console.log(response)
        const user = response.data.data
        const { username, avatar, nickname } = user
        const roles = []
        for (const key in user.roles) {
          roles.push(user.roles[key].roleName)
        }
        if (roles.length === 0) {
          roles.push('匿名角色')
        }
        commit('SET_TOKEN', LocalStorageUtil.getAccessToken())
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar || defaultAvatarPng)
        commit('SET_INTRODUCTION', nickname)
        resolve()
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
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
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
      resetRouter()
      this.$store.dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    const { roles } = await dispatch('getInfo')
    resetRouter()
    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
