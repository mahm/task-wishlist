export const user = (state) => {
  return state.user.data
}

export const isAuthenticated = (state) => {
  return Object.keys(state.user.data).length
}
