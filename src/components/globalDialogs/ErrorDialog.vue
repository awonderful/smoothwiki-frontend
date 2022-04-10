<template>
  <v-snackbar 
    v-model="dialog.show" 
    :timeout="dialog.duration"
    :multi-line="true"
    centered
  >
    <v-icon color="error">{{mdiAlert}}</v-icon>
    {{dialog.message}}
  </v-snackbar>
</template>

<script>
import { mdiAlert } from '@mdi/js'

export default {
  name: 'global-error-dialog',
  computed: {
    dialog () {
      return this.$state.globalDialogs.errorDialog
    }
  },
  data: function () {
    return {
      mdiAlert,
    }
  }
}
</script>