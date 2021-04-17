import Vue from 'vue'

export const GlobalDialogState = new Vue({
  data: {
    confirmDialog: {
      show: false,
      title: '',
      desc: '',
      okText: '',
      okFunc: null,
      cancelText: '',
      cancelFunc: null
    },

    errorDialog: {
      show: false,
      message: '',
      duration: 3000
    }
  },
  methods: {
    closeConfirmDialog () {
      this.confirmDialog.show = false
    },
    showConfirmDialog (dialog) {
      const defaultDialog = {
        title: '',
        desc: '',
        okText: 'ok',
        okFunc: null,
        cancelText: 'cancel',
        cancelFunc: null
      }
      Object.assign(this.confirmDialog, defaultDialog)
      Object.assign(this.confirmDialog, dialog)
      this.confirmDialog.show = true
    },

    showErrorDialog(dialog) {
      const defaultDialog = {
        message: '',
        duration: 3000
      }
      Object.assign(this.errorDialog, defaultDialog)
      Object.assign(this.errorDialog, dialog)
      this.errorDialog.show = true
    },
    closeErrorDialog() {
      this.errorDialog.show = false
    }
  }
})