export default function ({ store, route, redirect }) {
  console.log(store.getters.user)
  if (!store.getters.isAuthenticated && route.name !== 'login') {
    redirect('/login')
  }
  if (store.getters.isAuthenticated && route.name === 'login') {
    redirect('/')
  }
}
