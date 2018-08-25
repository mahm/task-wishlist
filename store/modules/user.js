import { app } from '~/plugins/firebase'

const db = app.firestore()
const usersRef = db.collection('users')
const participationsRef = db.collection('participations')

export default {
  namespaced: true,
  unsubscribe: null,

  state () {
    return {
      id: null,
      invitations: {}
    }
  },
  mutations: {
    init (state) {
      state.id = null
      state.invitations = {}
    },
    setId (state, userId) {
      state.id = userId
    }
  },
  getters: {
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
    startListener ({ commit, dispatch }, payload) {
      if (this.unsubscribe) {
        console.warn('user/listener is running: ', this.unsubscribe)
        this.unsubscribe()
        this.unsubscribe = null
      }
      this.unsubscribe = usersRef.doc(payload.id).onSnapshot(doc => {
        commit('set', {
          id: doc.id,
          participations: doc.data().participations,
          invitations: doc.data().invitations
        })
        // participationsが更新されたらgroupsを再読込する
        dispatch('groups/startListener', null, { root: true })
      })
    },
    stopListener () {
      if (this.unsubscribe) {
        console.warn('user/listener is stopping: ', this.unsubscribe)
        this.unsubscribe()
        this.unsubscribe = null
      }
    },
    addParticipation ({ state }, payload) {
      participationsRef.add({ user: usersRef.doc(state.id), group: payload.groupRef })
        .then(() => {
          // nothing
        })
        .catch(e => console.log('user/addParticipation error: ', e))
    }
  }
}
