
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
