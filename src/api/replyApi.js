import axios from "./networkAxios"

export default {
  getReplyByComment (param) {
    return axios.post("/user/getReplyByCommentIdByTime", {
      commentsId: param.commentsId
    })
  },
  addReply (param) {
    return axios.post("/user/addReply", {
      commentsId: param.commentsId,
      fromUserId: param.fromUserId,
      toUserId: param.toUserId,
      msg: param.msg
    })
  },
  getReplyByUserId (param) {
    return axios.post("/user/getReplyByUserId", {
      userId: param.userId,
      page: param.page
    })
  },
  deleteReply (param) {
    return axios.post("/user/deleteReplyByReplyId", {
      replyId: param.replyId
    })
  }
}
