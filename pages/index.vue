<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card color="teal lighten-5">
          <v-card-text>
            友達にグループへ招待してもらってね！ あなたのUIDは <b>{{uid}}</b> だよ
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
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
      </v-flex>
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
            <div v-if="isOwner(group)">
              <v-btn color="blue darken-1" flat @click="openInviteDialog(group)">UIDで招待</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-dialog v-model="invite.dialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class='headline'>{{invite.groupName}} への招待</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="invite.uid" placeholder="お友達のUIDを指定してください"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="closeInviteDialog">閉じる</v-btn>
            <v-btn color="blue darken-1" flat @click="inviteAndClose">招待</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      },
      invite: {
        dialog: false,
        groupId: null,
        groupName: '',
        uid: ''
      },
      snackbar: {
        show: false,
        text: ''
      }
    }
  },
  methods: {
    async addGroup () {
      await this.$store.dispatch('groups/add', { name: this.$data.group.name })
      this.$data.group.name = ''
      this.$data.dialog = false
    },
    openInviteDialog (group) {
      this.$data.invite.dialog = true
      this.$data.invite.groupId = group.id
      this.$data.invite.groupName = group.name
    },
    closeInviteDialog () {
      this.$data.invite.dialog = false
      this.$data.invite.groupId = null
      this.$data.invite.groupName = ''
      this.$data.invite.uid = ''
    },
    inviteAndClose () {
      const payload = {
        uid: this.$data.invite.uid,
        groupId: this.$data.invite.groupId
      }
      this.$store.dispatch('user/inviteToGroup', payload).then(() => {
        this.$data.snackbar.show = true
        this.$data.snackbar.text = 'グループに招待しました'
      })
      this.closeInviteDialog()
    },
    isOwner (group) {
      return this.$store.getters['user/isOwner'](group)
    }
  },
  computed: {
    uid () {
      return this.$store.getters['user/uid']
    },
    groups () {
      return this.$store.getters['groups/data']
    }
  }
}
</script>
