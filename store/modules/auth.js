import { auth, GoogleAuthProvider } from '~/plugins/firebase'

export default {
  namespaced: true,

  state () {
    return {
      data: {}
    }
  },
  mutations: {
    setAuth (state, payload) {
      state.data = payload
    }
  },
  getters: {
    data: (state) => {
      return state.data
    },
    isAuthenticated: (state) => {
      return Object.keys(state.data).length
    }
  },
  actions: {
    setAuth: ({ state, commit, dispatch }, payload) => {
      commit('setAuth', payload)
      dispatch('user/prepareUser', state.data.uid, { root: true })
    },
    signInWithGoogle: ({ commit }) => {
      return new Promise((resolve, reject) => {
        auth.signInWithRedirect(GoogleAuthProvider)
        resolve()
      })
    },
    signOut: ({ commit }) => {
      auth.signOut()
        .then(() => {
          commit('setAuth', null)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
