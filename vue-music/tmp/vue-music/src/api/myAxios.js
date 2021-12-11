import Vue from 'vue'
import axios from 'axios'

var instance = axios.create({
  // baseURL: '/api',
  // timeout: 1000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

 instance.defaults.baseURL = 'http://localhost:3000/'
 instance.defaults.withCredentials = true
Vue.prototype.$axios = instance
export {instance}