import Vue from 'vue'
import axios from 'axios'
// 怎么用
// 如果报错需要修改 Logger.basePath

// this.$log.info(msg)
// this.$log.debug(msg)
// this.$log.error(msg)

let Logger = {
  basePath: baseURL.servicePath,
  init () {
    Vue.prototype.$log = this
    Vue.config.errorHandler = (err, vm, info) => {
      Logger.sysError(err)
    }
  },
  // 发送info Log
  info (msg) {
    this.postLog(msg, 'info')
  },
  // 发送debug Log
  debug (msg) {
    this.postLog(msg, 'debug')
  },
  // 发送debug Log
  error (msg) {
    this.postLog(msg, 'error')
  },
  // 发送debug Log
  sys (msg) {
    this.postLog(msg, 'sys')
  },
  // 发送debug Log
  sysError (msg) {
    this.postLog(msg, 'sysError')
  },
  // 发送log信息
  postLog (msg, type) {
    // Vue.$httpJson('applog/test', {
    //   logtType: type,
    //   logMsg: msg
    // })
    axios.post(this.basePath + 'applog/test', {
      logtType: type,
      logMsg: msg
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

}

export default Logger
