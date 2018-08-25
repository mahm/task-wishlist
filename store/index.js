import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import groups from './modules/groups'
import user from './modules/user'
import tasks from './modules/tasks'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
Vue.config.debug = debug

const createStore = () => {
  return new Vuex.Store({
    modules: { auth, groups, user, tasks },
    strict: false,
    plugins: debug ? [createLogger()] : []
  })
}
export default createStore
