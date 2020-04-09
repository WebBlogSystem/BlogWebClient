import axios from "./networkAxios"

export default {
  getLetter (param) {
    return axios.post("/user/getLetterByUserId1AndUserId2", {
      userId1: param.userId1,
      userId2: param.userId2
    })
  },
  getLetterByUserId (param) {
    return axios.post("/user/getLetterByUserId", {
      userId: param.userId,
      page: param.page
    })
  },
  addLetter (param) {
    return axios.post("/user/addLetter", {
      userId1: param.userId1,
      userId2: param.userId2
    })
  },
  deleteLetter (param) {
    return axios.post("/user/deleteLetterByLetterId", {
      letterId: param.letterId
    })
  },
  getNoReadLetterMsgNums (param) {
    return axios.post("/user/getNoReadLetterMsgNums", {
      letterId: param.letterId,
      userId: param.userId
    })
  }
}
