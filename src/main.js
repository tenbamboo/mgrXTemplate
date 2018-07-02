// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import resource from './resource'
// import store from './store'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import _ from '@/components/common/localLodash.js'

import Cain from '@cain/'
// import CainLogger from '@cain/Logger'

Vue.prototype.$_ = _
if (process.env.NODE_ENV === 'development') {
  const rootUserId = 1001
  Cain.setCookie('rootUserId', rootUserId)
  Cain.setCookie('rootRoleId', '1001')
  Cain.setCookie('rootUserName', rootUserId)
}

// 引入区 start
Vue.use(ElementUI)
// CainLogger.init()
// 引入区 end

// resource 配置 start
resource.init()
// resource 配置 end
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  created () {
    let overlay = document.querySelector('.readyOverlay')
    let canvas = document.querySelector('.readyCanvas')
    overlay.classList.add('hiddenReady')
    canvas.classList.add('hiddenReady')
    setTimeout(() => {
      overlay.remove()
      canvas.remove()
    }, 1000)
  },
  el: '#app',
  // store,
  router,
  render: h => h(App)
})
