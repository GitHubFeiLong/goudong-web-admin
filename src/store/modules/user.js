import {getInfo, login, logout} from '@/api/user'
import {getToken, removeToken, setToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'
import LocalStorageUtil from '@/pojo/LocalStorageUtil'
import {TOKEN_LOCAL_STORAGE, USER_LOCAL_STORAGE} from '@/constant/LocalStorageConst.js'
import Token from '@/pojo/Token'
import defaultAvatarPng from '@/assets/png/default-avatar.png'

const state = {
  token: getToken(),
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
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.data.accessToken)
        setToken(data.data.accessToken)
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
        commit('SET_ROLES', roles.length === 0 ? ['匿名角色'] : roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', user.avatar || defaultAvatarPng)
        commit('SET_INTRODUCTION', nickname)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
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
        commit('SET_ROLES', roles.length === 0 ? ['匿名角色'] : roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar || defaultAvatarPng)
        commit('SET_INTRODUCTION', nickname)
        resolve()
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        LocalStorageUtil.remove(TOKEN_LOCAL_STORAGE)
        LocalStorageUtil.remove(USER_LOCAL_STORAGE)
        removeToken()
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

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      LocalStorageUtil.remove(TOKEN_LOCAL_STORAGE)
      LocalStorageUtil.remove(USER_LOCAL_STORAGE)
      removeToken()
      resetRouter()
      dispatch('tagsView/delAllViews', null, {root: true})
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

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
