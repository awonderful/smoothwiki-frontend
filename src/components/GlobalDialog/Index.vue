<template>
  <div>
    <confirm-dialog></confirm-dialog>
    <error-dialog></error-dialog>
  </div>
</template>

<script>
import ConfirmDialog from './ConfirmDialog.vue'
import ErrorDialog from './ErrorDialog.vue'

export default {
  name: 'global-dialog',
  components: { ConfirmDialog, ErrorDialog }
}
</script>