import axios from "./networkAxios"

export default {
  getAttentions (param) {
    return axios.post("/user/getAttentionUserByUserId", {
      userId: param.userId
    })
  },
  getAttention (param) {
    return axios.post("/user/getAttention", {
      fromUserId: param.fromUserId,
      toUserId: param.toUserId
    })
  },
  addAttention (param) {
    return axios.post("/user/addAttention", {
      fromUserId: param.fromUserId,
      toUserId: param.toUserId
    })
  },
  deleteAttention (param) {
    return axios.post("/user/deleteAttention", {
      fromUserId: param.fromUserId,
      toUserId: param.toUserId
    })
  }
}
