import ViewUI from 'view-design'
import axios from 'axios'

// 不设置超时时间
axios.defaults.baseURL = process.env.VUE_APP_API
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.responseType = 'json'

/**
 * http请求拦截器
 * */
axios.interceptors.request.use(
  config => {
    if (config.isUploadImg === true) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else if (config.isUploadFile === true) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  })
/**
 * http响应拦截器
 * */
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    ViewUI.Message.error('服务器暂未响应！')
    Promise.reject(error)
  })

export default axios
