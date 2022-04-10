<template>
  <v-dialog v-model="dialog.show" width="30em">
    <v-card>
      <v-toolbar dark flat color="primary">
        <v-toolbar-title>
          {{ dialog.title }}
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon @click="close()">
          <v-icon>{{mdiClose}}</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        {{ dialog.desc }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="cancel()">{{ dialog.cancelText }}</v-btn>
        <v-btn color="primary" text @click="ok()">{{ dialog.okText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  name: 'global-confirm-dialog',
  computed: {
    dialog () {
      return this.$state.globalDialogs.confirmDialog
    }
  },
  data: function () {
    return {
      mdiClose,
    }
  },
  methods: {
    close () {
      this.$state.globalDialogs.closeConfirmDialog()
    },
    ok () {
      if (this.dialog.okFunc !== null) {
        this.dialog.okFunc()
      }
      this.$state.globalDialogs.closeConfirmDialog()
    },
    cancel () {
      if (this.dialog.cancelFunc !== null) {
        this.dialog.cancelFunc()
      }
      this.$state.globalDialogs.closeConfirmDialog()
    }
  }
}
</script>