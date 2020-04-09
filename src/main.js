import Vue from 'vue'
import { methods } from '@/mixin'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import { sstorage } from '@/store/storage'

Vue.use(ViewUI)
Vue.config.productionTip = false
Vue.mixin({
  methods
})
var userInfo = JSON.parse(sstorage.getItem('user')) || {}
store.commit('user/setUserInfo', userInfo)
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user.userInfo.id) {
      next({
        path: '/logincenter/login'
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
