import replyApi from '@/api/replyApi'
import ViewUI from 'view-design'

const state = {
  // EssayList模块样式: 0主页文章列表  1个人中心 2 其他用户文章列表
  commentList: []
}

// getters
const getters = {
}

// actions
const actions = {
  getReplyByComment ({ commit, state }, param) {
    replyApi.getReplyByComment(param).then(function (response) {
      var data = response.data
      if (data.flag) {
        data = data.res
        param.success(data)
      } else {
        ViewUI.Message.error(data.info)
      }
    })
  },
  getReplyByUserId ({ commit, state }, param) {
    replyApi.getReplyByUserId(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          data = data.res
          param.success(data.list)
        } else {
          ViewUI.Message.error(data.info)
        }
      } else {
        param.fail()
      }
    })
  },
  addReply ({ commit, state }, param) {
    replyApi.addReply(param).then(function (response) {
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
  deleteReply ({ commit, state }, param) {
    replyApi.deleteReply(param).then(function (response) {
      var data = response.data
      if (data.islogin) {
        if (data.flag) {
          param.success()
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
  // setCateList (state, cateList) {
  //   state.cateList = cateList
  // },
  // setUserId (state, userId) {
  //   state.userId = userId
  // },
  // reset (state) {
  //   state.cateList = []
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
