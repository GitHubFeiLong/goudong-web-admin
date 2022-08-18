import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import LocalStorageUtil from '@/pojo/LocalStorageUtil'
import { TOKEN_LOCAL_STORAGE, USER_LOCAL_STORAGE } from '@/constant/LocalStorageConst.js'
import Token from '@/pojo/Token'

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
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663385878&t=2ced0a76ecc119b3bfa3664ead8f789b')
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
        // user.roles.for((role, index) => {
        //   roles.push(role.roleName)
        // })

        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663385878&t=2ced0a76ecc119b3bfa3664ead8f789b')
        commit('SET_INTRODUCTION', nickname)
        resolve()
      })
    })

    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response
    //
    //     if (!data) {
    //       reject('Verification failed, please Login again.')
    //     }
    //
    //     const { roles, name, avatar, introduction } = data
    //
    //     // roles must be a non-empty array
    //     if (!roles || roles.length <= 0) {
    //       reject('getInfo: roles must be a non-null array!')
    //     }
    //
    //     commit('SET_ROLES', roles)
    //     commit('SET_NAME', name)
    //     commit('SET_AVATAR', avatar)
    //     commit('SET_INTRODUCTION', introduction)
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
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
