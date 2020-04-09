import axios from "./networkAxios"

export default {
  getCatesByUserId (param) {
    return axios.post("/user/getCatesByUserId", {
      userId: param.userId
    })
  },
  addEssayCate (param) {
    return axios.post("/user/addEssayCate", {
      cateId: param.cateId,
      essayId: param.essayId
    })
  },
  addCate (param) {
    return axios.post("/user/addCate", {
      userId: param.userId,
      name: param.name
    })
  },
  getCatesByEssayId (param) {
    return axios.post("/user/getCatesByEssayId", {
      essayId: param.essayId
    })
  },
  deleteCate (param) {
    return axios.post("/user/deleteCatesByCateId", {
      cateId: param.cateId
    })
  }
}
