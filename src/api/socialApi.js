import axios from "./networkAxios"

export default {
  getEssaysByUserUp (param) {
    return axios.post('/user/getEssaysByUserUp', {
      userId: param.userId,
      page: param.page,
      flag: param.flag
    })
  }
}
