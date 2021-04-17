<template>
  <v-snackbar v-model="dialog.show" :timeout="dialog.duration">{{dialog.message}}</v-snackbar>
</template>

<script>
  export default {
    name: 'global-confirm-dialog',
    computed: {
      dialog () {
        return this.$state.globalDialogs.errorDialog
      }
    }
  }
</script>