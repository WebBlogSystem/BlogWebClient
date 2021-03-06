import cateApi from '@/api/cateApi'

const state = {
  // EssayList模块样式: 0主页文章列表  1个人中心 2 其他用户文章列表
  cateList: [],
  userId: 0
}

// getters
const getters = {
}

// actions
const actions = {
  getCates ({ commit, state }, param) {
    cateApi.getCatesByUserId(param).then(function (response) {
      var data = response.data
      if (data.flag) {
        data = data.res
        param.success(data)
      } else {
        param.fail(data.info)
      }
    })
  },
  getCatesByEssay ({ commit, state }, param) {
    cateApi.getCatesByEssayId(param).then(function (response) {
      var data = response.data
      if (data.flag) {
        data = data.res
        param.success(data)
      } else {
        param.fail(data.info)
      }
    })
  },
  addEssayCate ({ commit, state }, param) {
    cateApi.addEssayCate(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          data = data.res
          param.success()
        } else {
          param.actionError(data.info)
        }
      } else {
        param.fail()
      }
    })
  },
  addCate ({ commit, state }, param) {
    cateApi.addCate(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          data = data.res
          param.success(data)
        } else {
          param.actionError(data.info)
        }
      } else {
        param.fail()
      }
    })
  },
  deleteCate ({ commit, state }, param) {
    cateApi.deleteCate(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          param.success()
        } else {
          param.actionError(data.info)
        }
      } else {
        param.fail()
      }
    })
  },
  getCateByCateId ({ commit, state }, param) {
    cateApi.getCateByCateId(param).then(function (response) {
      var data = response.data
      if (data.flag) {
        param.success(data.res)
      } else {
        param.fail(data.info)
      }
    })
  },
  editCate ({ commit, state }, param) {
    cateApi.editCate(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          data = data.res
          param.success(data)
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
  setCateList (state, cateList) {
    state.cateList = cateList
  },
  setUserId (state, userId) {
    state.userId = userId
  },
  reset (state) {
    state.cateList = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
