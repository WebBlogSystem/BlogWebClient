import axios from './networkAxios'

export default {
  getUser (param) {
    return axios.post('/user/getUserByUserId', {
      userId: param.userId
    })
  },
  setPassword (param) {
    return axios.post('/user/setPassword', {
      userId: param.userId,
      oldPassword: param.oldPassword,
      newPassword: param.newPassword
    })
  },
  updateUser (param) {
    return axios.post('/user/updateUser', {
      id: param.id,
      sex: param.sex,
      username: param.username,
      intro: param.intro,
      imgid: param.imgid
    })
  },
  register  (param) {
    return axios.post('/user/register', {
      username: param.username,
      mail: param.mail,
      password: param.password,
      sex: param.sex,
      intro: param.intro
    })
  }
}
