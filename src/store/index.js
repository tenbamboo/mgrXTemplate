import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let state = {
  rootUserId: 0,
  menuList: []
}
// if (process.env.NODE_ENV === 'development') {
//   state.rootUserId = Cain.getCookie('rootUserName') || 1001
// }

const mutations = {}
const actions = {}
const getters = {}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
