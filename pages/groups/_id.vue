<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <p>
          <nuxt-link to="/">前のページに戻る</nuxt-link>
        </p>
        <v-form v-model="valid">
          <v-text-field v-model="newTask.title" label="頼みたいことを書いてね" required></v-text-field>
          <v-btn :disabled="!valid" @click="addTask">登録</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs4 v-for="task in tasks" :key="task.id">
        <v-card>
          <v-card-text>{{task.title}}</v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" flat>やったよ！</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" flat v-if="isOwner(task)" @click="deleteTask(task)">削除</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar.show" top>
      {{ snackbar.text }}
      <v-btn flat @click="snackbar.show = false">閉じる</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('tasks/clear', this.$route.params.id)
    this.$store.dispatch('tasks/startListener', this.$route.params.id)
  },
  destroyed () {
    this.$store.dispatch('tasks/stopListener')
  },
  computed: {
    tasks () {
      return this.$store.getters['tasks/data']
    }
  },
  data () {
    return {
      valid: false,
      newTask: { title: '' },
      snackbar: {
        show: false,
        text: ''
      }
    }
  },
  methods: {
    addTask () {
      const payload = {
        title: this.$data.newTask.title
      }
      this.$store.dispatch('tasks/add', payload).then(() => {
        this.$data.newTask.title = ''
        this.$data.snackbar.show = true
        this.$data.snackbar.text = "新しいタスクを登録しました"
      })
    },
    deleteTask (task) {
      this.$store.dispatch('tasks/delete', { id: task.id }).then(() => {
        this.$data.snackbar.show = true
        this.$data.snackbar.text = "タスクを削除しました"
      })
    },
    isOwner (task) {
      return this.$store.getters['user/isOwner'](task)
    }
  }
}
</script>
