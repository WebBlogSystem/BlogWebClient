import essayApi from '@/api/essayApi'
import ViewUI from 'view-design'

const state = {
  // EssayList模块样式: 0主页文章列表  1个人中心 2 其他用户文章列表
  essayListFrom: 0,
  essayList: []
}

// getters
const getters = {
}

// actions
const actions = {
  getEssayByEssayId ({ commit, state }, param) {
    essayApi.getEssay(param).then(function (response) {
      var data = response.data
      if (data.flag) {
        param.success(data.res)
      } else {
        ViewUI.Message.error(data.info)
      }
    })
  },
  getEssayList ({ commit, state }, param) {
    essayApi.getEssayList(param).then(function (response) {
      var data = response.data
      if (data.flag) {
        data = data.res
        param.success(data.list)
      } else {
        ViewUI.Message.error(data.info)
      }
    })
  },
  addEssay ({ commit, state }, param) {
    essayApi.addEssay(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          ViewUI.Message.success(data.info)
          param.success()
        } else {
          ViewUI.Message.error(data.info)
        }
      } else {
        param.fail()
      }
    })
  },
  deleteEssay ({ commit, state }, param) {
    essayApi.deleteEssay(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          param.success(data.info)
        } else {
          ViewUI.Message.error(data.info)
        }
      } else {
        param.fail()
      }
    })
  },
  editEssay ({ commit, state }, param) {
    essayApi.editEssay(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          ViewUI.Message.success(data.info)
          param.success()
        } else {
          ViewUI.Message.error(data.info)
        }
      } else {
        param.fail()
      }
    })
  },
  getUps ({ commit, state }, param) {
    essayApi.getUps(param).then(function (response) {
      var data = response.data
      if (data.flag) {
        param.success(data.res)
      } else {
        ViewUI.Message.error(data.info)
      }
    })
  },
  getEssayByCateId ({ commit, state }, param) {
    essayApi.getEssayByCateId(param).then(function (response) {
      var data = response.data
      if (data.flag) {
        data = data.res
        param.success(data.list)
      } else {
        ViewUI.Message.error(data.info)
      }
    })
  },
  getAllEssayByCateId ({ commit, state }, param) {
    essayApi.getAllEssayByCateId(param).then(function (response) {
      var data = response.data
      if (data.flag) {
        data = data.res
        param.success(data)
      } else {
        ViewUI.Message.error(data.info)
      }
    })
  },
  addEssayCate ({ commit, state }, param) {
    essayApi.addEssayCate(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          data = data.res
          param.success()
        } else {
          ViewUI.Message.error(data.info)
        }
      } else {
        param.fail()
      }
    })
  },
  deleteEssayCate ({ commit, state }, param) {
    essayApi.deleteEssayCate(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          data = data.res
          param.success()
        } else {
          ViewUI.Message.error(data.info)
        }
      } else {
        param.fail()
      }
    })
  },
  updateUp ({ commit, state }, param) {
    essayApi.updateUp(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          data = data.res
          param.success(data)
        } else {
          ViewUI.Message.error(data.info)
        }
      } else {
        param.fail()
      }
    })
  },
  getUpOrDown ({ commit, state }, param) {
    essayApi.getUpOrDown(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          data = data.res
          param.success(data)
        } else {
          ViewUI.Message.error(data.info)
        }
      } else {
        param.fail()
      }
    })
  }
}

// mutations
const mutations = {
  setEssayListFrom (state, essayListFrom) {
    state.essayListFrom = essayListFrom
  },
  setEssayList (state, essayList) {
    state.essayList = essayList
  },
  deleteOneEssayItem (state, essayId) {
    var res = state.essayList.findIndex(item => item.id === essayId)
    if (res !== -1) {
      state.essayList.splice(res, 1)
    }
  },
  reset (state) {
    state.essayListFrom = 0
    state.essayList = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
