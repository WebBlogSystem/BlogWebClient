import socialApi from "@/api/socialApi"

const state = {
  // 1评论 2回复 3关注 4粉丝 5云信
  leftCurrent: '1'
}

// getters
const getters = {
}

// actions
const actions = {
  getEssaysByUserUp ({ commit, state }, param) {
    socialApi.getEssaysByUserUp(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          data = data.res
          param.success(data.list)
        } else {
          param.actionError(data.info)
        }
      } else {
        param.fail()
      }
    })
  }
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
