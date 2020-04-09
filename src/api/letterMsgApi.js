import axios from "./networkAxios"

export default {
  getLetterMsgList (param) {
    return axios.post("/user/getLetterMsgByLetterId", {
      letterId: param.letterId,
      page: param.page
    })
  },
  addLetterMsg (param) {
    return axios.post("/user/addLetterMsg", {
      msg: param.msg,
      fromUserId: param.fromUserId,
      toUserId: param.toUserId,
      letterId: param.letterId
    })
  },
  switchFlag (param) {
    return axios.post("user/switchLetterMsgFlag", {
      letterMsgId: param.letterMsgId
    })
  }
}
