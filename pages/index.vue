<template>
  <v-container>
    <v-container>
      <v-layout row>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-btn slot="activator" color="primary" dark>新しくグループをつくる</v-btn>
          <v-card>
            <v-card-title>
              <span class='headline'>新しいグループ</span>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="group.name" placeholder="グループ名を入力してください"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">閉じる</v-btn>
              <v-btn color="blue darken-1" flat @click="addGroup">追加</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-layout row>
        </v-layout>
      </v-layout>
    </v-container>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex
          v-for="group in groups"
          :key="group.id"
          xs12
        >
          <v-card>
            <v-card-text>
              <h2>{{group.name}}</h2>
            </v-card-text>
            <v-card-actions>
              <v-btn color="blue darken-1" flat>もっと見る</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat>メールアドレスで招待</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('groups/clear')
    this.$store.dispatch('groups/startListener')
  },
  destroyed () {
    this.$store.dispatch('groups/stopListener')
  },
  data () {
    return {
      dialog: false,
      group: {
        name: ''
      }
    }
  },
  methods: {
    async addGroup () {
      await this.$store.dispatch('groups/add', { name: this.$data.group.name })
      this.$data.group.name = ''
      this.$data.dialog = false
    }
  },
  computed: {
    groups () {
      return this.$store.getters['groups/data']
    }
  }
}
</script>
