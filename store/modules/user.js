import { app } from '~/plugins/firebase'

const db = app.firestore()
const usersRef = db.collection('users')
const groupsRef = db.collection('groups')
const participationsRef = db.collection('participations')

export default {
  namespaced: true,
  unsubscribe: null,

  state () {
    return {
      id: null,
      name: '',
      photoURL: ''
    }
  },
  mutations: {
    init (state) {
      state.id = null
    },
    setUserData (state, payload) {
      state.id = payload.uid
      state.name = payload.name
      state.photoURL = payload.photoURL
    }
  },
  getters: {
    uid: (state) => state.id,
    data: (state) => { 
      return {
        id: state.id,
        name: state.name,
        photoURL: state.photoURL
      }
    },
    isOwner: (state) => (obj) => {
      return obj.owner.id === state.id
    },
    userRef: (state) => usersRef.doc(state.id)
  },
  actions: {
    clear ({ commit }) {
      commit('init')
    },
    prepareUser ({ commit }, payload) {
      usersRef.doc(payload.uid).set(payload, { merge: true })
        .then((doc) => {
          commit('setUserData', payload)
        })
        .catch(e => console.log('user/prepareUser error: ', e))
    },
    addParticipation ({ state }, payload) {
      participationsRef.add({ user: usersRef.doc(state.id), group: payload.groupRef })
        .then(() => {
          // nothing
        })
        .catch(e => console.log('user/addParticipation error: ', e))
    },
    inviteToGroup ({ state }, payload) {
      const _payload = {
        user: usersRef.doc(payload.uid),
        group: groupsRef.doc(payload.groupId)
      }
      participationsRef.add(_payload)
        .then(() => {
          // nothing
        })
        .catch(e => console.log('user/inviteToGroup error: ', e))
    }
  }
}
