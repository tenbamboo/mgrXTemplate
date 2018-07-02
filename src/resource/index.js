import Vue from 'vue'
import Cain from '@cain/'
import axios from 'axios'
// import qs from 'qs'
// import { Message } from 'element-ui'

// let exclude = ['interface/getSysUser', 'interface/getResourceFile']

function responseOpt (response) {
  if (process.env.NODE_ENV === 'development') {
    console.log('response url =' + response.config.url, 'response stateCoed =' + response.status, 'response body =', response.data)
  }
}
function requestOpt (config) {
  if (process.env.NODE_ENV === 'development') {
    console.log('rquest url =' + config.url, 'rquest body =', config.data)
  }
  if (!config.data) {
    config.data = {
    }
  }
  config.data.reqUserId = Cain.getCookie('rootUserId')
}

// 文件服务
let fileHttp = axios.create({})

fileHttp.defaults.baseURL = process.env.fileSysPath
fileHttp.defaults.headers.post['Content-Type'] = 'multipart/form-data'
fileHttp.defaults.timeout = 50000

fileHttp.interceptors.request.use((config) => {
  requestOpt(config)
  return config
})

fileHttp.interceptors.response.use((response) => {
  responseOpt(response)
  return response
})
// json头 请求
let httpJson = axios.create({})
httpJson.defaults.baseURL = process.env.servicePath
httpJson.defaults.headers.post['Content-Type'] = 'application/json'
httpJson.defaults.timeout = 10000

httpJson.interceptors.request.use((config) => {
  requestOpt(config)
  return config
})

httpJson.interceptors.response.use((response) => {
  responseOpt(response)
  return response
})
// // 表单请求
// let http = axios.create({})
// http.defaults.baseURL = baseURL.servicePath
// http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// http.defaults.timeout = 10000

// http.interceptors.request.use((config) => {
//   requestOpt(config)
//   config.data = qs.stringify({ p: JSON.stringify(config.data) }, { arrayFormat: 'repeat' })
//   return config
// })

// http.interceptors.response.use((response) => {
//   responseOpt(response)
//   return response
// })

// 沟通Http
let httpChat = axios.create({})

// let exclude = ['interface/getSysUser', 'interface/getResourceFile']

httpChat.defaults.baseURL = process.env.chatServicePath
httpChat.defaults.headers.post['Content-Type'] = 'application/json'
httpChat.defaults.timeout = 10000

httpChat.interceptors.request.use((config) => {
  requestOpt(config)
  return config
})

httpChat.interceptors.response.use((response) => {
  responseOpt(response)
  // if (response.data.errorCode === '0' || response.data.errorCode === '200001') {
  return response.data
  // } else {
  //   Toast({
  //     message: `出错啦，请重试！(code:${response.data.errorCode}   desc:${response.data.errorMsg} )`,
  //     iconClass: 'fa fa-times'
  //   })
  //   return response
  // }
}, (err) => { // 这里是返回状态码不为200时候的错误处理
  // errorHandle(err)
  return Promise.reject(err)
})

Vue.prototype.$httpFile = fileHttp
// Vue.prototype.$http = http
Vue.prototype.$http = httpJson
Vue.prototype.$httpChat = httpChat

export default {
  init () { }
}
