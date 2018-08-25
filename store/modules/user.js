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
      id: null
    }
  },
  mutations: {
    init (state) {
      state.id = null
    },
    setId (state, userId) {
      state.id = userId
    }
  },
  getters: {
    uid: (state) => state.id,
    isOwner: (state) => (obj) => {
      return obj.owner.id === state.id
    },
    userRef: (state) => usersRef.doc(state.id)
  },
  actions: {
    clear ({ commit }) {
      commit('init')
    },
    prepareUser ({ commit }, userId) {
      usersRef.doc(userId).set({}, { merge: true })
        .then((doc) => {
          commit('setId', userId)
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
