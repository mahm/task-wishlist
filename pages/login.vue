<template>
  <v-container>
    <v-layout text-xs-center>
      <v-flex xs12 mb8 offset-md2>
        <div class='wrapper'>
          <div v-if="loading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else>
            <login-form></login-form>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>  
</template>

<script>
import LoginForm from '~/components/LoginForm'
import firebase from '~/plugins/firebase'

export default {
  async mounted () {
    const authData = await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((authData) => resolve(authData || null))
    })
    if (authData) {
      this.$store.dispatch('auth/setAuth', authData)
      this.$router.push('/')
    } else {
      this.$data.loading = false
    }
  },
  data () {
    return {
      loading: true
    }
  },
  components: {
    LoginForm
  }
}
</script>
