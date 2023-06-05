import { getInfo, login, logout } from '@/api/user'
import { router, resetRouter } from '@/router'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import { TOKEN_LOCAL_STORAGE, USER_LOCAL_STORAGE } from '@/constant/LocalStorageConst.js'
import Token from '@/pojo/Token'
import defaultAvatarPng from '@/assets/png/default-avatar.png'
import store from "@/store";

const state = {
  allMenus: [],
}

const mutations = {
  SET_ALL_MENUS: (state, menus) => {
    state.allMenus = menus;
  }
}

const actions = {
  // 设置所有权限
  setAllMenus({ commit }, menus) {
    commit('SET_ALL_MENUS', menus)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
