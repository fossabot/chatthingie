import Vuex from 'vuex'
import Vue from 'vue'

import security from './modules/security'
import snackbar from './modules/snackbar'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    security,
    snackbar
  },
  strict: true
})
