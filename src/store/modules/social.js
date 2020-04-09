// import social from "@/api/socialApi"

const state = {
  // 1评论 2回复 3关注 4粉丝 5云信
  leftCurrent: '1'
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
  setLeftCurrent (state, current) {
    state.leftCurrent = current
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
