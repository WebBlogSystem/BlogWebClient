import { sstorage } from '../storage'
import loginApi from '@/api/loginApi'
import userApi from '@/api/userApi'

const state = {
  // 登录用户信息
  userInfo: {},
  otherInfo: {},
  // 1添加博文 2博客管理 3标签管理显示 1个人资料
  leftCurrent: '1'
}

// getters
const getters = {
}

// actions
const actions = {
  startSession ({ commit, state }, param) {
    userApi.startSession(param)
  },
  getRecommendUser ({ commit, state }, param) {
    userApi.getRecommendUser(param).then((response) => {
      var data = response.data
      if (data.flag) {
        param.success(data.res)
      } else {
        param.fail(data.info)
      }
    })
  },
  userLogin ({ commit, state }, param) {
    loginApi.userLogin(param.formLogin).then((response) => {
      var data = response.data
      if (data.flag) {
        commit('setUserInfo', data.res)
        param.success()
      } else {
        param.fail(data.info)
      }
    })
  },
  setPassword ({ commit, state }, param) {
    userApi.setPassword(param).then((response) => {
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
  updateUser ({ commit, state }, param) {
    userApi.updateUser(param).then(
      (response) => {
        var data = response.data
        if (data.islogin) {
          if (data.flag) {
            param.success(data.res)
          } else {
            param.actionError(data.info)
          }
        } else {
          param.fail()
        }
      }
    )
  },
  getUserByUserId ({ commit, state }, param) {
    userApi.getUser(param).then(
      (response) => {
        var data = response.data
        if (data.flag) {
          param.success(data.res)
        } else {
          param.fail(data.info)
        }
      }
    )
  },
  register ({ commit, state }, param) {
    userApi.register(param).then(
      (response) => {
        var data = response.data
        if (data.flag) {
          param.success()
        } else {
          param.fail(data.info)
        }
      }
    )
  }
  // checkout ({ commit, state }, products) {
  //   const savedCartItems = [...state.items]
  //   commit('setCheckoutStatus', null)
  //   // empty cart
  //   commit('setCartItems', { items: [] })
  //   shop.buyProducts(
  //     products,
  //     () => commit('setCheckoutStatus', 'successful'),
  //     () => {
  //       commit('setCheckoutStatus', 'failed')
  //       // rollback to the cart saved before sending the request
  //       commit('setCartItems', { items: savedCartItems })
  //     }
  //   )
  // }
}

// mutations
const mutations = {
  setLeftCurrent (state, current) {
    state.leftCurrent = current
  },
  setUserInfo (state, userInfo) {
    sstorage.setItem('user', JSON.stringify(userInfo))
    state.userInfo = userInfo
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
