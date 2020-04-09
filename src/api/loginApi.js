import axios from './networkAxios'

export default {
  userLogin (user) {
    return axios.post('/user/login', {
      mail: user.mail,
      password: user.password
    })
  }
}
