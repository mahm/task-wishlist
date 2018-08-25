import Vue from 'vue'
import { app } from '~/plugins/firebase'

const db = app.firestore()
const groupsRef = db.collection('groups')

export default {
  namespaced: true,
  unsubscribe: null,

  state () {
    return {
      groupId: null,
      data: []
    }
  },
  mutations: {
    init (state, payload) {
      state.groupId = payload.groupId
      state.data = payload.data
    },
    add (state, payload) {
      const index = state.data.findIndex(task => task.id === payload.id)
      if (index === -1) {
        state.data.push(payload)
      }
    },
    set (state, payload) {
      const index = state.data.findIndex(task => task.id === payload.id)
      if (index !== -1) {
        Vue.set(state.data, index, payload)
      }
    },
    remove (state, payload) {
      const index = state.data.findIndex(task => task.id === payload.id)
      if (index !== -1) {
        state.data.splice(index, 1)
      }
    }
  },
  getters: {
    data (state) {
      return state.data
    }
  },
  actions: {
    clear: ({ commit }, groupId) => {
      const payload = { groupId, data: [] }
      commit('init', payload)
    },
    startListener ({ commit }, groupId) {
      if (this.unsubscribe) {
        console.warn('groups/listener is running: ', this.unsubscribe)
        this.unsubscribe()
        this.unsubscribe = null
      }
      groupsRef.doc(groupId).collection('tasks')
        .onSnapshot(querySnapshot => {
          querySnapshot.docChanges().forEach(change => {
            const payload = {
              id: change.doc.id,
              title: change.doc.data().title,
              owner: change.doc.data().owner,
              done: change.doc.data().done,
              doneBy: change.doc.data().doneBy
            }
            if (change.type === 'added') {
              commit('add', payload)
            } else if (change.type === 'modified') {
              commit('set', payload)
            } else if (change.type === 'removed') {
              commit('remove', payload)
            }    
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
    add ({ state, rootGetters }, payload) {
      const _payload = {
        title: payload.title,
        owner: rootGetters['user/data']
      }
      groupsRef.doc(state.groupId).collection('tasks').add(_payload)
        .then(doc => {
          // nothing
        })
        .catch(e => console.log('tasks/add error: ', e))
    },
    delete ({ state }, payload) {
      groupsRef.doc(state.groupId).collection('tasks').doc(payload.id).delete()
        .then(() => {
          // nothing
        })
        .catch(e => console.log('tasks/delete error: ', e))
    },
    done ({ state, rootGetters }, payload) {
      const _payload = {
        done: true,
        doneBy: rootGetters['user/data']
      }
      groupsRef.doc(state.groupId).collection('tasks').doc(payload.id).set(_payload, { merge: true })
        .then(() => {
          // nothing
        })
        .catch(e => console.log('tasks/done error: ', e))
    }
  }
}
