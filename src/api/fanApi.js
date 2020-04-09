import axios from "./networkAxios"

export default {
  getFans (param) {
    return axios.post("/user/getFanUserByUserId", {
      userId: param.userId
    })
  }
}
