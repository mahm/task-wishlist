import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
Vue.config.debug = debug

const createStore = () => {
  return new Vuex.Store({
    modules: { user },
    actions,
    getters,
    strict: false,
    plugins: debug ? [createLogger()] : []
  })
}
export default createStore
