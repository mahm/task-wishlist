export const user = (state) => {
  return state.user
}

export const isAuthenticated = (state) => {
  return Object.keys(state.user).length
}
