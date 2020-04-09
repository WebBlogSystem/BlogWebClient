// https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F
// 默认情况下，一个 Vue CLI 项目有三个模式：
// development 模式用于 vue-cli-service serve
// production 模式用于 vue-cli-service build 和 vue-cli-service test:e2e
// test 模式用于 vue-cli-service test:unit

// 在客户端侧代码中使用环境变量
// 只有以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中。你可以在应用的代码中这样访问它们：
// console.log(process.env.VUE_APP_***)

//axios.all  一次性可以发送多个请求

module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      [process.env.VUE_APP_API]: {
        target: process.env.VUE_APP_domain,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_API]: ''
        }
      }
    }
  }
}
