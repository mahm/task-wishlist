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
      data: []
    }
  },
  mutations: {
    init (state, payload) {
      state.data = payload
    },
    add (state, payload) {
      const index = state.data.findIndex(group => group.id === payload.id)
      if (index === -1) {
        state.data.push(payload)
      }
    },
    remove (state, payload) {
      const index = state.data.findIndex(group => group.id === payload.id)
      if (index !== -1) {
        state.data.splice(index, 1)
      }
    }
  },
  getters: {
    data (state) {
      return state.data
    }
  },
  actions: {
    clear: ({ commit }) => {
      commit('init', [])
    },
    startListener ({ commit, rootState }) {
      if (this.unsubscribe) {
        console.warn('groups/listener is running: ', this.unsubscribe)
        this.unsubscribe()
        this.unsubscribe = null
      }
      participationsRef
        .where('user', '==', usersRef.doc(rootState.auth.data.uid))
        .onSnapshot(querySnapshot => {
          querySnapshot.docChanges().forEach(change => {
            groupsRef.doc(change.doc.data().group.id).get()
              .then((group) => {
                if (group.exists) {
                  const payload = {
                    id: group.id,
                    name: group.data().name,
                    owner: group.data().owner
                  }
                  if (change.type === 'added') {
                    commit('add', payload)
                  } else if (change.type === 'removed') {
                    commit('remove', payload)
                  }
                }
              })
          })
        }, (e) => { console.error(e) })
    },
    stopListener () {
      if (this.unsubscribe) {
        console.warn('groups/listener is stopping: ', this.unsubscribe)
        this.unsubscribe()
        this.unsubscribe = null
      }
    },
    add: ({ dispatch, rootState }, payload) => {
      const _payload = {
        ...payload,
        owner: usersRef.doc(rootState.auth.data.uid)
      }
      groupsRef.add(_payload)
        .then(doc => {
          dispatch('user/addParticipation', { groupRef: doc }, { root: true })
        })
        .catch(e => console.log('groups/add error: ', e))
    }
  }
}
