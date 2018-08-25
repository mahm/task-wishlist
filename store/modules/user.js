const state = {
  data: {}
}

const mutations = {
  setUser (state, payload) {
    state.data = payload
  }
}

export default {
  state,
  mutations
}
