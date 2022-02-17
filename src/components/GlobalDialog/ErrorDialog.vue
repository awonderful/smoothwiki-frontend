<template>
  <v-snackbar 
    v-model="dialog.show" 
    :timeout="dialog.duration"
    :multi-line="true"
    centered
  >
    <v-icon color="error">mdi-alert</v-icon>
    {{dialog.message}}
  </v-snackbar>
</template>

<script>
  export default {
    name: 'global-error-dialog',
    computed: {
      dialog () {
        return this.$state.globalDialogs.errorDialog
      }
    }
  }
</script>