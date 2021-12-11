/* eslint-disable no-unused-vars */
// es6 兼容性问题
import '@babel/polyfill'
// 点击300ms延迟
import 'font-awesome/css/font-awesome.min.css'
import './common/stylus/index.styl'
import './common/icon/iconfont.css'

import fastClick from 'fastclick'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// 导入mock.js
// import '../mock/mock'
// 导入axios
import '@api/myAxios.js'

Vue.config.productionTip = false
// 导入点击300ms延迟
fastClick.attach(document.body)


import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
      loading: require('@common/image/default.png')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
