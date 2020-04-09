import axios from "./networkAxios"

export default {
  getCommentsByEssayId (param) {
    return axios.post("/user/getCommentsByEssayId", {
      essayId: param.essayId,
      page: param.page
    })
  },
  addComments (param) {
    return axios.post("/user/addComments", {
      userId: param.userId,
      msg: param.msg,
      essayId: param.essayId
    })
  },
  getCommentsByUserId (param) {
    return axios.post("/user/getCommentsByUserId", {
      userId: param.userId,
      page: param.page
    })
  },
  deleteComment (param) {
    return axios.post("/user/deleteComment", {
      commentId: param.commentId
    })
  },
  getCommentWithoutCheck (param) {
    return axios.post("/admin/getComments", {
      flag: param.flag,
      page: param.page
    })
  }
}
