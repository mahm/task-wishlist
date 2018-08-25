<template>
  <v-layout>
    <v-flex text-xs-center xs12 sm6 offset-sm3>
      <h2 class='title'>Sign in with Google</h2>
      <v-btn class='mb-2' primary @click="googleSignUp">Start with Google Account</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  methods: {
    googleSignUp () {
      this.$store.dispatch('auth/signInWithGoogle')
        .then(() => {
          console.log('sign in successful')
        })
        .catch((e) => {
          console.log(e.message)
        })
    }
  }
}
</script>
