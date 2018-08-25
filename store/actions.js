import { auth, GoogleAuthProvider } from '~/plugins/firebase'

export const autoSignIn = ({ commit }, payload) => {
  commit('setUser', payload)
}

export const signInWithGoogle = ({ commit }) => {
  return new Promise((resolve, reject) => {
    auth.signInWithRedirect(GoogleAuthProvider)
    resolve()
  })
}

export const signOut = ({ commit }) => {
  auth.signOut()
    .then(() => {
      commit('setUser', null)
    })
    .catch((error) => {
      console.log(error)
    })
}
