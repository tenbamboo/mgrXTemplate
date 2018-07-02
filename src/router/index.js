import Vue from 'vue'
import Router from 'vue-router'
import { Loading } from 'element-ui'
Vue.use(Router)

const routes = [
  {
    path: '/',
    component: resolve => require(['@/components/Index'], resolve),
    name: '主页'
  },
  {
    path: '/userManage',
    component: resolve => require(['@/components/UserManage'], resolve),
    name: '用户管理'
  },
  {
    path: '/authManage',
    component: resolve => require(['@/components/AuthManage'], resolve),
    name: '审核管理'
  },
  {
    path: '/applyManage',
    component: resolve => require(['@/components/ApplyManage'], resolve),
    name: '申请管理'
  }
]
let loading = ''
const router = new Router({
  linkActiveClass: 'active',
  routes
})
// let menuList = Cain.getCookie('menuList')
router.beforeEach((to, from, next) => {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.2)'
  })

  next()
})
router.afterEach((to, from) => {
  loading.close()
  setTimeout(() => {
    loading.close()
  }, 500)

  if (to.matched.length === 0) {
    router.replace({ path: '/404', query: { dateTime: new Date().getTime(), path: to.fullPath } })
  }
})

export default router
