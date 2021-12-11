/* eslint-disable no-unused-vars */
// es6 兼容性问题
import '@babel/polyfill'
// 点击300ms延迟
import fastClick from 'fastclick'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './common/stylus/index.styl'
// 导入mock.js
// import '../mock/mock'
// 导入axios
import '@api/myAxios.js'

Vue.config.productionTip = false
// 导入点击300ms延迟
fastClick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
