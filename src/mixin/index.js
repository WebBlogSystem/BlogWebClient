import axios from '@/api/networkAxios'

export var methods = {
  createImgAxios (imgId) {
    return axios.post('/user/getImgByImgId', { imgId })
  },
  // imgIds 请求的图片id
  // 请求一张图片    参数类型:imgId
  // 并发请求多张图片 参数类型:[imgId,imgId..]
  // catch
  async getImg (imgIds) {
    var promises = []
    var promise
    var res
    // Object.prototype.toString.call(imgIds) == "[object Array]"
    if (imgIds instanceof Array) {
      promises = imgIds.map(item => this.createImgAxios(item))
    } else {
      promises.push(this.createImgAxios(imgIds))
    }
    promise = await axios.all(promises)
      .then(axios.spread(function (...result) {
        if (imgIds instanceof Array) {
          res = result.map(item => process.env.VUE_APP_domain + item.data.res)
        } else {
          res = process.env.VUE_APP_domain + result[0].data.res
        }
        return Promise.resolve(res)
      }))
    return promise
  }
}
