import Vue from 'vue'
import axios from 'axios'

var instance = axios.create({
  // baseURL: '/api',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

axios.defaults.baseURL = '/api'
Vue.prototype.$axios = instance
